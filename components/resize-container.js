import React, { useState, useEffect, useRef } from "react";

export const isBrowser = typeof window !== "undefined";

const ResizeContainer = ({ children, className }) => {
  const [dimensions, setDimensions] = useState({
    height: isBrowser ? window.innerHeight : 0,
    width: isBrowser ? window.innerWidth : 0,
  });

  const [box, setBox] = useState({ width: 0, height: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const resizeHandler = () => {
      if (isBrowser) {
        setDimensions({
          height: window.innerHeight,
          width: window.innerWidth,
        });
      }
    };

    if (isBrowser) window.addEventListener("resize", resizeHandler);

    return () => {
      if (isBrowser) window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useEffect(() => {
    if (!ref) return;

    const { width, height } = ref.current.getBoundingClientRect();

    setBox({ width, height });
  }, [ref, dimensions]);

  return (
    <div className={className} ref={ref}>
      {children({ ...box })}
    </div>
  );
};

export default ResizeContainer;
