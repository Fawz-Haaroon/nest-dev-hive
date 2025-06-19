
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Plus, Megaphone, Target, Package, MessageSquare } from 'lucide-react';
import { useProjectUpdates, useCreateProjectUpdate } from '@/hooks/useProjectUpdates';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface ProjectTimelineProps {
  projectId: string;
  canPost?: boolean;
}

export const ProjectTimeline = ({ projectId, canPost = false }: ProjectTimelineProps) => {
  const { data: updates, isLoading } = useProjectUpdates(projectId);
  const createUpdate = useCreateProjectUpdate();
  const [isPosting, setIsPosting] = useState(false);
  const [newUpdate, setNewUpdate] = useState({
    title: '',
    content: '',
    update_type: 'general' as const
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdate.title.trim() || !newUpdate.content.trim()) return;

    try {
      await createUpdate.mutateAsync({
        project_id: projectId,
        ...newUpdate
      });
      setNewUpdate({ title: '', content: '', update_type: 'general' });
      setIsPosting(false);
    } catch (error) {
      console.error('Failed to post update:', error);
    }
  };

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'milestone': return <Target className="w-4 h-4" />;
      case 'release': return <Package className="w-4 h-4" />;
      case 'announcement': return <Megaphone className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getUpdateColor = (type: string) => {
    switch (type) {
      case 'milestone': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'release': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'announcement': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading timeline...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Project Timeline</h2>
        {canPost && (
          <Button onClick={() => setIsPosting(!isPosting)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Post Update
          </Button>
        )}
      </div>

      {isPosting && (
        <Card>
          <CardHeader>
            <CardTitle>Post New Update</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Update title..."
                value={newUpdate.title}
                onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
                required
              />
              <Select
                value={newUpdate.update_type}
                onValueChange={(value: any) => setNewUpdate({ ...newUpdate, update_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Update</SelectItem>
                  <SelectItem value="milestone">Milestone</SelectItem>
                  <SelectItem value="release">Release</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                placeholder="What's new with your project?"
                value={newUpdate.content}
                onChange={(e) => setNewUpdate({ ...newUpdate, content: e.target.value })}
                rows={4}
                required
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={createUpdate.isPending}>
                  {createUpdate.isPending ? 'Posting...' : 'Post Update'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsPosting(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {updates?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                No updates yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Project updates will appear here to keep everyone informed about progress.
              </p>
            </CardContent>
          </Card>
        ) : (
          updates?.map((update) => (
            <Card key={update.id} className="relative">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={update.author?.avatar_url} />
                    <AvatarFallback>
                      {update.author?.full_name?.[0] || update.author?.username?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getUpdateColor(update.update_type)}>
                        {getUpdateIcon(update.update_type)}
                        <span className="ml-1 capitalize">{update.update_type}</span>
                      </Badge>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        by {update.author?.full_name || update.author?.username}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(update.created_at), { addSuffix: true })}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        {update.title}
                      </h3>
                      <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                        {update.content}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
