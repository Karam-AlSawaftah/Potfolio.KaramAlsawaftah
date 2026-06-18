import { bio, vision, education, skills } from "./aboutData";
import "./about.css";

export default function AboutApp() {
  return (
    <div className="notepad-app">
      <div className="notepad-app__body">
        <pre className="notepad-app__text">{
`ABOUT.TXT
=========================================

${bio.join("\n\n")}


=== STUDIO VISION ===

${vision}


=== EDUCATION ===

${education.map((edu) => `${edu.title}\n${edu.place}  //  ${edu.period}`).join("\n\n")}


=== SKILLS ===

${skills.map((g) => `${g.label}:\n  ${g.items.join(", ")}`).join("\n\n")}


=========================================
EOF`
        }</pre>
      </div>
    </div>
  );
}
