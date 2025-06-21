import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useRssFeeds } from '@/hooks/useRssFeeds';
import { useAiPrompts } from '@/hooks/useAiPrompts';
import { useXCredentials } from '@/hooks/useXCredentials';
import { useSchedules } from '@/hooks/useSchedules';
import { useProfile } from '@/hooks/useProfile';
import { CalendarDays, Clock, Globe, Rss, Bot, Twitter, Image, Video, Plus } from 'lucide-react';

const TIMEZONES = [
  {
    value: 'UTC',
    label: 'UTC',
    offset: 0
  },
  {
    value: 'Europe/London',
    label: 'London (GMT)',
    offset: 0
  },
  {
    value: 'Europe/Paris',
    label: 'Paris (CET)',
    offset: 1
  },
  {
    value: 'Europe/Istanbul',
    label: 'Istanbul (TRT)',
    offset: 3
  },
  {
    value: 'America/New_York',
    label: 'New York (EST)',
    offset: -5
  },
  {
    value: 'America/Los_Angeles',
    label: 'Los Angeles (PST)',
    offset: -8
  },
  {
    value: 'Asia/Tokyo',
    label: 'Tokyo (JST)',
    offset: 9
  },
  {
    value: 'Asia/Shanghai',
    label: 'Shanghai (CST)',
    offset: 8
  },
  // Middle East and Arabian Countries
  {
    value: 'Asia/Dubai',
    label: 'Dubai (GST)',
    offset: 4
  },
  {
    value: 'Asia/Riyadh',
    label: 'Riyadh (AST)',
    offset: 3
  },
  {
    value: 'Asia/Kuwait',
    label: 'Kuwait (AST)',
    offset: 3
  },
  {
    value: 'Asia/Qatar',
    label: 'Doha (AST)',
    offset: 3
  },
  {
    value: 'Asia/Bahrain',
    label: 'Bahrain (AST)',
    offset: 3
  },
  {
    value: 'Asia/Muscat',
    label: 'Muscat (GST)',
    offset: 4
  },
  {
    value: 'Asia/Baghdad',
    label: 'Baghdad (AST)',
    offset: 3
  },
  {
    value: 'Asia/Tehran',
    label: 'Tehran (IRST)',
    offset: 3.5
  },
  {
    value: 'Asia/Amman',
    label: 'Amman (EET)',
    offset: 2
  },
  {
    value: 'Asia/Beirut',
    label: 'Beirut (EET)',
    offset: 2
  },
  {
    value: 'Asia/Damascus',
    label: 'Damascus (EET)',
    offset: 2
  },
  {
    value: 'Africa/Cairo',
    label: 'Cairo (EET)',
    offset: 2
  },
  {
    value: 'Asia/Jerusalem',
    label: 'Jerusalem (IST)',
    offset: 2
  }
];

const DAYS_OF_WEEK = [{
  key: 'monday',
  label: 'Monday',
  short: 'Mon'
}, {
  key: 'tuesday',
  label: 'Tuesday',
  short: 'Tue'
}, {
  key: 'wednesday',
  label: 'Wednesday',
  short: 'Wed'
}, {
  key: 'thursday',
  label: 'Thursday',
  short: 'Thu'
}, {
  key: 'friday',
  label: 'Friday',
  short: 'Fri'
}, {
  key: 'saturday',
  label: 'Saturday',
  short: 'Sat'
}, {
  key: 'sunday',
  label: 'Sunday',
  short: 'Sun'
}];

interface ScheduleFormProps {
  onSuccess: () => void;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    name: '',
    rss_feed_id: '',
    ai_prompt_id: '',
    x_account_id: '',
    timezone: '',
    start_time: '',
    end_time: '',
    minute_intervals: '',
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
    image_option: false,
    video_option: false
  });
  const {
    rssFeeds,
    loading: rssLoading
  } = useRssFeeds();
  const {
    aiPrompts,
    loading: promptsLoading
  } = useAiPrompts();
  const {
    xCredentials,
    loading: xLoading
  } = useXCredentials();
  const {
    createSchedule
  } = useSchedules();
  const {
    profile
  } = useProfile();
  const selectedRssFeed = rssFeeds.find(feed => feed.id === formData.rss_feed_id);
  const isXSource = selectedRssFeed?.is_x_source || false;
  const convertTimeToUTC = (localTime: string, timezone: string): string => {
    const timezoneInfo = TIMEZONES.find(tz => tz.value === timezone);
    if (!timezoneInfo || !localTime) return localTime;
    
    const [hours, minutes] = localTime.split(':').map(Number);
    let utcHours = hours - timezoneInfo.offset;
    
    // Handle fractional offsets (like Tehran +3.5)
    if (timezoneInfo.offset % 1 !== 0) {
      const fractionalPart = timezoneInfo.offset % 1;
      const minuteOffset = fractionalPart * 60;
      let totalMinutes = minutes - minuteOffset;
      
      if (totalMinutes < 0) {
        totalMinutes += 60;
        utcHours -= 1;
      } else if (totalMinutes >= 60) {
        totalMinutes -= 60;
        utcHours += 1;
      }
      
      minutes = totalMinutes;
    }
    
    if (utcHours < 0) utcHours += 24;
    if (utcHours >= 24) utcHours -= 24;
    
    return `${utcHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.rss_feed_id || !formData.ai_prompt_id || !formData.x_account_id || !formData.timezone || !formData.start_time || !formData.end_time || !formData.minute_intervals) {
      return;
    }
    const start_time_utc = convertTimeToUTC(formData.start_time, formData.timezone);
    const end_time_utc = convertTimeToUTC(formData.end_time, formData.timezone);
    await createSchedule({
      name: formData.name,
      rss_feed_id: formData.rss_feed_id,
      ai_prompt_id: formData.ai_prompt_id,
      x_account_id: formData.x_account_id,
      timezone: formData.timezone,
      start_time_utc,
      end_time_utc,
      minute_intervals: parseInt(formData.minute_intervals),
      monday: formData.monday,
      tuesday: formData.tuesday,
      wednesday: formData.wednesday,
      thursday: formData.thursday,
      friday: formData.friday,
      saturday: formData.saturday,
      sunday: formData.sunday,
      image_option: formData.image_option,
      video_option: isXSource ? formData.video_option : false
    });
    setFormData({
      name: '',
      rss_feed_id: '',
      ai_prompt_id: '',
      x_account_id: '',
      timezone: '',
      start_time: '',
      end_time: '',
      minute_intervals: '',
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
      image_option: false,
      video_option: false
    });
    onSuccess();
  };
  const limits = useSchedules().getAccessLimits();
  return <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Plus className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Create New Schedule</h3>
        </div>
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full border">
            <span className="font-semibold">{profile?.access_level || 'FREE'} Plan:</span>
            <span>{limits.maxSchedules} schedule(s)</span>
          </span>
          <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full border">
            <span>min {limits.minInterval} minute intervals</span>
          </span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Schedule Name */}
        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                Schedule Name
              </Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                placeholder="Enter a descriptive name for your schedule" 
                required 
                className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Source Configuration */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-blue-50">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Rss className="w-4 h-4 text-blue-600" />
              </div>
              Source Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Rss className="w-4 h-4" />
                  RSS Feed
                </Label>
                <Select value={formData.rss_feed_id} onValueChange={value => setFormData({ ...formData, rss_feed_id: value })}>
                  <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 rounded-xl">
                    <SelectValue placeholder="Select RSS feed" />
                  </SelectTrigger>
                  <SelectContent>
                    {rssFeeds.map(feed => (
                      <SelectItem key={feed.id} value={feed.id}>
                        <div className="flex items-center gap-2">
                          <span>{feed.name}</span>
                          {feed.is_x_source && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">X Source</span>}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  AI Prompt
                </Label>
                <Select value={formData.ai_prompt_id} onValueChange={value => setFormData({ ...formData, ai_prompt_id: value })}>
                  <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 rounded-xl">
                    <SelectValue placeholder="Select AI prompt" />
                  </SelectTrigger>
                  <SelectContent>
                    {aiPrompts.map(prompt => (
                      <SelectItem key={prompt.id} value={prompt.id}>
                        {prompt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Twitter className="w-4 h-4" />
                  X Account
                </Label>
                <Select value={formData.x_account_id} onValueChange={value => setFormData({ ...formData, x_account_id: value })}>
                  <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 rounded-xl">
                    <SelectValue placeholder="Select X account" />
                  </SelectTrigger>
                  <SelectContent>
                    {xCredentials.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.account_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Configuration */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
              Schedule Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Days of the Week */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                Days of the Week
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {DAYS_OF_WEEK.map(day => (
                  <div key={day.key} className="bg-gray-50 border border-gray-200 rounded-xl p-3 hover:bg-blue-50 hover:border-blue-200 transition-colors px-[9px]">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id={day.key} 
                        checked={formData[day.key as keyof typeof formData] as boolean} 
                        onCheckedChange={checked => setFormData({ ...formData, [day.key]: checked })} 
                      />
                      <Label htmlFor={day.key} className="text-sm font-medium cursor-pointer">
                        <span className="md:hidden">{day.short}</span>
                        <span className="hidden md:inline">{day.label}</span>
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time and Timezone */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Timezone
                </Label>
                <Select value={formData.timezone} onValueChange={value => setFormData({ ...formData, timezone: value })}>
                  <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 rounded-xl">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map(tz => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="start_time" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Start Time
                </Label>
                <Input 
                  id="start_time" 
                  type="time" 
                  value={formData.start_time} 
                  onChange={e => setFormData({ ...formData, start_time: e.target.value })} 
                  required 
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl" 
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="end_time" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  End Time
                </Label>
                <Input 
                  id="end_time" 
                  type="time" 
                  value={formData.end_time} 
                  onChange={e => setFormData({ ...formData, end_time: e.target.value })} 
                  required 
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl" 
                />
              </div>
            </div>

            {/* Interval */}
            <div className="space-y-3">
              <Label htmlFor="minute_intervals" className="text-sm font-semibold text-gray-700">
                Minute Intervals
              </Label>
              <Input 
                id="minute_intervals" 
                type="number" 
                min={limits.minInterval} 
                value={formData.minute_intervals} 
                onChange={e => setFormData({ ...formData, minute_intervals: e.target.value })} 
                placeholder={`Minimum ${limits.minInterval} minutes`} 
                required 
                className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl" 
              />
              <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
                How often the app should check for new content and potentially create posts (in minutes)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Media Options */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-4 bg-gradient-to-r from-green-50 to-blue-50">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Image className="w-4 h-4 text-green-600" />
              </div>
              Media Options
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="image_option" 
                  checked={formData.image_option} 
                  onCheckedChange={checked => setFormData({ ...formData, image_option: checked as boolean })} 
                />
                <div className="flex-1">
                  <Label htmlFor="image_option" className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1 cursor-pointer">
                    <Image className="w-4 h-4" />
                    Image Option
                  </Label>
                  <p className="text-sm text-gray-600">
                    If the source content has an image, attach this image to your new post
                  </p>
                </div>
              </div>
            </div>

            <div className={`border border-gray-200 rounded-xl p-4 transition-colors ${!isXSource ? 'bg-gray-100' : 'bg-gray-50'}`}>
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="video_option" 
                  checked={formData.video_option} 
                  disabled={!isXSource} 
                  onCheckedChange={checked => setFormData({ ...formData, video_option: checked as boolean })} 
                />
                <div className="flex-1">
                  <Label htmlFor="video_option" className={`text-sm font-semibold flex items-center gap-2 mb-1 cursor-pointer ${!isXSource ? 'text-gray-400' : 'text-gray-700'}`}>
                    <Video className="w-4 h-4" />
                    Video Option {!isXSource && '(X Source required)'}
                  </Label>
                  <p className={`text-sm ${!isXSource ? 'text-gray-400' : 'text-gray-600'}`}>
                    If the source content has a video, attach the video to your new post (only available for X sources)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg">
          <Plus className="w-5 h-5 mr-2" />
          Create Schedule
        </Button>
      </form>
    </div>;
};

export default ScheduleForm;
