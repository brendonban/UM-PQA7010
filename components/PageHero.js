import Link from "next/link";

export default function PageHero({ crumb, title, children }) {
  return (
    <div className="page-hero">
      <div className="wrap">
        <span className="crumb"><Link href="/">Home</Link> / {crumb}</span>
        <div className="rule" />
        <h1>{title}</h1>
        {children && <p>{children}</p>}
      </div>
    </div>
  );
}
