import { useEffect, useRef } from 'react';

/**
 * Hook to detect clicks outside of a component
 * Useful for closing dropdowns, modals, etc.
 *
 * @param {Function} callback - Function to call when clicked outside
 * @param {boolean} enabled - Whether the hook is enabled (default: true)
 * @returns {React.RefObject} Ref to attach to the element
 *
 * @example
 * const ref = useClickOutside(() => setIsOpen(false));
 * return <div ref={ref}>Content</div>
 */
export const useClickOutside = (callback, enabled = true) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [callback, enabled]);

  return ref;
};
