import React, { useEffect, useRef } from 'react';

const MathRenderer = ({ text }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && window.MathJax) {
      ref.current.innerHTML = text;
      window.MathJax.typesetPromise([ref.current]).catch((err) =>
        console.error('MathJax render error:', err)
      );
    }
  }, [text]);

  return (
    <div
      ref={ref}
      className="math-content"
    />
  );
};

export default MathRenderer;
