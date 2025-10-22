
import React, { useRef, useCallback } from 'react';
import { UploadIcon, TrashIcon } from './Icons';

interface ImageUploaderProps {
  onImageUpload: (base64: string, mimeType: string, width: number, height: number) => void;
  isCompact?: boolean;
  preview?: string | null;
  onRemove?: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUpload, 
  isCompact = false, 
  preview,
  onRemove 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        
        const img = new Image();
        img.onload = () => {
          const [meta, base64] = result.split(',');
          if (!meta || !base64) return;
          const mimeType = meta.split(':')[1].split(';')[0];
          onImageUpload(base64, mimeType, img.naturalWidth, img.naturalHeight);
          // Reset file input to allow uploading the same file again after removing
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAreaClick = useCallback(() => {
    // For the main uploader, only allow click-to-upload if there's no image.
    // For the compact uploader, always allow it.
    if (isCompact || !preview) {
      fileInputRef.current?.click();
    }
  }, [isCompact, preview]);

  // If not compact (i.e., it's the main person uploader) and a preview is provided...
  if (!isCompact && preview) {
    return (
      <div className="relative group w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        {onRemove && (
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-500 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
            aria-label="Remove photo"
          >
            <TrashIcon className="w-5 h-5 text-white" />
          </button>
        )}
      </div>
    );
  }

  // Otherwise, show the uploader box.
  const baseClasses = "relative flex items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer transition-colors";
  const compactClasses = "aspect-square border-gray-600 hover:border-purple-400 bg-gray-700/50 hover:bg-gray-700";
  const fullClasses = "min-h-[200px] border-gray-600 hover:border-purple-400 bg-gray-700/50 hover:bg-gray-700 p-4";

  return (
    <div onClick={handleAreaClick} className={`${baseClasses} ${isCompact ? compactClasses : fullClasses}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      <div className="flex flex-col items-center justify-center text-gray-400">
        <UploadIcon />
        {!isCompact && <p className="mt-2 text-sm">Click to upload</p>}
      </div>
    </div>
  );
};
