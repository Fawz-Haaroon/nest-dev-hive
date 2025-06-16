
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserApplicationStatus, useDeleteApplication } from '@/hooks/useProjectApplications';
import { CheckCircle, XCircle, Clock, Trash2, Calendar } from 'lucide-react';

interface ApplicationStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectTitle: string;
}

export const ApplicationStatusModal = ({ 
  isOpen, 
  onClose, 
  projectId, 
  projectTitle 
}: ApplicationStatusModalProps) => {
  const { data: application, isLoading } = useUserApplicationStatus(projectId);
  const deleteApplication = useDeleteApplication();

  const handleDeleteApplication = async () => {
    if (!application) return;
    
    try {
      await deleteApplication.mutateAsync(application.id);
      onClose();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'approved': return 'Congratulations! Your application has been approved.';
      case 'rejected': return 'Unfortunately, your application was not accepted for this project.';
      default: return 'Your application is being reviewed by the project owner.';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Application Status</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">Loading application status...</div>
          ) : !application ? (
            <div className="text-center py-8">
              <p className="text-slate-600 dark:text-slate-400">No application found</p>
            </div>
          ) : (
            <>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Project: <span className="font-semibold">{projectTitle}</span>
                </p>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                {getStatusIcon(application.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">Status:</span>
                    <Badge className={getStatusColor(application.status)}>
                      {application.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {getStatusMessage(application.status)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Calendar className="w-4 h-4" />
                Applied on {new Date(application.created_at).toLocaleDateString()}
              </div>

              {application.status === 'pending' && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button
                    variant="outline"
                    onClick={handleDeleteApplication}
                    disabled={deleteApplication.isPending}
                    className="w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Withdraw Application
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
