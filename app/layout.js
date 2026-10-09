import "./globals.css";
import Link from "next/link";
import Header from "@/components/Header";
import HelpButton from "@/components/HelpButton";
import Icon from "@/components/Icon";
import { SITE_NAME } from "@/lib/content";

export const metadata = {
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: "Free, confidential counseling for UM students, staff and the public.",
};

export const viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <footer>
          <div className="wrap">
            <div className="legal">
              <span>Designed &amp; built with 💙 by Brendon Ban</span>
              <Link className="staff-login" href="/admin"><Icon name="lock" box="mi" />Staff login</Link>
            </div>
          </div>
        </footer>
        <HelpButton />
      </body>
    </html>
  );
}
