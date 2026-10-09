"use client";
import { useEffect, useState } from "react";
import SafeImage from "./SafeImage";
import { FALLBACK_EVENTS } from "@/lib/content";
import { loadEvents } from "@/lib/firebase";

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const t12 = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return ((h % 12) || 12) + (m ? "." + String(m).padStart(2, "0") : "") + (h < 12 ? " am" : " pm");
};

// Upcoming and past events. Uses the console's events once the database is connected.
export default function EventsList() {
  const [events, setEvents] = useState(FALLBACK_EVENTS);
  const [today, setToday] = useState(null);

  useEffect(() => {
    const d = new Date(); d.setHours(0, 0, 0, 0); setToday(d);
    loadEvents().then((list) => list && setEvents(list));
  }, []);

  const isPast = (e) => today && new Date(e.date + "T23:59:59") < today;
  const upcoming = events.filter((e) => !isPast(e));
  const past = events.filter(isPast).reverse().slice(0, 6);

  return (
    <>
      <span className="label ev-label">Upcoming</span>
      <div className="ev-list">{upcoming.map((e) => <EventCard key={e.id} e={e} />)}</div>
      {upcoming.length === 0 && <p className="ev-empty">No upcoming events right now. Please check back soon.</p>}
      {past.length > 0 && (
        <>
          <span className="label ev-label" style={{ marginTop: "3.5rem" }}>Past events</span>
          <div className="ev-list past">{past.map((e) => <EventCard key={e.id} e={e} past />)}</div>
        </>
      )}
    </>
  );
}

function EventCard({ e, past }) {
  const d = new Date(e.date + "T00:00:00");
  const ok = !isNaN(d);
  const when = [ok ? DAY[d.getDay()] : "", [t12(e.startTime), t12(e.endTime)].filter(Boolean).join(" – ")].filter(Boolean).join(", ");
  return (
    <article className="ev">
      <div className="ev-date"><b>{ok ? d.getDate() : "?"}</b><span>{ok ? `${MON[d.getMonth()]} ${d.getFullYear()}` : ""}</span></div>
      <div className="ev-body">
        {e.image && <div className="ev-img"><SafeImage src={e.image} /></div>}
        <h3>{e.title}</h3>
        <p className="ev-meta">
          {when && <span>🕒 {when}</span>}
          {e.location && <span>📍 {e.location}</span>}
        </p>
        {e.description && <p className="ev-desc">{e.description}</p>}
        {e.link && !past && <a className="cta-btn ev-btn" href={e.link} target="_blank" rel="noopener noreferrer">Join this event</a>}
      </div>
    </article>
  );
}
