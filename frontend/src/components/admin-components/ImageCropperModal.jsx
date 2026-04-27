import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react';

export default function ImageCropperModal({ imgSrc, aspect, onCropComplete, onCancel }) {
    const containerRef = useRef(null);
    const imgRef = useRef(null);

    const [scale, setScale] = useState(1);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

    // ─── Mouse drag handlers ────────────────────────────────────────────────────
    const onMouseDown = (e) => {
        e.preventDefault();
        setDragging(true);
        dragStart.current = { x: e.clientX, y: e.clientY, posX: pos.x, posY: pos.y };
    };

    const onMouseMove = useCallback((e) => {
        if (!dragging) return;
        setPos({
            x: dragStart.current.posX + (e.clientX - dragStart.current.x),
            y: dragStart.current.posY + (e.clientY - dragStart.current.y),
        });
    }, [dragging]);

    const onMouseUp = useCallback(() => setDragging(false), []);

    useEffect(() => {
        if (dragging) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [dragging, onMouseMove, onMouseUp]);

    // ─── Touch drag handlers ────────────────────────────────────────────────────
    const onTouchStart = (e) => {
        const t = e.touches[0];
        setDragging(true);
        dragStart.current = { x: t.clientX, y: t.clientY, posX: pos.x, posY: pos.y };
    };

    const onTouchMove = (e) => {
        if (!dragging) return;
        const t = e.touches[0];
        setPos({
            x: dragStart.current.posX + (t.clientX - dragStart.current.x),
            y: dragStart.current.posY + (t.clientY - dragStart.current.y),
        });
    };

    // ─── Apply Crop ────────────────────────────────────────────────────────────
    const handleSave = () => {
        const img = imgRef.current;
        const container = containerRef.current;
        if (!img || !container) return;

        const containerW = container.offsetWidth;
        const containerH = container.offsetHeight;

        // Displayed image size (after CSS scale)
        const displayedW = img.offsetWidth * scale;
        const displayedH = img.offsetHeight * scale;

        // Top-left corner of the displayed image in container coords
        const imgLeft = containerW / 2 + pos.x - displayedW / 2;
        const imgTop  = containerH / 2 + pos.y - displayedH / 2;

        // The frame (container) crops from (0,0) to (containerW, containerH)
        // Map that back to natural image source coords
        const nScaleX = img.naturalWidth  / displayedW;
        const nScaleY = img.naturalHeight / displayedH;

        const srcX = -imgLeft * nScaleX;
        const srcY = -imgTop  * nScaleY;
        const srcW = containerW * nScaleX;
        const srcH = containerH * nScaleY;

        // Output canvas matches the frame aspect (high resolution)
        const OUTPUT_W = 1200;
        const OUTPUT_H = Math.round(OUTPUT_W / aspect);

        const canvas = document.createElement('canvas');
        canvas.width  = OUTPUT_W;
        canvas.height = OUTPUT_H;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, OUTPUT_W, OUTPUT_H);

        canvas.toBlob((blob) => {
            if (!blob) return;
            const file = new File([blob], 'cropped_image.png', { type: 'image/png' });
            const previewUrl = URL.createObjectURL(blob);
            onCropComplete(file, previewUrl);
        }, 'image/png');
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(30, 42, 59, 0.88)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
        }}>
            <div style={{
                background: '#ffffff', borderRadius: '20px', padding: '28px',
                maxWidth: '740px', width: '100%',
                boxShadow: '0 32px 64px rgba(0,0,0,0.3)'
            }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '20px', color: '#1e2a3b', fontWeight: '800' }}>Crop Image</h2>
                        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94a3b8' }}>
                            Drag the image to reposition · Use the slider to zoom
                        </p>
                    </div>
                    <button onClick={onCancel} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}>
                        <X size={22} />
                    </button>
                </div>

                {/* ── Fixed Frame (the crop window) ──────────────────── */}
                <div
                    ref={containerRef}
                    onMouseDown={onMouseDown}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={() => setDragging(false)}
                    style={{
                        width: '100%',
                        paddingTop: `${(1 / aspect) * 100}%`,
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '10px',
                        border: '2.5px solid #ffc107',
                        cursor: dragging ? 'grabbing' : 'grab',
                        background: '#f1f5f9',
                        boxShadow: '0 0 0 4px rgba(255,193,7,0.15)',
                        userSelect: 'none',
                    }}
                >
                    {/* The image moves inside the fixed frame */}
                    <img
                        ref={imgRef}
                        src={imgSrc}
                        draggable={false}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) scale(${scale})`,
                            transformOrigin: 'center center',
                            maxWidth: '100%',
                            maxHeight: '100%',
                            pointerEvents: 'none',
                            userSelect: 'none',
                            transition: dragging ? 'none' : 'transform 0.05s',
                        }}
                    />

                    {/* Corner guides */}
                    {['topleft','topright','bottomleft','bottomright'].map(corner => (
                        <div key={corner} style={{
                            position: 'absolute',
                            width: '20px', height: '20px',
                            top: corner.includes('top') ? '8px' : 'auto',
                            bottom: corner.includes('bottom') ? '8px' : 'auto',
                            left: corner.includes('left') ? '8px' : 'auto',
                            right: corner.includes('right') ? '8px' : 'auto',
                            borderTop: corner.includes('top') ? '3px solid #ffc107' : 'none',
                            borderBottom: corner.includes('bottom') ? '3px solid #ffc107' : 'none',
                            borderLeft: corner.includes('left') ? '3px solid #ffc107' : 'none',
                            borderRight: corner.includes('right') ? '3px solid #ffc107' : 'none',
                            borderRadius: '2px',
                            pointerEvents: 'none',
                        }} />
                    ))}
                </div>

                {/* ── Zoom Controls ─────────────────────────────────── */}
                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        onClick={() => setScale(s => Math.max(0.2, parseFloat((s - 0.1).toFixed(2))))}
                        style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                        <ZoomOut size={17} color="#1e2a3b" />
                    </button>
                    <input
                        type="range" min={0.2} max={4} step={0.02} value={scale}
                        onChange={e => setScale(Number(e.target.value))}
                        style={{ flex: 1, accentColor: '#ffc107', cursor: 'pointer', height: '4px' }}
                    />
                    <button
                        onClick={() => setScale(s => Math.min(4, parseFloat((s + 0.1).toFixed(2))))}
                        style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                        <ZoomIn size={17} color="#1e2a3b" />
                    </button>
                    <span style={{ color: '#64748B', fontSize: '13px', fontWeight: '700', minWidth: '50px', textAlign: 'right' }}>
                        {Math.round(scale * 100)}%
                    </span>
                </div>

                {/* ── Actions ──────────────────────────────────────── */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                    <button onClick={onCancel}
                        style={{ padding: '10px 22px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#ffffff', color: '#475569', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
                        Cancel
                    </button>
                    <button onClick={handleSave}
                        style={{ padding: '10px 26px', borderRadius: '10px', border: 'none', background: '#1e2a3b', color: '#ffffff', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Check size={17} /> Apply Crop
                    </button>
                </div>
            </div>
        </div>
    );
}
