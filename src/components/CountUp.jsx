// CountUp.jsx - ĐÃ CẢI THIỆN
import React, { useState, useEffect, useRef } from 'react';

function CountUp({ end, duration = 2000, startWhen = true, suffix = "", prefix = "" }) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  useEffect(() => {
    if (!startWhen || end === 0) {
      setValue(end);
      return;
    }

    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const current = Math.floor(easedProgress * end);

      setValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setValue(end); // đảm bảo đúng 100%
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [startWhen, end, duration]);

  return <>{prefix}{value.toLocaleString()}{suffix}</>;
}

export default CountUp;