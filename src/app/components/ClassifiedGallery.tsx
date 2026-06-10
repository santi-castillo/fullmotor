'use client'

import { useState } from 'react'
import { ImageOff } from 'lucide-react'

interface ClassifiedGalleryProps {
  images: string[]
  title: string
}

export default function ClassifiedGallery({ images, title }: ClassifiedGalleryProps) {
  const [active, setActive] = useState(0)

  if (images.length === 0) {
    return (
      <div className="dt__stage">
        <ImageOff size={40} className="text-faint" aria-hidden="true" />
      </div>
    )
  }

  return (
    <div className="dt__gallery">
      <div className="dt__stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[active]} alt={title} />
      </div>
      {images.length > 1 && (
        <div className="dt__thumbs" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(i)}
              className={`dt__thumb${i === active ? ' on' : ''}`}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === active || undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
