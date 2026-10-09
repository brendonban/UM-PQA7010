"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { HOTLINES } from "@/lib/content";

// Floating "Need help now?" button with emergency numbers (bottom right of every public page).
export default function HelpButton() {
  const [open, setOpen] = useState(false);
  const btn = useRef(null);
  const closeBtn = useRef(null);
  const path = usePathname();

  useEffect(() => {
    if (open) closeBtn.current?.focus();
    const onKey = (e) => { if (e.key === "Escape" && open) { setOpen(false); btn.current?.focus(); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (path.startsWith("/admin")) return null;

  return (
    <div className="sos">
      <div className="sos-panel" id="sosPanel" role="dialog" aria-labelledby="sosTitle" hidden={!open}>
        <div className="sos-head">
          <h3 id="sosTitle">Need help right now?</h3>
          <button className="sos-close" ref={closeBtn} aria-label="Close" onClick={() => { setOpen(false); btn.current?.focus(); }}>×</button>
        </div>
        <p>We are not a crisis service. If you or someone else is at risk, call now.</p>
        {HOTLINES.map((h) => (
          <a key={h.tel} className="sos-line" href={`tel:${h.tel}`}><span>{h.short}</span><b>{h.number}</b></a>
        ))}
        <Link className="sos-more" href="/crisis" onClick={() => setOpen(false)}>More crisis support →</Link>
      </div>
      <button className="sos-btn" ref={btn} aria-expanded={open} aria-controls="sosPanel" onClick={() => setOpen(!open)}>
        <span className="dot" aria-hidden="true" />Need help now?
      </button>
    </div>
  );
}
