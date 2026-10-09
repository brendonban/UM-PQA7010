import PageHero from "@/components/PageHero";
import GetStarted from "@/components/GetStarted";
import Icon from "@/components/Icon";
import { SERVICES } from "@/lib/content";

export const metadata = { title: "Our Services", description: "Counseling, therapy and psychological assessment services." };

export default function Services() {
  return (
    <>
      <PageHero crumb="Our Services" title="Our Services">
        All services are free and confidential. Sessions are delivered by trainee counselors and closely supervised by a registered clinical supervisor.
      </PageHero>
      <section id="services">
        <div className="wrap">
          <div className="list">
            {SERVICES.map((s) => (
              <div className="item" key={s.name}>
                <Icon name={s.icon} />
                <div><h3>{s.name}</h3><p>{s.description}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <GetStarted />
    </>
  );
}
