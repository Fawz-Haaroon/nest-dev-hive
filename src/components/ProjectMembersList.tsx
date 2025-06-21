
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Users, Crown, UserMinus, LogOut } from 'lucide-react';
import { useProjectMembers, useRemoveProjectMember, useLeaveProjectRequest } from '@/hooks/useProjectMembers';
import { useAuth } from '@/contexts/AuthContext';

interface ProjectMembersListProps {
  projectId: string;
  isOwner: boolean;
  showAsDialog?: boolean;
}

export const ProjectMembersList = ({ projectId, isOwner, showAsDialog = false }: ProjectMembersListProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: members, isLoading } = useProjectMembers(projectId);
  const removeProjectMember = useRemoveProjectMember();
  const leaveProjectRequest = useLeaveProjectRequest();
  
  const [leaveMessage, setLeaveMessage] = useState('');
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  console.log('ProjectMembersList - Members:', members);
  console.log('ProjectMembersList - Current user:', user?.id);
  console.log('ProjectMembersList - Is owner:', isOwner);

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeProjectMember.mutateAsync({ memberId });
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const handleLeaveRequest = async () => {
    try {
      await leaveProjectRequest.mutateAsync({
        projectId,
        message: leaveMessage
      });
      setShowLeaveDialog(false);
      setLeaveMessage('');
    } catch (error) {
      console.error('Error sending leave request:', error);
    }
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading members...</p>
        </CardContent>
      </Card>
    );
  }

  const currentUserMember = members?.find(m => m.user_id === user?.id);
  const isCurrentUserMember = !!currentUserMember && currentUserMember.role !== 'owner';

  console.log('Current user member:', currentUserMember);
  console.log('Is current user member (not owner):', isCurrentUserMember);

  const content = (
    <div className="space-y-4">
      {members?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-500 dark:text-slate-400">No members found</p>
        </div>
      ) : (
        members?.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={member.user.avatar_url || ''} />
                <AvatarFallback>
                  {member.user.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <button
                  onClick={() => handleViewProfile(member.user_id)}
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {member.user.full_name || member.user.username}
                </button>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  @{member.user.username}
                </p>
              </div>
              {member.role === 'owner' && (
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                  <Crown className="w-3 h-3 mr-1" />
                  Owner
                </Badge>
              )}
            </div>
            
            {isOwner && member.role !== 'owner' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <UserMinus className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove {member.user.full_name || member.user.username} from this project? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleRemoveMember(member.id)}>
                      Remove Member
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        ))
      )}

      {isCurrentUserMember && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                <LogOut className="w-4 h-4 mr-2" />
                Request to Leave Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request to Leave Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="leave-message">Message (optional)</Label>
                  <Textarea
                    id="leave-message"
                    value={leaveMessage}
                    onChange={(e) => setLeaveMessage(e.target.value)}
                    placeholder="Let the project owner know why you want to leave..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleLeaveRequest} className="flex-1">
                    Send Request
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowLeaveDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );

  if (showAsDialog) {
    return content;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Team Members ({members?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
};
