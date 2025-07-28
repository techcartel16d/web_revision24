import React, { useEffect, useRef } from 'react';

const MathRenderer = ({ content }) => {
  const ref = useRef();

  useEffect(() => {
    if (window.MathJax && ref.current) {
      window.MathJax.typesetPromise([ref.current]);
    }
  }, [content]);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: content }} />;
};

export default MathRenderer;
