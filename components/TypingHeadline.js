"use client";
import { useEffect, useRef, useState } from "react";

// Headline that types itself out once. Screen readers get the full text straight away.
export default function TypingHeadline({ text }) {
  const [shown, setShown] = useState(text);
  const h = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (h.current) h.current.style.minHeight = h.current.offsetHeight + "px";
    let i = 0, timer;
    setShown("");
    const tick = () => {
      i += 1;
      setShown(text.slice(0, i));
      if (i < text.length) {
        const ch = text[i - 1];
        timer = setTimeout(tick, ch === " " ? 90 : ch === "," || ch === "." ? 250 : 45 + Math.random() * 50);
      }
    };
    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <h1 id="typeHead" ref={h} aria-label={text}>
      <span id="typeText" aria-hidden="true">{shown}</span>
      <span className="caret" aria-hidden="true" />
    </h1>
  );
}
