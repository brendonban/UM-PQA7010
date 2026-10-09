import PageHero from "@/components/PageHero";
import { HOTLINES } from "@/lib/content";

export const metadata = { title: "Crisis support", description: "Emergency and 24/7 mental health support lines in Malaysia." };

export default function Crisis() {
  return (
    <>
      <PageHero crumb="Crisis support" title="Need help right now?">
        Our centre does not provide crisis services. If you or someone you know is at risk, contact one of these services immediately.
      </PageHero>
      <section id="crisis">
        <div className="wrap">
          <div className="lines">
            {HOTLINES.map((h) => (
              <div className="line" key={h.tel}>
                <small>{h.label}</small>
                <b><a href={`tel:${h.tel}`}>{h.number}</a></b>
                <small>{h.note}</small>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
