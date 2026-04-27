import React, { useState, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, Check } from 'lucide-react';

// Helper to center the crop initially
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export default function ImageCropperModal({ imgSrc, aspect, onCropComplete, onCancel }) {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const imgRef = useRef(null);

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  // Get the cropped image as a blob
  const handleSave = async () => {
    if (!completedCrop || !imgRef.current) {
        onCancel();
        return;
    }

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );

    canvas.toBlob((blob) => {
        if (!blob) return;
        const file = new File([blob], 'cropped_image.jpg', { type: 'image/jpeg' });
        const previewUrl = URL.createObjectURL(blob);
        onCropComplete(file, previewUrl);
    }, 'image/jpeg', 0.95);
  };

  return (
    <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(30, 42, 59, 0.8)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
    }}>
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', maxWidth: '800px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, fontSize: '20px', color: '#1e2a3b', fontWeight: '800' }}>Crop Image</h2>
                <button onClick={onCancel} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                    <X size={24} />
                </button>
            </div>
            
            <div style={{ maxHeight: '60vh', overflow: 'auto', background: '#f8fafc', borderRadius: '8px', display: 'flex', justifyContent: 'center' }}>
                <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect}
                >
                    <img
                        ref={imgRef}
                        alt="Crop me"
                        src={imgSrc}
                        onLoad={onImageLoad}
                        style={{ maxWidth: '100%', maxHeight: '60vh' }}
                    />
                </ReactCrop>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button 
                    onClick={onCancel}
                    style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#ffffff', color: '#475569', fontWeight: '600', cursor: 'pointer' }}
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSave}
                    style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#1e2a3b', color: '#ffffff', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Check size={18} /> Apply Crop
                </button>
            </div>
        </div>
    </div>
  );
}
