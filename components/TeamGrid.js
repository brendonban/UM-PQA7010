"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import SafeImage from "./SafeImage";
import { FALLBACK_TRAINEES } from "@/lib/content";
import { loadTrainees } from "@/lib/firebase";

// Trainee cards + profile pop-up. Uses the console's trainee list once the database is connected.
export default function TeamGrid() {
  const [trainees, setTrainees] = useState(FALLBACK_TRAINEES);
  const [open, setOpen] = useState(null);
  const dlg = useRef(null);
  const last = useRef(null);

  useEffect(() => { loadTrainees().then((list) => list && setTrainees(list)); }, []);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (open !== null && !d.open) { d.showModal(); document.body.style.overflow = "hidden"; }
    if (open === null && d.open) d.close();
  }, [open]);

  const show = (i, e) => { last.current = e.currentTarget; setOpen(i); };
  const onClose = () => { document.body.style.overflow = ""; setOpen(null); last.current?.focus(); };
  const t = open !== null ? trainees[open] : null;

  return (
    <>
      <span className="label" style={{ display: "block", margin: "4rem 0 1.4rem" }}>
        Our trainee counselors ({trainees.length})
      </span>
      <div className="team trainees">
        {trainees.map((tr, i) => (
          <button type="button" className="person tcard" key={tr.id || i} aria-haspopup="dialog" onClick={(e) => show(i, e)}>
            <div className="ph"><SafeImage src={tr.photo} /><span className="ph-fb">Photo</span></div>
            <h3>{tr.name}</h3>
            <p>Trainee Counselor</p>
            <p className="interest"><span>Interests</span>{tr.interests}</p>
            <span className="more-link">View profile →</span>
          </button>
        ))}
      </div>

      <dialog className="tmodal" ref={dlg} aria-labelledby="tName" onClose={onClose}
        onClick={(e) => { if (e.target === dlg.current) dlg.current.close(); }}>
        {t && (
          <>
            <button className="tclose" aria-label="Close" onClick={() => dlg.current.close()}><Icon name="x" box="ci" /></button>
            <div className="tm-top">
              <div className="ph tm-photo"><SafeImage src={t.photo} /><span className="ph-fb">Photo</span></div>
              <div>
                <p className="tm-role">Trainee Counselor</p>
                <h2 id="tName">{t.name}</h2>
                <div className="tm-tags">
                  <span><b>Interests</b><i>{t.interests || "—"}</i></span>
                  <span><b>Approach</b><i>{t.approach || "—"}</i></span>
                  <span><b>Languages</b><i>{t.languages || "—"}</i></span>
                </div>
              </div>
            </div>
            {t.bio && <p className="tm-bio">{t.bio}</p>}
            <div className="tm-actions">
              <Link className="cta-btn" href={`/register?counselor=${encodeURIComponent(t.name)}`}>Register with this counselor</Link>
              <div className="contacts">
                {t.whatsapp && <a className="cbtn" href={`https://wa.me/${t.whatsapp}`} target="_blank" rel="noopener noreferrer"><Icon name="wa" box="ci" />WhatsApp</a>}
                {t.telegram && <a className="cbtn" href={`https://t.me/${t.telegram}`} target="_blank" rel="noopener noreferrer"><Icon name="tg" box="ci" />Telegram</a>}
                {t.email && <a className="cbtn" href={`mailto:${t.email}`}><Icon name="mail" box="ci" />Email</a>}
              </div>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
