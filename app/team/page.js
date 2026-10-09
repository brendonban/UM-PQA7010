import PageHero from "@/components/PageHero";
import TeamGrid from "@/components/TeamGrid";
import SafeImage from "@/components/SafeImage";
import { SUPERVISOR } from "@/lib/content";

export const metadata = { title: "Our Team", description: "Our clinical supervisor and trainee counselors." };

export default function Team() {
  return (
    <>
      <PageHero crumb="Our Team" title="Our Team">
        Our dedicated team of trainee counselors is here to support your mental health journey.
      </PageHero>
      <section id="team">
        <div className="wrap">
          <span className="label" id="supervisor" style={{ display: "block", marginBottom: "1.4rem", scrollMarginTop: 110 }}>Clinical supervisor</span>
          <div className="supervisor">
            <div className="ph"><SafeImage src={SUPERVISOR.photo} /><span className="ph-fb">Photo</span></div>
            <div>
              <h3>{SUPERVISOR.name}</h3>
              <p className="role">{SUPERVISOR.role}</p>
              <p>{SUPERVISOR.bio}</p>
            </div>
          </div>
          <TeamGrid />
        </div>
      </section>
    </>
  );
}
