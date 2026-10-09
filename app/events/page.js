import PageHero from "@/components/PageHero";
import EventsList from "@/components/EventsList";

export const metadata = { title: "Events", description: "Upcoming talks, workshops and activities from our counseling centre." };

export default function Events() {
  return (
    <>
      <PageHero crumb="Events" title="Events">
        Talks, workshops and activities to help our community look after their mental health. All events are free unless stated.
      </PageHero>
      <section className="ev-section">
        <div className="wrap">
          <EventsList />
        </div>
      </section>
    </>
  );
}
