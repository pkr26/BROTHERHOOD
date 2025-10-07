import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import logger from '../../utils/logger';

// Full page loader with performance tracking
export const PageLoader = ({ message = "Loading..." }) => {
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const startTime = startTimeRef.current;

    // Log if loading takes too long (performance issue)
    const warningTimer = setTimeout(() => {
      logger.warn('Page loader showing for extended period', {
        message,
        duration: '5s'
      });
    }, 5000); // Warn after 5 seconds

    const errorTimer = setTimeout(() => {
      logger.error('Page loader timeout - possible performance issue', {
        message,
        duration: '15s'
      });
    }, 15000); // Error after 15 seconds

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(errorTimer);

      const duration = Date.now() - startTime;
      if (duration > 3000) {
        logger.info('Page loading completed', {
          message,
          duration: `${(duration / 1000).toFixed(2)}s`
        });
      }
    };
  }, [message]);

  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="loader mb-4 mx-auto" />
        <p className="text-gray-600 font-medium">{message}</p>
      </motion.div>
    </div>
  );
};

// Inline spinner
export const Spinner = ({ size = 'md', color = 'primary', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  };

  const colorClasses = {
    primary: 'border-primary-lighter border-t-primary',
    accent: 'border-accent-lighter border-t-accent',
    white: 'border-white/30 border-t-white',
    gray: 'border-gray-300 border-t-gray-600',
  };

  return (
    <div
      className={clsx(
        'animate-spin rounded-full',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  );
};

// Skeleton loader for content
export const Skeleton = ({
  variant = 'text',
  width,
  height,
  className = '',
  animation = true
}) => {
  const variantClasses = {
    text: 'h-4 rounded',
    title: 'h-8 rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    card: 'rounded-xl',
  };

  const defaultSizes = {
    text: { width: '100%', height: '1rem' },
    title: { width: '60%', height: '2rem' },
    rectangular: { width: '100%', height: '10rem' },
    circular: { width: '3rem', height: '3rem' },
    card: { width: '100%', height: '20rem' },
  };

  const finalWidth = width || defaultSizes[variant].width;
  const finalHeight = height || defaultSizes[variant].height;

  return (
    <div
      className={clsx(
        'bg-gray-200',
        variantClasses[variant],
        animation && 'animate-pulse',
        className
      )}
      style={{
        width: finalWidth,
        height: finalHeight,
      }}
    />
  );
};

// Loading button state
export const ButtonLoader = ({ loading, children, className = '', ...props }) => {
  return (
    <button
      className={clsx('relative', className)}
      disabled={loading}
      {...props}
    >
      <span className={clsx(loading && 'invisible')}>{children}</span>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner size="sm" color="white" />
        </div>
      )}
    </button>
  );
};