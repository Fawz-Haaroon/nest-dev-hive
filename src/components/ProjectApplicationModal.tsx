
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useApplyToProject } from '@/hooks/useProjectApplications';

interface ProjectApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectTitle: string;
}

export const ProjectApplicationModal = ({ 
  isOpen, 
  onClose, 
  projectId, 
  projectTitle 
}: ProjectApplicationModalProps) => {
  const [message, setMessage] = useState('');
  const applyToProject = useApplyToProject();

  const handleSubmit = async () => {
    try {
      await applyToProject.mutateAsync({ projectId, message });
      onClose();
      setMessage('');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Apply to Join Project</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              You're applying to join "<span className="font-semibold">{projectTitle}</span>"
            </p>
          </div>
          
          <div>
            <Label htmlFor="message">Application Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Tell the project owner why you'd like to join this project..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1"
              rows={4}
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={applyToProject.isPending}
            >
              {applyToProject.isPending ? 'Sending...' : 'Send Application'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
