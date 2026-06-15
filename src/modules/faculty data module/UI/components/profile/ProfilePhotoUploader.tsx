import React, { useState, useRef } from 'react';
import { Camera, Upload, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { mockUploadToS3 } from '../../mock/mockS3Adapter';
import { FacultyProfile } from '../../mock/mockProfiles';
import Button from '../shared/Button';

interface ProfilePhotoUploaderProps {
  user: FacultyProfile;
  onSuccess: (newPhotoUrl: string) => void;
}

export const ProfilePhotoUploader: React.FC<ProfilePhotoUploaderProps> = ({ user, onSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setError(null);
    setIsSuccess(false);

    // Validate type (must be jpeg, png or webp image)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only JPG, PNG, and WEBP images are allowed.');
      return false;
    }

    // Validate size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('Image exceeds 5MB limit. Please choose a smaller file.');
      return false;
    }

    return true;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadProgress(0);
    setError(null);

    try {
      const mockUrl = await mockUploadToS3(selectedFile, {
        onProgress: (percent) => setUploadProgress(percent),
      });

      // Update local context
      user.profilePhotoUrl = mockUrl;
      onSuccess(mockUrl);

      setIsSuccess(true);
      setUploadProgress(null);
      setSelectedFile(null);
    } catch (err: any) {
      setError(err.message || 'Failed to upload photo. Please try again.');
      setUploadProgress(null);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    setIsSuccess(false);
    setUploadProgress(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center gap-3">
        <Camera className="w-5 h-5 text-gitam-antique-gold" />
        <h3 className="text-xs font-bold text-gitam-antique-white uppercase tracking-wider">
          Profile Photo Uploader
        </h3>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Avatar View & Crop Guide */}
        <div className="relative shrink-0 select-none">
          <div className="relative w-40 h-40 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center group">
            {previewUrl ? (
              <>
                <img
                  src={previewUrl}
                  alt="Uploader Preview"
                  className="w-full h-full object-cover"
                />
                {/* Crop Guide Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-36 h-36 rounded-full border-2 border-dashed border-gitam-antique-gold bg-transparent ring-[150px] ring-slate-950/60"></div>
                </div>
              </>
            ) : (
              <img
                src={user.profilePhotoUrl}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-full h-full object-cover"
              />
            )}

            {/* Drag Overlay Mask */}
            {dragActive && (
              <div className="absolute inset-0 bg-gitam-green/40 backdrop-blur-xs flex items-center justify-center border-2 border-dashed border-gitam-antique-gold rounded-2xl animate-pulse z-20">
                <Upload className="w-8 h-8 text-white" />
              </div>
            )}

            {/* Upload Progress Circle Overlay */}
            {uploadProgress !== null && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center z-20">
                <RefreshCw className="w-7 h-7 text-gitam-antique-gold animate-spin mb-2" />
                <span className="text-xs font-extrabold text-white">{uploadProgress}%</span>
              </div>
            )}

            {/* Success Overlay Mask */}
            {isSuccess && (
              <div className="absolute inset-0 bg-gitam-green/80 flex flex-col items-center justify-center z-20 animate-scale-up">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg mb-1.5 animate-bounce">
                  <Check className="w-6 h-6 text-gitam-green stroke-[3px]" />
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-wider">Success</span>
              </div>
            )}
          </div>
        </div>

        {/* Upload Control Area */}
        <div className="flex-1 w-full space-y-4">
          {previewUrl ? (
            <div className="space-y-3">
              <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl">
                <p className="text-xs font-bold text-slate-350">Preview Crop Mask</p>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                  The dashed gold ring indicates how the image will crop to fit circular headers and directories.
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleUpload}
                  loading={uploadProgress !== null}
                  variant="primary"
                  size="sm"
                >
                  Upload & Save Photo
                </Button>
                <Button
                  onClick={handleCancel}
                  disabled={uploadProgress !== null}
                  variant="secondary"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className={`border border-dashed rounded-xl p-6 bg-slate-950 hover:bg-slate-900/40 transition flex flex-col items-center justify-center cursor-pointer select-none group text-center ${
                dragActive ? 'border-gitam-antique-gold bg-slate-900' : 'border-slate-800'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleChange}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-slate-500 group-hover:text-gitam-antique-gold transition-colors mb-2.5" />
              <p className="text-xs text-slate-350 font-bold group-hover:text-white transition-colors">
                Drag and drop your profile photo, or click to browse
              </p>
              <p className="text-[10px] text-slate-550 mt-1 font-semibold">
                JPEG, PNG, or WEBP • Max size 5MB
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-[11px] text-gitam-coral font-bold bg-gitam-coral/10 p-3 border border-gitam-coral/20 rounded-xl animate-scale-up">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProfilePhotoUploader;
