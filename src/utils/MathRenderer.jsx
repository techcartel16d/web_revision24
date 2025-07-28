import React, { useEffect, useRef } from 'react';

const MathRenderer = ({ text }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = text;

      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([ref.current]).catch((err) =>
          console.error('MathJax render error:', err)
        );
      }
    }
  }, [text]);

  return (
    <div
      ref={ref}
      className="math-renderer-content"
    />
  );
};

export default MathRenderer;
