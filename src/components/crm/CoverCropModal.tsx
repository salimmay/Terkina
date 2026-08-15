'use client';

import { useState } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { X, Check, ZoomIn, Move } from 'lucide-react';

export interface CropData {
  x: number;
  y: number;
  zoom: number;
  croppedAreaPixels?: Area;
}

interface CoverCropModalProps {
  imageUrl: string;
  initialCropData?: CropData;
  onSave: (cropData: CropData) => void;
  onClose: () => void;
}

export default function CoverCropModal({
  imageUrl,
  initialCropData,
  onSave,
  onClose,
}: CoverCropModalProps) {
  const [crop, setCrop] = useState<Point>({
    x: initialCropData?.x || 0,
    y: initialCropData?.y || 0,
  });
  const [zoom, setZoom] = useState<number>(initialCropData?.zoom || 1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropCompleteHandler = (_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSave = () => {
    onSave({
      x: crop.x,
      y: crop.y,
      zoom,
      croppedAreaPixels: croppedAreaPixels || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#121218] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Move className="w-5 h-5 text-blue-400" />
            <h3 className="font-heading font-bold text-lg text-white">Adjust Cover Focal Point & Crop</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cropper Canvas Container */}
        <div className="relative w-full h-80 sm:h-96 bg-black">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={16 / 9}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteHandler}
          />
        </div>

        {/* Controls Bar */}
        <div className="p-6 flex flex-col gap-4 bg-[#121218] border-t border-zinc-800">
          <div className="flex items-center gap-4">
            <ZoomIn className="w-4 h-4 text-zinc-400 shrink-0" />
            <span className="text-xs font-semibold text-zinc-300 w-12">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-blue-500 bg-zinc-800 h-2 rounded-lg cursor-pointer"
            />
            <span className="text-xs font-mono text-blue-400 w-10 text-right">{zoom.toFixed(1)}x</span>
          </div>

          <p className="text-xs text-zinc-400">
            Drag the image to adjust focal point. Saved settings (`x, y, zoom`) will drive CSS `object-position` without modifying the original file.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
            >
              <Check className="w-4 h-4" />
              Save Crop Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
