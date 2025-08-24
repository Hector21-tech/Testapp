import React, { useState, useCallback } from 'react';
import { 
  PhotoIcon, 
  ArrowUpTrayIcon, 
  CheckCircleIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import type { AdImage } from '../features/campaign/types';

interface AdImagePickerProps {
  selectedImage?: AdImage | null;
  onImageSelect: (image: AdImage) => void;
  onImageClear?: () => void;
  industryContext?: string;
  companyName?: string;
  className?: string;
}

// Mock stock images - in real app these would come from Pexels/Unsplash API
const MOCK_STOCK_IMAGES: Omit<AdImage, 'isCustom'>[] = [
  {
    id: 'stock-1',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop',
    altText: 'Professional carpenter working with wood',
    attribution: 'Photo by Pexels'
  },
  {
    id: 'stock-2', 
    url: 'https://images.unsplash.com/photo-1581092918484-8313de64ce2d?w=800&h=600&fit=crop',
    altText: 'Electrician installing wiring',
    attribution: 'Photo by Unsplash'
  },
  {
    id: 'stock-3',
    url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop', 
    altText: 'Plumber working on pipes',
    attribution: 'Photo by Pexels'
  }
];

export function AdImagePicker({ selectedImage, onImageSelect, onImageClear, industryContext, companyName, className = '' }: AdImagePickerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewModal, setPreviewModal] = useState<AdImage | null>(null);

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploadError(null);

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      setUploadError('Endast JPG, PNG och WebP-filer är tillåtna');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Filen får inte vara större än 10 MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      
      // Create image element to check dimensions
      const img = new Image();
      img.onload = () => {
        if (img.width < 1200 || img.height < 600) {
          setUploadError('Bilden måste vara minst 1200x600 pixlar för bästa kvalitet');
          return;
        }

        const customImage: AdImage = {
          id: `custom-${Date.now()}`,
          url: result,
          altText: `Uppladdad bild: ${file.name}`,
          isCustom: true,
          preview: result
        };

        onImageSelect(customImage);
      };
      
      img.onerror = () => {
        setUploadError('Kunde inte läsa bildfilen');
      };
      
      img.src = result;
    };

    reader.onerror = () => {
      setUploadError('Kunde inte läsa bildfilen');
    };

    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  }, [handleFileUpload]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
  }, [handleFileUpload]);

  const openPreviewModal = (image: AdImage) => {
    setPreviewModal(image);
  };

  const closePreviewModal = () => {
    setPreviewModal(null);
  };

  const selectImageFromModal = (image: AdImage) => {
    onImageSelect(image);
    closePreviewModal();
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Upload Section */}
      <div>
        <h3 className="heading-sm mb-4 flex items-center">
          <ArrowUpTrayIcon className="w-5 h-5 mr-2 text-brand" />
          Ladda upp egen bild
        </h3>
        
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200
            ${isDragging 
              ? 'border-brand bg-brand/5 scale-102' 
              : 'border-neutral-300 hover:border-brand hover:bg-brand/5'
            }
          `}
        >
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            multiple={false}
          />
          
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center">
              <PhotoIcon className="w-8 h-8 text-brand" />
            </div>
            
            <div>
              <p className="text-lg font-semibold text-neutral-900 mb-2">
                Dra och släpp en bild här
              </p>
              <p className="text-sm text-neutral-600">
                eller <span className="text-brand font-semibold">klicka för att bläddra</span>
              </p>
            </div>
            
            <div className="text-xs text-neutral-500 space-y-1">
              <p>JPG, PNG eller WebP • Max 10 MB</p>
              <p>Rekommenderat: minst 1200x600 pixlar</p>
            </div>
          </div>
        </div>

        {uploadError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{uploadError}</p>
          </div>
        )}
      </div>

      {/* Stock Images Section */}
      <div>
        <h3 className="heading-sm mb-4 flex items-center">
          <MagnifyingGlassIcon className="w-5 h-5 mr-2 text-brand" />
          Välj från våra professionella bilder
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_STOCK_IMAGES.map((image) => {
            const fullImage: AdImage = { ...image, isCustom: false };
            const isSelected = selectedImage?.id === image.id;
            
            return (
              <div key={image.id} className="group relative">
                <div
                  className={`
                    relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-200
                    ${isSelected 
                      ? 'ring-4 ring-brand shadow-strong scale-105' 
                      : 'hover:scale-105 hover:shadow-medium'
                    }
                  `}
                  onClick={() => openPreviewModal(fullImage)}
                >
                  <img
                    src={image.url}
                    alt={image.altText}
                    className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-8 h-8 bg-brand rounded-full flex items-center justify-center animate-scale-in">
                      <CheckCircleIconSolid className="w-6 h-6 text-white" />
                    </div>
                  )}
                  
                  {/* Zoom indicator */}
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <p className="text-xs font-semibold text-neutral-900">Klicka för att förhandsgranska</p>
                    </div>
                  </div>
                </div>
                
                {/* Image info */}
                <div className="mt-3 space-y-1">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {image.altText}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {image.attribution}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Image Display */}
      {selectedImage && (
        <div className="bg-brand/5 border border-brand/20 rounded-2xl p-6">
          <div className="flex items-start space-x-4">
            <img
              src={selectedImage.url}
              alt={selectedImage.altText}
              className="w-24 h-16 object-cover rounded-xl shadow-soft"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircleIconSolid className="w-5 h-5 text-brand" />
                <h4 className="font-semibold text-brand">Vald bild</h4>
              </div>
              <p className="text-sm text-neutral-600 mb-1">
                {selectedImage.altText}
              </p>
              {selectedImage.attribution && (
                <p className="text-xs text-neutral-500">
                  {selectedImage.attribution}
                </p>
              )}
            </div>
            <button
              onClick={() => onImageSelect(null as any)}
              className="btn-ghost btn-sm p-2"
              title="Ta bort vald bild"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="heading-md">Förhandsgranska bild</h3>
                <button
                  onClick={closePreviewModal}
                  className="btn-ghost btn-sm p-2"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <img
                  src={previewModal.url}
                  alt={previewModal.altText}
                  className="w-full max-h-96 object-cover rounded-xl shadow-soft"
                />
                
                <div className="space-y-2">
                  <p className="body font-medium">
                    {previewModal.altText}
                  </p>
                  {previewModal.attribution && (
                    <p className="body-sm text-neutral-500">
                      {previewModal.attribution}
                    </p>
                  )}
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => selectImageFromModal(previewModal)}
                    className="btn-primary"
                  >
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    Välj denna bild
                  </button>
                  <button
                    onClick={closePreviewModal}
                    className="btn-secondary"
                  >
                    Stäng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}