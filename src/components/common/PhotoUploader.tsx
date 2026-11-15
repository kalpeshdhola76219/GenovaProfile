import React, { useRef, useState } from 'react';
import { Camera, Crop, Trash2, Upload, User, Sliders } from 'lucide-react';
import { ImageCropModal, AspectRatioType } from './ImageCropModal';
import { compressImageDataUrl } from '../../utils/imageCompression';

interface PhotoUploaderProps {
  currentPhoto?: string;
  onPhotoChange: (photoBase64: string) => void;
  onRemovePhoto: () => void;
  label?: string;
  aspectRatio?: AspectRatioType;
}

const SAMPLE_AVATARS = [
  {
    name: 'Professional Male',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Professional Female',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Executive Leader',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Modern Portrait',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  },
];

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  currentPhoto,
  onPhotoChange,
  onRemovePhoto,
  label = 'Profile Photo',
  aspectRatio = '1:1',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [originalImageSrc, setOriginalImageSrc] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);

  const processFile = (file: File) => {
    if (file.size > 8 * 1024 * 1024) {
      setError('Image file is too large (max 8MB). Please select a smaller photo.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        try {
          const optimizedBase64 = await compressImageDataUrl(base64, {
            maxWidth: 1200,
            maxHeight: 1200,
            maxBytes: 700 * 1024,
            initialQuality: 0.88,
          });
          setOriginalImageSrc(optimizedBase64);
          setCropImageSrc(optimizedBase64);
          setIsCropModalOpen(true);
        } catch {
          setOriginalImageSrc(base64);
          setCropImageSrc(base64);
          setIsCropModalOpen(true);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
    // Reset file input value so selecting the same file again triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Open cropper for existing photo
  const handleOpenExistingInCropper = () => {
    if (!currentPhoto) return;
    setCropImageSrc(originalImageSrc || currentPhoto);
    setIsCropModalOpen(true);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
        {currentPhoto && (
          <button
            type="button"
            onClick={handleOpenExistingInCropper}
            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 cursor-pointer"
          >
            <Crop className="w-3.5 h-3.5" />
            <span>Crop & Adjust</span>
          </button>
        )}
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border transition-all ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-200'
            : 'border-slate-200 bg-slate-50/70 hover:border-slate-300'
        }`}
      >
        {/* Photo Box */}
        <div className="relative group w-24 h-32 rounded-xl overflow-hidden border-2 border-slate-300 bg-white shadow-sm shrink-0 flex items-center justify-center">
          {currentPhoto ? (
            <img
              src={currentPhoto}
              alt="Profile Preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="flex flex-col items-center text-slate-400">
              <User className="w-8 h-8 stroke-1 mb-1" />
              <span className="text-[10px] font-medium">No Photo</span>
            </div>
          )}

          {/* Hover Overlay with dual actions if photo exists */}
          <div className="absolute inset-0 bg-slate-900/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1 text-white">
            {currentPhoto ? (
              <>
                <button
                  type="button"
                  onClick={handleOpenExistingInCropper}
                  className="w-full py-1 text-[10px] font-medium bg-indigo-600 hover:bg-indigo-700 rounded text-center inline-flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                >
                  <Crop className="w-3 h-3" />
                  Crop
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-1 text-[10px] font-medium bg-white/20 hover:bg-white/30 rounded text-center inline-flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  Replace
                </button>
              </>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
              >
                <Camera className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-medium">Upload</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls & Info */}
        <div className="flex-1 space-y-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Image
            </button>

            {currentPhoto && (
              <>
                <button
                  type="button"
                  onClick={handleOpenExistingInCropper}
                  className="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Crop className="w-3.5 h-3.5" />
                  Crop / Adjust
                </button>
                <button
                  type="button"
                  onClick={onRemovePhoto}
                  className="px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              </>
            )}
          </div>

          <p className="text-[11px] text-slate-500">
            Interactive cropper with 1:1, 3:4, 4:5 aspect ratios, zoom, and 90° rotation. Drag image or browse.
          </p>

          <div className="pt-2 border-t border-slate-200/60">
            <span className="text-[10px] text-slate-500 block mb-1.5 font-medium">
              Or pick sample avatar (can be cropped too):
            </span>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              {SAMPLE_AVATARS.map((av, idx) => (
                <button
                  key={idx}
                  type="button"
                  title={`${av.name} (Click to use, or click Crop)`}
                  onClick={() => {
                    onPhotoChange(av.url);
                  }}
                  className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 cursor-pointer ${
                    currentPhoto === av.url
                      ? 'border-indigo-600 ring-2 ring-indigo-200'
                      : 'border-slate-300'
                  }`}
                >
                  <img
                    src={av.url}
                    alt={av.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      {error && (
        <div className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
          {error}
        </div>
      )}

      {/* Interactive Image Cropper Modal */}
      <ImageCropModal
        isOpen={isCropModalOpen}
        imageSrc={cropImageSrc}
        onClose={() => setIsCropModalOpen(false)}
        onCropComplete={(croppedBase64) => {
          onPhotoChange(croppedBase64);
          setIsCropModalOpen(false);
        }}
        initialAspectRatio={aspectRatio}
        title={`Crop & Adjust ${label}`}
      />
    </div>
  );
};
