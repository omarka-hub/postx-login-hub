
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Clock, Calendar, Globe } from 'lucide-react';
import { useSchedules, Schedule } from '@/hooks/useSchedules';
import { useRssFeeds } from '@/hooks/useRssFeeds';
import { useAiPrompts } from '@/hooks/useAiPrompts';
import { useXCredentials } from '@/hooks/useXCredentials';

interface SchedulesListProps {
  onRefresh: () => void;
}

const SchedulesList: React.FC<SchedulesListProps> = ({ onRefresh }) => {
  const { schedules, loading, deleteSchedule } = useSchedules();
  const { rssFeeds } = useRssFeeds();
  const { aiPrompts } = useAiPrompts();
  const { xCredentials } = useXCredentials();

  const getRssFeedName = (id: string) => {
    const feed = rssFeeds.find(f => f.id === id);
    return feed ? `${feed.name}${feed.is_x_source ? ' (X)' : ''}` : 'Unknown';
  };

  const getAiPromptName = (id: string) => {
    const prompt = aiPrompts.find(p => p.id === id);
    return prompt ? prompt.name : 'Unknown';
  };

  const getXAccountName = (id: string) => {
    const account = xCredentials.find(x => x.id === id);
    return account ? account.account_name : 'Unknown';
  };

  const getActiveDays = (schedule: Schedule) => {
    const days = [];
    if (schedule.monday) days.push('Mon');
    if (schedule.tuesday) days.push('Tue');
    if (schedule.wednesday) days.push('Wed');
    if (schedule.thursday) days.push('Thu');
    if (schedule.friday) days.push('Fri');
    if (schedule.saturday) days.push('Sat');
    if (schedule.sunday) days.push('Sun');
    return days.join(', ');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      await deleteSchedule(id);
      onRefresh();
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading schedules...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Your Schedules ({schedules.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {schedules.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No schedules created yet. Create your first schedule above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>RSS Feed</TableHead>
                  <TableHead>AI Prompt</TableHead>
                  <TableHead>X Account</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Interval</TableHead>
                  <TableHead>Options</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">{schedule.name}</TableCell>
                    <TableCell>{getRssFeedName(schedule.rss_feed_id)}</TableCell>
                    <TableCell>{getAiPromptName(schedule.ai_prompt_id)}</TableCell>
                    <TableCell>{getXAccountName(schedule.x_account_id)}</TableCell>
                    <TableCell className="text-sm">{getActiveDays(schedule)}</TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {schedule.start_time_utc} - {schedule.end_time_utc} UTC
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Globe className="w-3 h-3" />
                        {schedule.timezone}
                      </div>
                    </TableCell>
                    <TableCell>{schedule.minute_intervals}min</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {schedule.image_option && (
                          <Badge variant="secondary" className="text-xs">
                            Images
                          </Badge>
                        )}
                        {schedule.video_option && (
                          <Badge variant="secondary" className="text-xs">
                            Videos
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(schedule.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SchedulesList;
