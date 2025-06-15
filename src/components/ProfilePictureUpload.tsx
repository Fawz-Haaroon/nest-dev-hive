
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProfilePictureUploadProps {
  currentAvatarUrl?: string;
  username?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ProfilePictureUpload = ({ 
  currentAvatarUrl, 
  username, 
  size = 'md' 
}: ProfilePictureUploadProps) => {
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      if (!user) {
        throw new Error('You must be logged in to upload an avatar.');
      }

      const file = event.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file.');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB.');
      }

      console.log('Starting upload for user:', user.id);
      console.log('File details:', { name: file.name, type: file.type, size: file.size });

      // Delete old avatar if it exists
      if (currentAvatarUrl) {
        try {
          const oldPath = currentAvatarUrl.split('/').pop();
          if (oldPath) {
            console.log('Deleting old avatar:', oldPath);
            await supabase.storage
              .from('avatars')
              .remove([`${user.id}/${oldPath}`]);
          }
        } catch (error) {
          console.warn('Could not delete old avatar:', error);
        }
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log('Uploading to path:', filePath);

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          cacheControl: '3600',
          upsert: false 
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful, getting public URL');

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('Public URL:', publicUrl);

      // Update the user's profile with the new avatar URL
      await updateProfile.mutateAsync({
        avatar_url: publicUrl
      });

      console.log('Profile updated successfully');

      toast({
        title: 'Success',
        description: 'Profile picture updated successfully!',
      });

      // Reset the input
      event.target.value = '';

    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload image.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const initials = username 
    ? username.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || 'U';

  return (
    <div className="relative group">
      <Avatar className={`${sizeClasses[size]} border-2 border-blue-200 dark:border-blue-800`}>
        <AvatarImage 
          src={currentAvatarUrl} 
          alt="Profile picture"
          className="object-cover"
        />
        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <label htmlFor="avatar-upload" className="cursor-pointer">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            disabled={uploading}
            asChild
          >
            <span>
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </span>
          </Button>
        </label>
      </div>
      
      <input
        id="avatar-upload"
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={uploadAvatar}
        disabled={uploading}
        className="hidden"
      />
    </div>
  );
};
