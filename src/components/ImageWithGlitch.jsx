import { useState } from 'react';
import ImageShaderHover from './ImageShaderHover';

/**
 * Simple wrapper component for easy glitch effect application
 * 
 * Usage:
 * <ImageWithGlitch src="image.jpg" />
 * <ImageWithGlitch src="image.jpg" effect="pixelSort" intensity={0.8} />
 * 
 * Props:
 * - src: Image URL (required)
 * - effect: "blockGlitch" | "pixelSort" | "displacement" (default: "blockGlitch")
 * - intensity: 0-1 (default: 0.7)
 * - blockSize: 0-1 (default: 0.5)
 * - width: CSS width (default: "100%")
 * - height: CSS height (default: "auto" scales with image)
 * - aspectRatio: aspect ratio string like "16/9" (default: "auto")
 * - className: additional CSS classes
 * - alt: alt text for accessibility
 */
export default function ImageWithGlitch({
  src,
  effect = 'blockGlitch',
  intensity = 0.7,
  blockSize = 0.5,
  width = '100%',
  height = 'auto',
  aspectRatio = 'auto',
  className = '',
  alt = 'Glitch effect image',
}) {
  const [imageAspect, setImageAspect] = useState(null);

  // If height is auto, we need to know the image aspect ratio
  if (height === 'auto' && !imageAspect) {
    const img = new Image();
    img.onload = () => {
      setImageAspect(img.width / img.height);
    };
    img.src = src;
  }

  const calculatedHeight =
    height === 'auto'
      ? imageAspect
        ? `calc(${width} / ${imageAspect})`
        : '400px'
      : height;

  return (
    <div
      className={className}
      style={{
        width,
        height: calculatedHeight,
        aspectRatio: aspectRatio !== 'auto' ? aspectRatio : undefined,
      }}
    >
      <ImageShaderHover
        src={src}
        fallbackSrc={src}
        effect={effect}
        intensity={intensity}
        blockSize={blockSize}
        width="100%"
        height="100%"
      />
      <img
        src={src}
        alt={alt}
        style={{ display: 'none' }}
        crossOrigin="anonymous"
      />
    </div>
  );
}
