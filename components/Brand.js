"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SITE_NAME } from "@/lib/content";

// Shows the UM logo (public/assets/um-logo.png). Until that file exists, shows the text name instead.
export default function Brand() {
  const [noLogo, setNoLogo] = useState(false);
  const img = useRef(null);
  useEffect(() => {
    // the image may have failed before the page became interactive
    if (img.current && img.current.complete && img.current.naturalWidth === 0) setNoLogo(true);
  }, []);
  return (
    <Link className={`brand${noLogo ? " nologo" : ""}`} href="/" aria-label={`${SITE_NAME} home`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={img} className="logo" src="/assets/um-logo.png" alt="Universiti Malaya" onError={() => setNoLogo(true)} />
      <span className="fallback">
        <span className="mark" aria-hidden="true">UM</span>
        <span><b>{SITE_NAME}</b><small>Universiti Malaya</small></span>
      </span>
    </Link>
  );
}
