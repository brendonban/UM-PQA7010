import Link from "next/link";
import Icon from "./Icon";
import { HOURS, ADDRESS } from "@/lib/content";

// The light "Get started" band with the Register Now button.
export default function GetStarted({ home = false }) {
  return (
    <section className="band">
      <div className="wrap">
        <div>
          <span className="label">Get started</span>
          {home ? (
            <>
              <h2>Register for a free session</h2>
              <ul className="meta">
                <li><Icon name="clock" box="mi" />{HOURS}</li>
                <li><Icon name="pin" box="mi" />{ADDRESS}</li>
              </ul>
            </>
          ) : (
            <>
              <h2>Ready to talk? We&apos;re here to listen.</h2>
              <p style={{ margin: 0, maxWidth: "34em" }}>
                Sessions are free and open to UM students, staff and the public. Register online and a trainee counselor will reach out to arrange your first session.
              </p>
            </>
          )}
        </div>
        <div className="actions">
          <Link className="cta-btn" href="/register">Register Now</Link>
          {home && <Link className="link" href="/faq">Have questions? Read the FAQ</Link>}
        </div>
      </div>
    </section>
  );
}
