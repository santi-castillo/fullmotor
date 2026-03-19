'use client';

import { useState, useRef, useEffect } from 'react';

interface ImageCarouselProps {
  images: string[];
  altPrefix: string;
  category: string;
}

export default function ImageCarousel({ images, altPrefix, category }: ImageCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Fallback emoji if no images are provided
  if (!images || images.length === 0) {
    return (
      <div className="aspect-[16/10] bg-[var(--muted)] rounded-xl flex items-center justify-center overflow-hidden">
        <span className="text-[120px] opacity-30">
          {category === 'motos' ? '🏍️' :
            category === 'pickups' ? '🛻' :
              category === 'suvs' ? '🚙' :
                category === 'utilitarios' ? '🚐' : '🚗'}
        </span>
      </div>
    );
  }

  // Handle scroll events to update the active indicator
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const width = scrollContainerRef.current.clientWidth;
      const newIndex = Math.round(scrollLeft / width);
      setActiveIndex(newIndex);
    }
  };

  const scrollToImage = (index: number) => {
    if (scrollContainerRef.current) {
      const width = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({
        left: index * width,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
    // Prevent background scrolling when lightbox is open
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    // Restore scrolling
    document.body.style.overflow = 'unset';
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') setLightboxIndex(Math.max(0, lightboxIndex - 1));
      if (e.key === 'ArrowRight') setLightboxIndex(Math.min(images.length - 1, lightboxIndex + 1));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, lightboxIndex, images.length]);

  return (
    <>
      <div className="relative group rounded-xl overflow-hidden shadow-[inset_0_-80px_60px_-20px_rgba(0,0,0,0.8)]">
        <div 
          ref={scrollContainerRef}
          className="aspect-[16/10] bg-[var(--muted)] flex overflow-x-auto snap-x snap-mandatory hide-scrollbar relative z-0"
          onScroll={handleScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {images.map((img, index) => (
            <div key={index} className="flex-none w-full h-full snap-start relative">
              <button 
                className="absolute inset-0 w-full h-full text-left cursor-zoom-in group/img"
                onClick={() => openLightbox(index)}
                aria-label={`Ampliar imagen ${index + 1}`}
              >
                <img
                  src={img}
                  alt={`${altPrefix} - Imagen ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-[1.02] -z-10"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </button>
            </div>
          ))}
        </div>
        
        {/* Hide scrollbar styling for WebKit (Chrome/Safari) */}
        <style jsx global>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Navigation Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10 pointer-events-none">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all pointer-events-auto ${
                  index === activeIndex 
                    ? 'bg-white scale-125 shadow-[0_0_6px_rgba(0,0,0,0.8)]' 
                    : 'bg-white/60 hover:bg-white/90 shadow-[0_0_4px_rgba(0,0,0,0.8)]'
                }`}
                onClick={(e) => { e.stopPropagation(); scrollToImage(index); }}
                aria-label={`Ver imagen ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Navigation Arrows (Optional, only show on hover on desktop) */}
        {images.length > 1 && (
          <>
            <button 
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all disabled:opacity-0 disabled:cursor-not-allowed z-10"
              onClick={() => scrollToImage(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              aria-label="Imagen anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button 
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all disabled:opacity-0 disabled:cursor-not-allowed z-10"
              onClick={() => scrollToImage(Math.min(images.length - 1, activeIndex + 1))}
              disabled={activeIndex === images.length - 1}
              aria-label="Siguiente imagen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-200">
          <button 
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-50 bg-black/20 hover:bg-black/40 rounded-full transition-colors"
            onClick={closeLightbox}
            aria-label="Cerrar imagen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          
          <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
            <img 
              src={images[lightboxIndex]} 
              alt={`${altPrefix} - Imagen ${lightboxIndex + 1} ampliada`}
              className="max-w-full max-h-full object-contain drop-shadow-2xl select-none"
            />
          </div>

          {images.length > 1 && (
            <>
              {/* Lightbox Navigation Arrows */}
              <button 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 disabled:opacity-0 transition-colors z-40 bg-black/10 hover:bg-black/30 rounded-full"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(Math.max(0, lightboxIndex - 1)); }}
                disabled={lightboxIndex === 0}
                aria-label="Imagen anterior"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 disabled:opacity-0 transition-colors z-40 bg-black/10 hover:bg-black/30 rounded-full"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(Math.min(images.length - 1, lightboxIndex + 1)); }}
                disabled={lightboxIndex === images.length - 1}
                aria-label="Siguiente imagen"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>

              {/* Lightbox Indicators */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-40">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`h-1.5 transition-all rounded-full ${
                      index === lightboxIndex 
                        ? 'w-8 bg-white' 
                        : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(index); }}
                    aria-label={`Ir a imagen ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute top-6 left-6 text-white/60 font-medium tracking-widest text-sm z-40 bg-black/30 px-3 py-1 rounded-full backdrop-blur-md">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
