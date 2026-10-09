import Link from "next/link";
import Icon from "@/components/Icon";
import SafeImage from "@/components/SafeImage";
import TypingHeadline from "@/components/TypingHeadline";
import GetStarted from "@/components/GetStarted";

const FACTS = [
  { icon: "heart", title: "Free", text: "No cost for any session" },
  { icon: "lock", title: "Confidential", text: "What you share stays private" },
  { icon: "globe", title: "Open to everyone", text: "UM students, staff and the public" },
  { icon: "chat", title: "Face to face", text: "At our Counseling Lab" },
];

// Photos live in public/assets/ (see README.txt there). Until added, a soft panel with an icon shows.
const CARDS = [
  { href: "/team", img: "/assets/home-team.jpg", icon: "users", title: "Our Team", text: "Meet our trainee counselors, here to support your mental health journey." },
  { href: "/services", img: "/assets/home-services.jpg", icon: "chat", title: "Our Services", text: "Individual, group and family counseling / therapy, and psychological assessment." },
  { href: "/team#supervisor", img: "/assets/home-supervisor.jpg", icon: "clipboard", title: "Our Supervisor", text: "Our trainees are guided by a registered and qualified clinical supervisor." },
  { href: "/faq", img: "/assets/home-faq.jpg", icon: "heart", title: "Frequently Asked Questions", text: "Cost, confidentiality, and what to expect at your first session." },
];

const STEPS = [
  { icon: "clipboard", title: "Register online", text: "Fill in a short form. It takes about 2 minutes." },
  { icon: "chat", title: "We reach out to you", text: "A trainee counselor contacts you to arrange a time that suits you." },
  { icon: "pin", title: "Meet at the Counseling Lab", text: "Level 03, Menara Pendidikan, UM. Sessions are around 45–60 minutes." },
];

export default function Home() {
  return (
    <>
      <div className="hero" id="top">
        <div className="wrap">
          <div className="rule" />
          <TypingHeadline text="Normalising mental health in the Klang Valley." />
          <p>
            We are part of the Department of Educational Psychology and Counseling within the Faculty of Education,
            committed to creating communities that thrive through accessible mental health services.
          </p>
          <div className="row">
            <Link className="cta-btn" href="/register">Register Now</Link>
            <a className="link" href="#how">How it works</a>
          </div>
        </div>
      </div>

      <div className="wrap">
        <ul className="facts">
          {FACTS.map((f) => (
            <li key={f.title}><Icon name={f.icon} /><b>{f.title}</b><span>{f.text}</span></li>
          ))}
        </ul>
      </div>

      <section className="explore">
        <div className="wrap">
          <div className="pcards">
            {CARDS.map((c) => (
              <PhotoCard key={c.title} {...c} />
            ))}
          </div>
        </div>
      </section>

      <section id="how">
        <div className="wrap">
          <div className="sec-head">
            <div><span className="label">How it works</span><h2>3 simple steps</h2></div>
            <p>No referral needed. Anyone can register.</p>
          </div>
          <div className="steps steps3">
            {STEPS.map((s, i) => (
              <div className="step" key={s.title}>
                <Icon name={s.icon} />
                <span className="label">Step {i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GetStarted home />
    </>
  );
}

function PhotoCard({ href, img, icon, title, text }) {
  return (
    <Link className="pcard" href={href}>
      <div className="pimg">
        <SafeImage src={img} />
        <Icon name={icon} box="pfb" />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </Link>
  );
}
