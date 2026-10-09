"use client";
import { useEffect, useRef } from "react";

// Native <dialog> controlled by React: open when `open` is true; onClose when dismissed.
export default function Modal({ open, onClose, labelledBy, className = "", children }) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className={`tmodal ad-dialog ${className}`} aria-labelledby={labelledBy}
      onClose={onClose} onClick={(e) => { if (e.target === ref.current) ref.current.close(); }}>
      <button className="tclose" aria-label="Close" onClick={() => ref.current.close()}><span className="ci">✕</span></button>
      {open && children}
    </dialog>
  );
}
