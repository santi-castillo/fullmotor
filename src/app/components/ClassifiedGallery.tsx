import ImageCarousel from './ImageCarousel'

interface ClassifiedGalleryProps {
  images: string[]
  title: string
}

/**
 * The classifieds gallery is the catalog carousel.
 *
 * This used to be a trimmed-down copy of ImageCarousel that shared its markup
 * and CSS but dropped the lightbox, the keyboard navigation and the scroll
 * lock — so buying decisions that are almost entirely visual were made on a
 * thumbnail nobody could enlarge. The `cl__gallery` wrapper caps the stage
 * height: the shared 16/10 stage is over 550px tall in this column, which
 * pushed the title and price below the fold on both desktop and mobile.
 */
export default function ClassifiedGallery({ images, title }: ClassifiedGalleryProps) {
  return (
    <div className="cl__gallery">
      <ImageCarousel images={images} altPrefix={title} />
    </div>
  )
}
