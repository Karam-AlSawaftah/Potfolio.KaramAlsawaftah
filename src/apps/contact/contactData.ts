import type { ContactLink } from "../../types/content";

export const contactLinks: ContactLink[] = [
  {
    label: "Email",
    value: "you@example.com",
    href: "mailto:you@example.com",
    icon: "/icons/contact-mail.svg",
  },
  {
    label: "GitHub",
    value: "github.com/yourname",
    href: "https://github.com/yourname",
    icon: "/icons/contact-github.svg",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/yourname",
    href: "https://linkedin.com/in/yourname",
    icon: "/icons/contact-linkedin.svg",
  },
  {
    label: "ArtStation / Itch.io",
    value: "yourname.itch.io",
    href: "https://yourname.itch.io",
    icon: "/icons/contact-itch.svg",
  },
];
