
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useProjectApplications, useUpdateApplicationStatus } from '@/hooks/useProjectApplications';
import { User, MessageSquare, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProjectApplicantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectTitle: string;
}

export const ProjectApplicantsModal = ({ 
  isOpen, 
  onClose, 
  projectId, 
  projectTitle 
}: ProjectApplicantsModalProps) => {
  const { data: applications = [], isLoading } = useProjectApplications(projectId);
  const updateStatus = useUpdateApplicationStatus();
  const navigate = useNavigate();

  const handleStatusUpdate = async (applicationId: string, status: 'approved' | 'rejected') => {
    try {
      await updateStatus.mutateAsync({ applicationId, status });
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Project Applicants - {projectTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="text-center py-8">Loading applicants...</div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8">
              <User className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">No applications yet</p>
            </div>
          ) : (
            applications.map((application) => (
              <div 
                key={application.id} 
                className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={application.applicant?.avatar_url || ''} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {application.applicant?.full_name?.[0] || application.applicant?.username?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <button
                        onClick={() => handleViewProfile(application.applicant_id)}
                        className="font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {application.applicant?.full_name || application.applicant?.username || 'Unknown User'}
                      </button>
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <Calendar className="w-3 h-3" />
                        Applied {new Date(application.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <Badge className={getStatusColor(application.status)}>
                    {application.status}
                  </Badge>
                </div>

                {application.applicant?.bio && (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {application.applicant.bio}
                  </p>
                )}

                {application.applicant?.skills && application.applicant.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {application.applicant.skills.slice(0, 5).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {application.applicant.skills.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{application.applicant.skills.length - 5} more
                      </Badge>
                    )}
                  </div>
                )}

                {application.message && (
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Application Message
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {application.message}
                    </p>
                  </div>
                )}

                {application.status === 'pending' && (
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate(application.id, 'rejected')}
                      disabled={updateStatus.isPending}
                      className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(application.id, 'approved')}
                      disabled={updateStatus.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
