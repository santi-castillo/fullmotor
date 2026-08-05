'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { GaugePlaceholder } from './ui/ImagePlaceholder';

interface ImageCarouselProps {
  images: string[];
  altPrefix: string;
  /** Mono uppercase badge over the stage — e.g. "Nuevo · 2026" */
  badge?: string;
}

const GaugePH = () => <GaugePlaceholder className="ph" />;

export default function ImageCarousel({ images, altPrefix, badge }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = '';
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => Math.max(0, i - 1));
      if (e.key === 'ArrowRight') setLightboxIndex((i) => Math.min(images.length - 1, i + 1));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="dt__gallery">
        <div className="dt__stage">
          {badge && <span className="cond">{badge}</span>}
          <GaugePH />
        </div>
      </div>
    );
  }

  return (
    <div className="dt__gallery">
      <div className="dt__stage">
        {badge && <span className="cond">{badge}</span>}
        <button
          type="button"
          className="absolute inset-0 w-full h-full cursor-zoom-in"
          onClick={() => openLightbox(activeIndex)}
          aria-label="Ampliar imagen"
        >
          <Image
            src={images[activeIndex]}
            alt={`${altPrefix} - Imagen ${activeIndex + 1}`}
            fill
            sizes="(max-width: 1000px) 100vw, 55vw"
            priority
            style={{ objectFit: 'cover' }}
          />
        </button>
      </div>

      {images.length > 1 && (
        <div className="dt__thumbs">
          {images.map((img, index) => (
            <button
              key={index}
              type="button"
              className={`dt__thumb${index === activeIndex ? ' on' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <Image src={img} alt="" fill sizes="160px" style={{ objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-[rgba(8,21,46,0.92)] backdrop-blur-sm">
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 z-50 rounded-full transition-colors cursor-pointer"
            onClick={closeLightbox}
            aria-label="Cerrar imagen"
          >
            <X size={28} aria-hidden="true" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[lightboxIndex]}
              alt={`${altPrefix} - Imagen ${lightboxIndex + 1} ampliada`}
              className="max-w-full max-h-full object-contain select-none"
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-4 disabled:opacity-0 transition-colors z-40 cursor-pointer"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(Math.max(0, lightboxIndex - 1)); }}
                disabled={lightboxIndex === 0}
                aria-label="Imagen anterior"
              >
                <ChevronLeft size={40} aria-hidden="true" />
              </button>

              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-4 disabled:opacity-0 transition-colors z-40 cursor-pointer"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(Math.min(images.length - 1, lightboxIndex + 1)); }}
                disabled={lightboxIndex === images.length - 1}
                aria-label="Siguiente imagen"
              >
                <ChevronRight size={40} aria-hidden="true" />
              </button>
            </>
          )}

          <div className="absolute top-6 left-6 text-white/70 font-mono text-sm z-40 px-3 py-1">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
