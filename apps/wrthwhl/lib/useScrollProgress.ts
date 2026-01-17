import { useState, useEffect, useCallback } from 'react';

interface ScrollProgress {
  /** 0 = at top, 1 = fully scrolled (based on threshold) */
  progress: number;
  /** Raw scroll position in pixels */
  scrollY: number;
  /** Whether user has scrolled at all */
  hasScrolled: boolean;
}

/**
 * Hook to track scroll progress within a threshold range.
 * @param threshold - The scroll distance (in px) over which progress goes from 0 to 1
 */
export function useScrollProgress(threshold = 100): ScrollProgress {
  const [state, setState] = useState<ScrollProgress>({
    progress: 0,
    scrollY: 0,
    hasScrolled: false,
  });

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const progress = Math.min(1, Math.max(0, scrollY / threshold));

    setState({
      progress,
      scrollY,
      hasScrolled: scrollY > 0,
    });
  }, [threshold]);

  useEffect(() => {
    // Set initial state
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return state;
}
