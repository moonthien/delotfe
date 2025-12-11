import { useState, useEffect, useRef } from 'react';

export function useInView(threshold = 0.1, options = { 
  initialVisible: false, 
  animateOnMount: true 
}) {
  const [isVisible, setIsVisible] = useState(options.initialVisible);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [threshold]);

  // Animation khi mount lần đầu
  useEffect(() => {
    if (options.animateOnMount && ref.current) {
      // Trigger animation ngay khi component mount
      setTimeout(() => {
        setIsVisible(true);
      }, 100);
    }
  }, [options.animateOnMount]);

  return [ref, isVisible];
}