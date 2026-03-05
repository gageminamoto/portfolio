"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"

interface ImageLightboxProps {
  src: string
  alt: string
  onClose: () => void
}

export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Expanded image"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      style={{ overscrollBehavior: "contain" }}
      onClick={onClose}
    >
      <button
        ref={closeRef}
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 rounded-md p-2 text-white/70 transition-colors duration-150 ease-out hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
      >
        <X className="h-5 w-5" />
      </button>

      <motion.img
        src={src}
        alt={alt}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-h-[85vh] max-w-[95vw] rounded-lg object-contain md:max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  )
}
