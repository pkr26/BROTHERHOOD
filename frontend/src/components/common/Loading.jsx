import { Suspense } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

// Full page loader
export const PageLoader = ({ message = "Loading..." }) => {
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

// Skeleton loader for lists
export const SkeletonList = ({ count = 3, variant = 'text', className = '' }) => {
  return (
    <div className={clsx('space-y-3', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} variant={variant} />
      ))}
    </div>
  );
};

// Card skeleton
export const CardSkeleton = ({ className = '' }) => {
  return (
    <div className={clsx('card', className)}>
      <div className="flex items-center mb-4">
        <Skeleton variant="circular" className="mr-3" />
        <div className="flex-1">
          <Skeleton variant="text" width="40%" className="mb-2" />
          <Skeleton variant="text" width="20%" height="0.75rem" />
        </div>
      </div>
      <Skeleton variant="text" className="mb-2" />
      <Skeleton variant="text" className="mb-2" />
      <Skeleton variant="text" width="70%" className="mb-4" />
      <Skeleton variant="rectangular" height="12rem" />
      <div className="flex gap-4 mt-4">
        <Skeleton variant="text" width="60px" />
        <Skeleton variant="text" width="60px" />
        <Skeleton variant="text" width="60px" />
      </div>
    </div>
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

// Lazy load wrapper with suspense
export const LazyLoadWrapper = ({ children, fallback = <PageLoader /> }) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

// Progress bar
export const ProgressBar = ({ progress, className = '', showLabel = false }) => {
  return (
    <div className={clsx('w-full', className)}>
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <p className="text-sm text-gray-600 mt-1 text-center">{progress}%</p>
      )}
    </div>
  );
};

const LoadingComponents = {
  PageLoader,
  Spinner,
  Skeleton,
  SkeletonList,
  CardSkeleton,
  ButtonLoader,
  LazyLoadWrapper,
  ProgressBar,
};

export default LoadingComponents;