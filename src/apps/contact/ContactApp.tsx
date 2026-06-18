import { contactLinks } from "./contactData";
import "./contact.css";

export default function ContactApp() {
  return (
    <div className="contact-app">
      <h1>CONTACT.LNK</h1>
      <p className="contact-app__intro">
        Open to collaborations, freelance work, and conversations about games, VR, and everything
        between. Reach out through any of these channels.
      </p>
      <div className="contact-app__list">
        {contactLinks.map((link) => (
          <a
            key={link.label}
            className="contact-app__link"
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
          >
            <img src={link.icon} alt="" />
            <span>
              <span className="contact-app__link-label">{link.label}</span>
              <span className="contact-app__link-value">{link.value}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
