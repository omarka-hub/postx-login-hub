
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

const TIMEZONES = [
  { value: 'UTC', label: 'UTC', offset: 0 },
  { value: 'Europe/London', label: 'London (GMT)', offset: 0 },
  { value: 'Europe/Paris', label: 'Paris (CET)', offset: 1 },
  { value: 'Europe/Istanbul', label: 'Istanbul (TRT)', offset: 3 },
  { value: 'America/New_York', label: 'New York (EST)', offset: -5 },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST)', offset: -8 },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)', offset: 9 },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)', offset: 8 },
];

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

interface ScheduleFormProps {
  onSuccess: () => void;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ onSuccess }) => {
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
    video_option: false,
  });

  const { rssFeeds, loading: rssLoading } = useRssFeeds();
  const { aiPrompts, loading: promptsLoading } = useAiPrompts();
  const { xCredentials, loading: xLoading } = useXCredentials();
  const { createSchedule } = useSchedules();
  const { profile } = useProfile();

  const selectedRssFeed = rssFeeds.find(feed => feed.id === formData.rss_feed_id);
  const isXSource = selectedRssFeed?.is_x_source || false;

  const convertTimeToUTC = (localTime: string, timezone: string): string => {
    const timezoneInfo = TIMEZONES.find(tz => tz.value === timezone);
    if (!timezoneInfo || !localTime) return localTime;

    const [hours, minutes] = localTime.split(':').map(Number);
    let utcHours = hours - timezoneInfo.offset;
    
    if (utcHours < 0) utcHours += 24;
    if (utcHours >= 24) utcHours -= 24;
    
    return `${utcHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.rss_feed_id || !formData.ai_prompt_id || 
        !formData.x_account_id || !formData.timezone || !formData.start_time || 
        !formData.end_time || !formData.minute_intervals) {
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
      video_option: isXSource ? formData.video_option : false,
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
      video_option: false,
    });
    
    onSuccess();
  };

  const limits = useSchedules().getAccessLimits();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Schedule</CardTitle>
        <p className="text-sm text-muted-foreground">
          {profile?.access_level} Plan: {limits.maxSchedules} schedule(s), min {limits.minInterval} minute intervals
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Schedule Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter schedule name"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>RSS Feed</Label>
              <Select value={formData.rss_feed_id} onValueChange={(value) => setFormData({ ...formData, rss_feed_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select RSS feed" />
                </SelectTrigger>
                <SelectContent>
                  {rssFeeds.map((feed) => (
                    <SelectItem key={feed.id} value={feed.id}>
                      {feed.name} {feed.is_x_source ? '(X Source)' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>AI Prompt</Label>
              <Select value={formData.ai_prompt_id} onValueChange={(value) => setFormData({ ...formData, ai_prompt_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select AI prompt" />
                </SelectTrigger>
                <SelectContent>
                  {aiPrompts.map((prompt) => (
                    <SelectItem key={prompt.id} value={prompt.id}>
                      {prompt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>X Account</Label>
              <Select value={formData.x_account_id} onValueChange={(value) => setFormData({ ...formData, x_account_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select X account" />
                </SelectTrigger>
                <SelectContent>
                  {xCredentials.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.account_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Days of the Week</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={day.key}
                    checked={formData[day.key as keyof typeof formData] as boolean}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, [day.key]: checked })
                    }
                  />
                  <Label htmlFor={day.key} className="text-sm">
                    {day.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select value={formData.timezone} onValueChange={(value) => setFormData({ ...formData, timezone: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minute_intervals">Minute Intervals</Label>
            <Input
              id="minute_intervals"
              type="number"
              min={limits.minInterval}
              value={formData.minute_intervals}
              onChange={(e) => setFormData({ ...formData, minute_intervals: e.target.value })}
              placeholder={`Minimum ${limits.minInterval} minutes`}
              required
            />
            <p className="text-sm text-muted-foreground">
              How often the app should run (in minutes)
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="image_option"
                checked={formData.image_option}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, image_option: checked as boolean })
                }
              />
              <Label htmlFor="image_option" className="text-sm">
                Image Option
              </Label>
            </div>
            <p className="text-sm text-muted-foreground ml-6">
              If the returned post has an image, attach this image to your new post
            </p>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="video_option"
                checked={formData.video_option}
                disabled={!isXSource}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, video_option: checked as boolean })
                }
              />
              <Label htmlFor="video_option" className="text-sm">
                Video Option {!isXSource && '(X Source required)'}
              </Label>
            </div>
            <p className="text-sm text-muted-foreground ml-6">
              If the returned post has a video, attach the video to your new post (only available for X sources)
            </p>
          </div>

          <Button type="submit" className="w-full">
            Create Schedule
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ScheduleForm;
