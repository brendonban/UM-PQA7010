"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { SERVICES, FALLBACK_TRAINEES } from "@/lib/content";
import { firebaseReady, loadTrainees, saveRegistration } from "@/lib/firebase";

const NO_PREF = "No preference";

export default function RegisterForm() {
  const params = useSearchParams();
  const pre = params.get("counselor") || "";
  const [names, setNames] = useState(FALLBACK_TRAINEES.map((t) => t.name));
  const [counselor, setCounselor] = useState(NO_PREF);
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const selRef = useRef(null);

  useEffect(() => { loadTrainees().then((list) => list && setNames(list.map((t) => t.name))); }, []);
  // pick the counselor chosen on the Our Team page (once names are known)
  useEffect(() => { if (pre && names.includes(pre)) setCounselor(pre); }, [pre, names]);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    const f = e.currentTarget;
    if (!f.checkValidity()) { setMsg("Please fill in all fields marked *."); f.reportValidity(); return; }
    if (!firebaseReady) { setMsg("Registration is not connected yet. Please try again later."); return; }
    const fd = new FormData(f);
    const data = {
      name: fd.get("name").trim(), phone: fd.get("phone").trim(), email: (fd.get("email") || "").trim(),
      age: Number(fd.get("age")), clientType: fd.get("client_type"), service: fd.get("service"),
      language: fd.get("language"), time: fd.get("time"), preferredCounselor: counselor,
      concern: (fd.get("concern") || "").trim(), consent: fd.get("consent") === "on",
    };
    setSending(true);
    try {
      await saveRegistration(data);
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.warn(err);
      setMsg("Something went wrong. Please try again.");
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="done">
        <Icon name="heart" />
        <h2>Thank you for registering</h2>
        <p>A trainee counselor will reach out to you by phone or WhatsApp to arrange your first session. If you need help urgently, please visit our <Link className="link" href="/crisis">crisis support</Link> page.</p>
        <Link className="link" href="/">Back to home</Link>
      </div>
    );
  }

  const chosen = counselor !== NO_PREF;

  return (
    <form id="signupForm" noValidate onSubmit={onSubmit}>
      <div className="note"><Icon name="heart" box="mi" /><span>Not for emergencies. If you or someone else is at risk right now, please go to our <Link className="link" href="/crisis">crisis support</Link> page.</span></div>

      {chosen && (
        <div className="chosen" id="chosen">
          <Icon name="user" />
          <div><span>Your preferred counselor</span><b id="chosenName">{counselor}</b></div>
          <button type="button" className="link" onClick={() => { selRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); selRef.current?.focus(); }}>Change</button>
        </div>
      )}

      <fieldset>
        <legend>About you</legend>
        <label><span>Full name <em>*</em></span><input name="name" required autoComplete="name" /></label>
        <div className="two">
          <label><span>Phone / WhatsApp <em>*</em></span><input name="phone" type="tel" required autoComplete="tel" placeholder="e.g. 012-345 6789" /></label>
          <label><span>Email</span><input name="email" type="email" autoComplete="email" /></label>
        </div>
        <div className="two">
          <label><span>Age <em>*</em></span><input name="age" type="number" min="1" max="120" required /></label>
          <label><span>I am a <em>*</em></span>
            <select name="client_type" required defaultValue="">
              <option value="">Select…</option><option>UM student</option><option>UM staff</option><option>Member of the public</option>
            </select>
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Service</legend>
        <div className="choices">
          {SERVICES.map((s) => (
            <label className="choice" key={s.name}>
              <input type="radio" name="service" value={s.name} required />
              <Icon name={s.icon} /><span>{s.name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Your preferences</legend>
        <div className="two">
          <label><span>Preferred language</span>
            <select name="language" defaultValue="English"><option>English</option><option>Bahasa Melayu</option><option>Either</option></select>
          </label>
          <label><span>Best time for sessions</span>
            <select name="time" defaultValue="Any time"><option>Any time</option><option>Weekday morning</option><option>Weekday afternoon</option><option>Weekend</option></select>
          </label>
        </div>
        <label><span>Preferred trainee counselor <small>(optional)</small></span>
          <select ref={selRef} name="preferred_counselor" value={counselor} onChange={(e) => setCounselor(e.target.value)}>
            <option value={NO_PREF}>No preference — match me with someone suitable</option>
            {names.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <small className="hint">We&apos;ll do our best to arrange this, depending on availability. <Link className="link" href="/team">Meet Our Team</Link></small>
        </label>
        <label><span>What would you like support with? <small>(optional, a few words are enough)</small></span><textarea name="concern" rows={3} /></label>
      </fieldset>

      <label className="consent"><input type="checkbox" name="consent" required /><span>I understand sessions are run by trainee counselors under clinical supervision, and I agree to be contacted to arrange my first session. <em>*</em></span></label>

      {msg && <p className="form-msg" role="alert">{msg}</p>}
      <button className="cta-btn" type="submit" disabled={sending}>{sending ? "Sending…" : "Register Now"}</button>
    </form>
  );
}
