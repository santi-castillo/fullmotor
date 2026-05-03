'use client'

import { useState } from 'react'

interface ClassifiedGalleryProps {
  images: string[]
  title: string
}

export default function ClassifiedGallery({ images, title }: ClassifiedGalleryProps) {
  const [active, setActive] = useState(0)

  if (images.length === 0) {
    return (
      <div className="card aspect-[4/3] flex items-center justify-center text-6xl opacity-40">
        📷
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="card aspect-[4/3] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(i)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                i === active ? 'border-[var(--primary)]' : 'border-transparent hover:border-[var(--border)]'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
