
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Reply, Clock } from 'lucide-react';
import { useProjectComments, useCreateComment } from '@/hooks/useProjectComments';
import { useState, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

interface ProjectCommentsProps {
  projectId: string;
}

export const ProjectComments = ({ projectId }: ProjectCommentsProps) => {
  const { user } = useAuth();
  const { data: comments, isLoading } = useProjectComments(projectId);
  const createComment = useCreateComment();
  const [newComment, setNewComment] = useState('');
  const [replyStates, setReplyStates] = useState<Record<string, { isReplying: boolean; content: string }>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      await createComment.mutateAsync({
        project_id: projectId,
        content: newComment
      });
      setNewComment('');
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  const handleReplyToggle = useCallback((commentId: string) => {
    setReplyStates(prev => ({
      ...prev,
      [commentId]: {
        isReplying: !prev[commentId]?.isReplying,
        content: prev[commentId]?.content || ''
      }
    }));
  }, []);

  const handleReplyContentChange = useCallback((commentId: string, content: string) => {
    setReplyStates(prev => ({
      ...prev,
      [commentId]: {
        ...prev[commentId],
        content
      }
    }));
  }, []);

  const handleReply = async (parentId: string) => {
    const replyContent = replyStates[parentId]?.content;
    if (!replyContent?.trim() || !user) return;

    try {
      await createComment.mutateAsync({
        project_id: projectId,
        content: replyContent,
        parent_id: parentId
      });
      setReplyStates(prev => ({
        ...prev,
        [parentId]: { isReplying: false, content: '' }
      }));
    } catch (error) {
      console.error('Failed to post reply:', error);
    }
  };

  const CommentItem = ({ comment, isReply = false }: { comment: any; isReply?: boolean }) => {
    const replyState = replyStates[comment.id] || { isReplying: false, content: '' };
    
    return (
      <div className={`${isReply ? 'ml-12 mt-3' : ''}`}>
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.author?.avatar_url} />
            <AvatarFallback>
              {comment.author?.full_name?.[0] || comment.author?.username?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-slate-900 dark:text-slate-100">
                {comment.author?.full_name || comment.author?.username}
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </div>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
              {comment.content}
            </p>
            {!isReply && user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleReplyToggle(comment.id)}
                className="h-6 px-2 text-xs"
              >
                <Reply className="w-3 h-3 mr-1" />
                Reply
              </Button>
            )}
            {replyState.isReplying && (
              <div className="mt-2 space-y-2">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyState.content}
                  onChange={(e) => handleReplyContentChange(comment.id, e.target.value)}
                  rows={2}
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleReply(comment.id)}
                    disabled={createComment.isPending}
                  >
                    {createComment.isPending ? 'Posting...' : 'Reply'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReplyToggle(comment.id)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        {comment.replies?.map((reply: any) => (
          <CommentItem key={reply.id} comment={reply} isReply={true} />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading comments...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Comments ({comments?.length || 0})
        </h2>
      </div>

      {user && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="Share your thoughts about this project..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <Button type="submit" disabled={createComment.isPending || !newComment.trim()}>
                {createComment.isPending ? 'Posting...' : 'Post Comment'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {comments?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                No comments yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Be the first to share your thoughts about this project!
              </p>
            </CardContent>
          </Card>
        ) : (
          comments?.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="pt-6">
                <CommentItem comment={comment} />
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
