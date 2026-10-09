import Link from "next/link";
import PageHero from "@/components/PageHero";
import { FAQS } from "@/lib/content";

export const metadata = { title: "FAQ", description: "Frequently asked questions about our counseling service." };

function answer(a) {
  if (a === "REGISTER_LINK")
    return <>Fill in our short <Link className="link" href="/register">registration form</Link>. A trainee counselor will reach out to you by phone or WhatsApp to arrange your first session.</>;
  if (a === "CRISIS_LINK")
    return <>We are not a 24-hour crisis service. If you or someone else is in immediate danger, call 999 or go to the nearest emergency department. See our <Link className="link" href="/crisis">crisis support</Link> page for 24/7 helplines.</>;
  return a;
}

export default function Faq() {
  return (
    <>
      <PageHero crumb="FAQ" title="Frequently Asked Questions">
        Can&apos;t find your answer? Ask your trainee counselor when they reach out.
      </PageHero>
      <section id="faq">
        <div className="wrap">
          <div className="faq">
            {FAQS.map(([q, a]) => (
              <details key={q}><summary>{q}</summary><p>{answer(a)}</p></details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
