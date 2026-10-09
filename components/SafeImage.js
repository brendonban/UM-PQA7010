"use client";
import { useEffect, useRef, useState } from "react";

// An <img> that quietly disappears if the file is missing, so a placeholder behind it shows instead.
export default function SafeImage({ src, alt = "", className, onMissing }) {
  const [missing, setMissing] = useState(!src);
  const ref = useRef(null);
  useEffect(() => {
    setMissing(!src);
  }, [src]);
  useEffect(() => {
    if (ref.current && ref.current.complete && ref.current.naturalWidth === 0) setMissing(true);
  }, [src]);
  useEffect(() => { if (missing && onMissing) onMissing(); }, [missing, onMissing]);
  if (missing) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={ref} src={src} alt={alt} className={className} loading="lazy" onError={() => setMissing(true)} />;
}
