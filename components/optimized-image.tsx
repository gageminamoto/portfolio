"use client"

import { useCallback, useEffect, useRef, useState, type ImgHTMLAttributes } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

type LoadingMode = "eager" | "lazy"

const loadedImageSrcs = new Set<string>()
const preloadingImageSrcs = new Set<string>()

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
  quality?: number
  priority?: boolean
  loading?: LoadingMode
  decoding?: ImgHTMLAttributes<HTMLImageElement>["decoding"]
  draggable?: boolean
  className?: string
  imageClassName?: string
  skeletonClassName?: string
  fallbackToImg?: boolean
  onError?: ImgHTMLAttributes<HTMLImageElement>["onError"]
  "aria-hidden"?: boolean | "true" | "false"
}

function shouldUseNativeImage(src: string, fallbackToImg?: boolean) {
  if (fallbackToImg) return true

  const pathname = src.split("?")[0]?.toLowerCase() ?? ""
  return pathname.endsWith(".gif") || pathname.endsWith(".svg")
}

export function preloadOptimizedImageSrc(src: string) {
  if (loadedImageSrcs.has(src) || preloadingImageSrcs.has(src)) return

  preloadingImageSrcs.add(src)
  const img = new window.Image()
  img.decoding = "async"
  img.onload = () => {
    loadedImageSrcs.add(src)
    preloadingImageSrcs.delete(src)
  }
  img.onerror = () => {
    preloadingImageSrcs.delete(src)
  }
  img.src = src
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes,
  quality,
  priority,
  loading = priority ? "eager" : "lazy",
  decoding = "async",
  draggable,
  className,
  imageClassName,
  skeletonClassName,
  fallbackToImg,
  onError,
  "aria-hidden": ariaHidden,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(() => loadedImageSrcs.has(src))
  const imgRef = useRef<HTMLImageElement>(null)
  const useNativeImage = shouldUseNativeImage(src, fallbackToImg)
  const handleLoad = useCallback(() => {
    loadedImageSrcs.add(src)
    setLoaded(true)
  }, [src])

  useEffect(() => {
    setLoaded(loadedImageSrcs.has(src))
  }, [src])

  useEffect(() => {
    const img = imgRef.current
    if (!useNativeImage || !img) return

    if (img.complete && img.naturalWidth > 0) {
      handleLoad()
    }
  }, [handleLoad, src, useNativeImage])

  return (
    <span className={cn("relative block overflow-hidden bg-muted", className)}>
      {!loaded ? (
        <span
          aria-hidden="true"
          className={cn("absolute inset-0 h-full w-full animate-pulse rounded-none bg-accent", skeletonClassName)}
        />
      ) : null}
      {useNativeImage ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding={decoding}
          draggable={draggable}
          aria-hidden={ariaHidden}
          onLoad={handleLoad}
          onError={onError}
          className={cn(
            fill ? "absolute inset-0 h-full w-full" : "h-auto w-full",
            "transition-opacity duration-300 ease-out",
            loaded ? "opacity-100" : "opacity-0",
            imageClassName,
          )}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          sizes={sizes}
          quality={quality}
          priority={priority}
          loading={priority ? undefined : loading}
          draggable={draggable}
          aria-hidden={ariaHidden}
          onLoad={handleLoad}
          onError={onError}
          className={cn(
            "transition-opacity duration-300 ease-out",
            loaded ? "opacity-100" : "opacity-0",
            imageClassName,
          )}
        />
      )}
    </span>
  )
}
