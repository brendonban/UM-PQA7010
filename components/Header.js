"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/content";
import Brand from "./Brand";

export default function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  const current = (href) => (path === href ? "page" : undefined);

  return (
    <header>
      <div className="wrap nav">
        <Brand />
        <ul>
          {NAV.map((n) => (
            <li key={n.href}><Link href={n.href} aria-current={current(n.href)}>{n.label}</Link></li>
          ))}
        </ul>
        <Link className="cta-btn" href="/register">Register Now</Link>
        <button className="icon-btn" id="menuBtn" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
      </div>
      <nav className={`mobile-menu${open ? " open" : ""}`}>
        <Link href="/" aria-current={current("/")}>Home</Link>
        {NAV.map((n) => <Link key={n.href} href={n.href} aria-current={current(n.href)}>{n.label}</Link>)}
        <Link href="/register" style={{ color: "var(--navy)", fontWeight: 600 }}>Register Now →</Link>
        <Link href="/admin" className="mm-staff">Staff login</Link>
      </nav>
    </header>
  );
}
