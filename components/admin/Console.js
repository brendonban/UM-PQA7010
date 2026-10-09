"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Modal from "./Modal";
import { STATUSES, liveStore, demoStore } from "./store";
import { firebaseReady } from "@/lib/firebase";

const fmt = (d) => (d ? d.toLocaleString("en-MY", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }) : "—");
// Plain-language explanations of Firebase sign-in errors, so staff know what to fix.
function signInMsg(e) {
  const code = (e && e.code) || "";
  const host = typeof window !== "undefined" ? window.location.hostname : "this website";
  const m = {
    "auth/unauthorized-domain": `This website address (${host}) isn't allowed to sign in yet. In Firebase, go to Authentication → Settings → Authorized domains → Add domain, and add ${host}.`,
    "auth/operation-not-allowed": "Google sign-in isn't switched on. In Firebase, go to Authentication → Sign-in method → Google → Enable → Save.",
    "auth/configuration-not-found": "Firebase Authentication hasn't been set up. In Firebase, go to Authentication → Get started, then enable Google.",
    "auth/popup-blocked": "Your browser blocked the sign-in window. Allow pop-ups for this site, then try again.",
    "auth/popup-closed-by-user": "The sign-in window was closed before finishing. Please try again.",
    "auth/cancelled-popup-request": "The sign-in window was closed before finishing. Please try again.",
    "auth/invalid-api-key": "The Firebase apiKey in the site settings is wrong. Copy it again from Firebase → Project settings.",
    "auth/api-key-not-valid.-please-pass-a-valid-api-key.": "The Firebase apiKey in the site settings is wrong. Copy it again from Firebase → Project settings.",
    "auth/network-request-failed": "Couldn't reach Google. Check your internet connection and try again.",
  };
  return m[code] || `Sign-in failed${code ? ` (${code})` : ""}. Please try again, or send this message to the site admin.`;
}

const deniedMsg = (e) => (e && e.code === "permission-denied")
  ? "This account isn't on the staff list. Ask the console owner to add your email."
  : "Couldn't load data. Please try again.";

export default function Console() {
  const params = useSearchParams();
  const demo = !firebaseReady || params.has("demo");
  const store = useMemo(() => (demo ? demoStore() : liveStore()), [demo]);

  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("regs");
  const [regs, setRegs] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [events, setEvents] = useState([]);

  // sign-in state (demo mode only "signs in" when ?demo is in the address)
  useEffect(() => {
    if (demo && !params.has("demo")) { setChecked(true); return; }
    return store.onUser((u) => { setUser(u); setChecked(true); });
  }, [store, demo, params]);

  // load data once signed in
  useEffect(() => {
    if (!user) return;
    let stop = () => {};
    (async () => {
      try {
        setTrainees(await store.loadTrainees());
        setEvents(await store.loadEvents());
        stop = store.watchRegs(setRegs, (e) => { setError(deniedMsg(e)); setUser(null); });
      } catch (e) { setError(deniedMsg(e)); setUser(null); }
    })();
    return () => stop();
  }, [user, store]);

  async function signIn() {
    setError("");
    if (!firebaseReady) { setError("The database isn't connected yet."); return; }
    try { await store.signIn(); } catch (e) { console.warn(e); setError(signInMsg(e)); }
  }

  if (!checked) return <div className="admin"><div className="wrap" /></div>;

  if (!user) {
    return (
      <div className="admin"><div className="wrap">
        <div className="ad-login">
          <span className="label" style={{ color: "var(--c3)" }}>Staff only</span>
          <h1>Counseling console</h1>
          <p>Sign in with an approved UM Google account to see registrations and update trainee details and events.</p>
          <button className="cta-btn" type="button" onClick={signIn}>Sign in with Google</button>
          {error && <p className="ad-err">{error}</p>}
          {!firebaseReady && (
            <p className="ad-demo-note">
              The database isn&apos;t connected yet: this version of the site was built without Firebase settings.
              Paste them into <code>lib/firebase-config.js</code> (or add the Vercel environment variables) and redeploy.{" "}
              <a className="link" href="/admin?demo=1">Preview the console with sample data</a>
            </p>
          )}
        </div>
      </div></div>
    );
  }

  const newCount = regs.filter((r) => r.status === "New").length;
  return (
    <div className="admin"><div className="wrap">
      <div className="ad-bar">
        <div>
          <span className="label" style={{ color: "var(--c3)" }}>{store.demo ? "Demo mode · sample data, nothing is saved" : "Staff console"}</span>
          <h1>Counseling console</h1>
        </div>
        <div className="ad-user"><span>{user.email}</span><button className="ad-btn ghost" type="button" onClick={() => store.signOut()}>Sign out</button></div>
      </div>

      <div className="ad-tabs" role="tablist">
        {[["regs", "Registrations"], ["trainees", "Trainee counselors"], ["events", "Events"]].map(([id, label]) => (
          <button key={id} className="ad-tab" role="tab" aria-selected={tab === id} onClick={() => setTab(id)}>
            {label}{id === "regs" && <span className="pill">{newCount}</span>}
          </button>
        ))}
      </div>

      {tab === "regs" && <Registrations regs={regs} trainees={trainees} store={store} />}
      {tab === "trainees" && <Trainees trainees={trainees} setTrainees={setTrainees} store={store} />}
      {tab === "events" && <Events events={events} setEvents={setEvents} store={store} />}
    </div></div>
  );
}

/* ---------------- Registrations ---------------- */
function Registrations({ regs, trainees, store }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [openId, setOpenId] = useState(null);

  const list = regs.filter((r) => (!status || r.status === status) &&
    (!q || [r.name, r.phone, r.email].join(" ").toLowerCase().includes(q.toLowerCase())));
  const current = regs.find((r) => r.id === openId);

  function exportCsv() {
    const cols = ["createdAt", "name", "phone", "email", "age", "clientType", "service", "language", "time", "preferredCounselor", "concern", "status", "assignedTo", "notes"];
    const cell = (v) => `"${String(v instanceof Date ? v.toISOString() : v ?? "").replace(/"/g, '""')}"`;
    const csv = [cols.join(","), ...list.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv" }));
    a.download = `registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  return (
    <section className="ad-panel">
      <div className="ad-stats">
        {STATUSES.map((s) => (
          <button key={s} className={`stat ${status === s ? "on" : ""}`} onClick={() => setStatus(status === s ? "" : s)}>
            <b>{regs.filter((r) => r.status === s).length}</b><span>{s}</span>
          </button>
        ))}
      </div>
      <div className="ad-tools">
        <input type="search" placeholder="Search name, phone, email…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button className="ad-btn ghost" type="button" onClick={exportCsv}>Export CSV</button>
      </div>
      <div className="ad-table-wrap">
        <table className="ad-table">
          <thead><tr><th>Received</th><th>Name</th><th>Contact</th><th>Service</th><th>Preferred</th><th>Assigned to</th><th>Status</th></tr></thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id} tabIndex={0} onClick={() => setOpenId(r.id)} onKeyDown={(e) => e.key === "Enter" && setOpenId(r.id)}>
                <td>{fmt(r.createdAt)}</td>
                <td><b>{r.name}</b><small>{r.clientType} · {r.age}</small></td>
                <td>{r.phone}{r.email && <small>{r.email}</small>}</td>
                <td>{r.service}</td>
                <td>{r.preferredCounselor}</td>
                <td>{r.assignedTo || "—"}</td>
                <td><span className={`status s-${String(r.status).replace(/\s/g, "")}`}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="ad-empty">No registrations yet.</p>}
      </div>

      <Modal open={!!current} onClose={() => setOpenId(null)} labelledBy="rdName">
        {current && <RegDetail r={current} trainees={trainees} store={store} close={() => setOpenId(null)} />}
      </Modal>
    </section>
  );
}

function RegDetail({ r, trainees, store, close }) {
  const [status, setStatus] = useState(r.status || "New");
  const [assigned, setAssigned] = useState(r.assignedTo || "");
  const [notes, setNotes] = useState(r.notes || "");
  const [saved, setSaved] = useState(false);
  const wa = String(r.phone || "").replace(/\D/g, "").replace(/^0/, "60");
  const rows = [
    ["Phone / WhatsApp", <>{r.phone} <a className="link" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${wa}`}>WhatsApp</a></>],
    ["Email", r.email ? <a className="link" href={`mailto:${r.email}`}>{r.email}</a> : "—"],
    ["Age", r.age], ["Client", r.clientType], ["Service", r.service], ["Language", r.language],
    ["Best time", r.time], ["Preferred counselor", r.preferredCounselor],
  ];
  async function save() {
    try {
      await store.updateReg(r.id, { status, assignedTo: assigned, notes });
      setSaved(true); setTimeout(close, 600);
    } catch { alert("Couldn't save. Please try again."); }
  }
  return (
    <>
      <p className="tm-role">Received {fmt(r.createdAt)}</p>
      <h2 id="rdName">{r.name}</h2>
      <dl className="ad-dl">{rows.map(([k, v]) => <div key={k} style={{ display: "contents" }}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      {r.concern && <div className="ad-concern"><b>What they&apos;d like support with</b><p>{r.concern}</p></div>}
      <div className="two">
        <label><span>Status</span><select value={status} onChange={(e) => setStatus(e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label>
        <label><span>Assign to</span>
          <select value={assigned} onChange={(e) => setAssigned(e.target.value)}>
            <option value="">Not assigned</option>{trainees.map((t) => <option key={t.id}>{t.name}</option>)}
          </select>
        </label>
      </div>
      <label><span>Internal notes <small>(staff only)</small></span><textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
      <div className="ad-dialog-actions">{saved && <span className="ad-saved">Saved</span>}<button className="ad-btn" type="button" onClick={save}>Save changes</button></div>
    </>
  );
}

/* ---------------- Trainees ---------------- */
const TR_FIELDS = ["name", "interests", "approach", "languages", "photo", "bio", "whatsapp", "telegram", "email"];

function Trainees({ trainees, setTrainees, store }) {
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...} = existing
  return (
    <section className="ad-panel">
      <div className="ad-tools">
        <p style={{ margin: 0 }}>These details appear on the Our Team page and in the registration form.</p>
        <button className="ad-btn" type="button" onClick={() => setEditing({ active: true, order: trainees.length + 1 })}>+ Add trainee</button>
      </div>
      <div className="ad-trainees">
        {trainees.map((t) => (
          <div key={t.id} className={`ad-tr ${t.active === false ? "off" : ""}`}>
            <div className="ad-av"><span>{(t.name || "?").trim()[0] || "?"}</span></div>
            <div className="ad-tr-info">
              <b>{t.name}</b><small>{t.interests || "No interests added"}</small>
              <small className="ad-flags">{t.active === false ? "Hidden from website" : "Shown on website"} · #{t.order ?? "–"}</small>
            </div>
            <button className="ad-btn ghost" onClick={() => setEditing(t)}>Edit</button>
          </div>
        ))}
        {trainees.length === 0 && <p className="ad-empty">No trainees yet. Add your first one.</p>}
      </div>
      <Modal open={!!editing} onClose={() => setEditing(null)} labelledBy="trTitle">
        {editing && <TraineeForm t={editing} count={trainees.length} store={store} done={(list) => { if (list) setTrainees(list); setEditing(null); }} />}
      </Modal>
    </section>
  );
}

function TraineeForm({ t, count, store, done }) {
  async function submit(e) {
    e.preventDefault();
    const f = e.currentTarget, data = {};
    TR_FIELDS.forEach((k) => (data[k] = f.elements[k].value.trim()));
    data.whatsapp = data.whatsapp.replace(/\D/g, "");
    data.telegram = data.telegram.replace(/^@/, "");
    data.order = Number(f.elements.order.value) || count + 1;
    data.active = f.elements.active.checked;
    try { done(await store.saveTrainee(t.id, data)); } catch { alert("Couldn't save. Please try again."); }
  }
  async function remove() {
    if (!confirm(`Delete ${t.name}? This removes them from the website.`)) return;
    try { done(await store.deleteTrainee(t.id)); } catch { alert("Couldn't delete. Please try again."); }
  }
  return (
    <>
      <h2 id="trTitle">{t.id ? "Edit trainee" : "Add trainee"}</h2>
      <form onSubmit={submit}>
        <label><span>Name <em>*</em></span><input name="name" required defaultValue={t.name} /></label>
        <div className="two">
          <label><span>Interests</span><input name="interests" defaultValue={t.interests} placeholder="e.g. anxiety, relationships" /></label>
          <label><span>Approach</span><input name="approach" defaultValue={t.approach} placeholder="e.g. Person-centred, CBT" /></label>
        </div>
        <div className="two">
          <label><span>Languages</span><input name="languages" defaultValue={t.languages} placeholder="e.g. English, Bahasa Melayu" /></label>
          <label><span>Photo link</span><input name="photo" defaultValue={t.photo} placeholder="/assets/trainees/aina.jpg or https://…" /></label>
        </div>
        <label><span>Short introduction</span><textarea name="bio" rows={3} defaultValue={t.bio} placeholder="2–3 warm sentences clients will read" /></label>
        <div className="two">
          <label><span>WhatsApp <small>(digits incl. 60)</small></span><input name="whatsapp" inputMode="numeric" defaultValue={t.whatsapp} placeholder="60123456789" /></label>
          <label><span>Telegram username</span><input name="telegram" defaultValue={t.telegram} placeholder="without @" /></label>
        </div>
        <div className="two">
          <label><span>Email</span><input name="email" type="email" defaultValue={t.email} /></label>
          <label><span>Display order</span><input name="order" type="number" min="1" defaultValue={t.order} /></label>
        </div>
        <label className="consent"><input type="checkbox" name="active" defaultChecked={t.active !== false} /><span>Show on website</span></label>
        <div className="ad-dialog-actions">
          {t.id && <button className="ad-btn danger ghost" type="button" style={{ marginRight: "auto" }} onClick={remove}>Delete</button>}
          <button className="ad-btn" type="submit">Save trainee</button>
        </div>
      </form>
    </>
  );
}

/* ---------------- Events ---------------- */
const EV_FIELDS = ["title", "date", "startTime", "endTime", "location", "description", "link", "image"];
const evDate = (e) => {
  const d = new Date(e.date + "T00:00:00");
  return isNaN(d) ? "No date" : d.toLocaleDateString("en-MY", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
};

function Events({ events, setEvents, store }) {
  const [editing, setEditing] = useState(null);
  const today = new Date().toISOString().slice(0, 10);
  const list = [...events].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return (
    <section className="ad-panel">
      <div className="ad-tools">
        <p style={{ margin: 0 }}>Published events appear on the Events page, soonest first.</p>
        <button className="ad-btn" type="button" onClick={() => setEditing({ published: true })}>+ Add event</button>
      </div>
      <div className="ad-trainees">
        {list.map((e) => (
          <div key={e.id} className={`ad-tr ${e.published ? "" : "off"}`}>
            <div className="ad-av ad-cal"><b>{(e.date || "").slice(8, 10) || "?"}</b></div>
            <div className="ad-tr-info">
              <b>{e.title}</b>
              <small>{evDate(e)}{e.startTime ? ` · ${e.startTime}` : ""}{e.location ? ` · ${e.location}` : ""}</small>
              <small className="ad-flags">{e.published ? "Published" : "Draft – not on website"}{String(e.date) < today ? " · Past" : ""}</small>
            </div>
            <button className="ad-btn ghost" onClick={() => setEditing(e)}>Edit</button>
          </div>
        ))}
        {list.length === 0 && <p className="ad-empty">No events yet. Add your first one.</p>}
      </div>
      <Modal open={!!editing} onClose={() => setEditing(null)} labelledBy="evTitle">
        {editing && <EventForm e={editing} store={store} done={(l) => { if (l) setEvents(l); setEditing(null); }} />}
      </Modal>
    </section>
  );
}

function EventForm({ e, store, done }) {
  async function submit(ev) {
    ev.preventDefault();
    const f = ev.currentTarget, data = {};
    EV_FIELDS.forEach((k) => (data[k] = f.elements[k].value.trim()));
    data.published = f.elements.published.checked;
    try { done(await store.saveEvent(e.id, data)); } catch { alert("Couldn't save. Please try again."); }
  }
  async function remove() {
    if (!confirm(`Delete "${e.title}"?`)) return;
    try { done(await store.deleteEvent(e.id)); } catch { alert("Couldn't delete. Please try again."); }
  }
  return (
    <>
      <h2 id="evTitle">{e.id ? "Edit event" : "Add event"}</h2>
      <form onSubmit={submit}>
        <label><span>Event title <em>*</em></span><input name="title" required defaultValue={e.title} /></label>
        <div className="three">
          <label><span>Date <em>*</em></span><input name="date" type="date" required defaultValue={e.date} /></label>
          <label><span>Start time</span><input name="startTime" type="time" defaultValue={e.startTime} /></label>
          <label><span>End time</span><input name="endTime" type="time" defaultValue={e.endTime} /></label>
        </div>
        <label><span>Location</span><input name="location" defaultValue={e.location} placeholder="e.g. Counseling Lab, Level 03, Menara Pendidikan" /></label>
        <label><span>Description</span><textarea name="description" rows={4} defaultValue={e.description} placeholder="What it's about, who it's for, what people will take away" /></label>
        <div className="two">
          <label><span>Sign-up / more info link <small>(optional)</small></span><input name="link" type="url" defaultValue={e.link} placeholder="https://…" /></label>
          <label><span>Poster or photo link <small>(optional)</small></span><input name="image" defaultValue={e.image} placeholder="/assets/events/poster.jpg or https://…" /></label>
        </div>
        <label className="consent"><input type="checkbox" name="published" defaultChecked={!!e.published} /><span>Publish on website</span></label>
        <div className="ad-dialog-actions">
          {e.id && <button className="ad-btn danger ghost" type="button" style={{ marginRight: "auto" }} onClick={remove}>Delete</button>}
          <button className="ad-btn" type="submit">Save event</button>
        </div>
      </form>
    </>
  );
}
