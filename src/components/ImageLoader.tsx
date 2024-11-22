import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ImageLoader({ src, alt, className = '' }: ImageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    setError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-200"
          >
            <motion.div
              animate={{
                x: ['0%', '100%'],
                opacity: [0.2, 0.6, 0.2]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="h-full w-1/2 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {error ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
          <span className="text-sm">Image non disponible</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`${className} ${isLoading ? 'invisible' : 'visible'}`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
}