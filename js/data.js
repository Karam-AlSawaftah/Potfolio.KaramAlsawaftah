/* ============================================================
   SITE CONTENT — edit this file to update the whole website.
   You should never need to touch index.html or style.css to
   add a project, a skill, or a new category.
   ============================================================ */

const SITE = {
  name: "Karam Alsawaftah",
  role: "XR Developer",
  location: "Dieburg, Germany",
  tagline:
    "Building immersive VR, AR and MR experiences — from shaders and real-time visuals to gameplay and spatial interaction.",
  summary:
    "XR Developer currently pursuing a degree in Augmented and Virtual Reality Design, bringing three years of hands-on experience in developing immersive VR, AR, and MR applications. Passionate about 3D development, spatial computing, and real-time rendering, with a strong drive to learn, adapt, and improve quickly.",
  contact: {
    email: "Karamali3050@gmail.com",
    phone: "+49 157 51752870",
    address: "Altheimer Str. 134205, 64807 Dieburg, Germany",
  },
  // Add or remove social links freely — they render automatically.
  links: [
    { label: "Email", url: "mailto:Karamali3050@gmail.com" },
    { label: "GitHub", url: "https://github.com/KaramAlsawaftah" },
    { label: "itch.io", url: "https://ricci-42.itch.io/beyond-the-bones" },
  ],
};

/* ------------------------------------------------------------
   PROJECT CATEGORIES — order here controls order on the page.
   Add a new category object and give projects its id.
   ------------------------------------------------------------ */
const CATEGORIES = [
  {
    id: "commercial",
    label: "Commercial Projects",
    blurb: "Shipped, client-facing work developed professionally in industry.",
  },
  {
    id: "university",
    label: "University Projects",
    blurb:
      "Projects built during my Expanded Realities studies at Darmstadt University of Applied Sciences.",
  },
  {
    id: "personal",
    label: "Personal Projects",
    blurb: "Prototypes, jams and experiments made to explore new ideas fast.",
  },
];

/* ------------------------------------------------------------
   PROJECTS — copy any object, edit it, done.
   Fields:
     id         unique slug (used for anchors)
     category   one of the CATEGORIES ids above
     badge      short tech tag shown on the card (VR / AR / MR ...)
     role       what YOU did on it
     timeframe  optional string
     image      optional path to a thumbnail; omit for a styled placeholder
     summary    one-paragraph description
     highlights bullet points of your contributions
     tech       list of tools/tech shown as chips
     links      external links (article, store page, company ...)
   ------------------------------------------------------------ */
const PROJECTS = [
  {
    id: "the-blu-expedition-taiwan",
    category: "commercial",
    badge: "Free-Roam VR",
    title: "The Blu: Expedition Taiwan",
    role: "Technical Artist — Go360",
    timeframe: "2025 — 2026",
    summary:
      "A large-scale free-roam VR experience that immerses visitors in Taiwan's underwater world. Guests physically walk through the venue in headsets, exploring coral reefs, shipwrecks and the deep ocean — guided by an AI robot, BT-11, on a mission to protect endangered white dolphins. Co-produced by VIVERSE, Wevr and Taiwan's Ministry of Culture, showing at VIVELAND VR Theme Park in Kaohsiung.",
    highlights: [
      "Designed and implemented shaders and visual systems for real-time applications",
      "Produced and optimized 3D assets, including modeling and rigging",
      "Contributed to a location-based experience featuring blue whales, hammerhead sharks, bioluminescent caves and gesture-based interactions",
    ],
    tech: ["Unity", "Shaders", "3D Modeling", "Rigging", "Free-Roam VR"],
    links: [
      {
        label: "Read the VIVERSE article",
        url: "https://news.viverse.com/post/the-blu-expedition-taiwan-free-roam-vr-experience",
      },
      { label: "Go360 Studio", url: "https://www.go360.cz/" },
    ],
  },
  {
    id: "beyond-the-bones",
    category: "university",
    badge: "VR",
    title: "Beyond the Bones",
    role: "Gameplay Programming · Audio Design · QA",
    timeframe: "Meta Quest 3 / 3S",
    summary:
      "An educational VR experience developed with the Senckenberg Naturmuseum Frankfurt that teaches visitors how paleontologists analyze fossils. Players step into the role of a researcher investigating the Psittacosaurus mongoliensis specimen, using research tools to reconstruct and understand the prehistoric creature.",
    highlights: [
      "Implemented core gameplay systems and interactions in Unity",
      "Designed and integrated the audio for the experience",
      "Ran quality assurance across the project for Quest 3 hardware",
    ],
    tech: ["Unity", "C#", "Meta Quest 3", "Spatial Audio"],
    links: [
      {
        label: "Play on itch.io",
        url: "https://ricci-42.itch.io/beyond-the-bones",
      },
    ],
  },
  {
    id: "spatschlucht-ar",
    category: "university",
    badge: "AR",
    title: "Spatschlucht Geological AR",
    role: "AR Developer",
    summary:
      "A mobile AR application for geological visualization, designed for visitors of the Spatschlucht Greisheim. The app overlays geological data and reconstructions onto the real landscape, turning a walk through the gorge into an interactive lesson in earth history.",
    highlights: [
      "Built a mobile AR app for on-site geological visualization",
      "Designed the experience around real visitor paths through the gorge",
    ],
    tech: ["Unity", "ARCore", "ARKit", "Mobile AR"],
    links: [],
  },
  {
    id: "mr-pong",
    category: "university",
    badge: "MR",
    title: "Mixed Reality Pong",
    role: "MR Developer",
    summary:
      "A mixed reality pong game exploring interactive MR mechanics and spatial gameplay. The classic arcade formula is rebuilt around the player's real room — walls, furniture and physical space become part of the playfield.",
    highlights: [
      "Explored passthrough-based MR mechanics and spatial gameplay",
      "Prototyped interactions that blend virtual play with the physical room",
    ],
    tech: ["Unity", "Mixed Reality", "Passthrough", "OpenXR"],
    links: [],
  },
  {
    id: "vr-roguelike-whack-a-mole",
    category: "personal",
    badge: "VR · Game Jam",
    title: "VR Roguelike Whack-a-Mole",
    role: "Developer — Hackathon Project",
    summary:
      "A VR roguelike 'Whack-a-Mole' style game built during a hackathon, focused on rapid prototyping and fast gameplay iteration. Escalating waves, upgrades and physical swings turn a fairground classic into a frantic roguelike loop.",
    highlights: [
      "Prototyped, built and iterated the full game loop within hackathon time constraints",
      "Focused on physical, embodied interaction and 'one more run' pacing",
    ],
    tech: ["Unity", "C#", "VR", "Rapid Prototyping"],
    links: [],
  },
];

/* ------------------------------------------------------------
   EXPERIENCE
   ------------------------------------------------------------ */
const EXPERIENCE = [
  {
    company: "Go360",
    url: "https://www.go360.cz/",
    role: "Technical Artist",
    period: "February 2025 — Present",
    description:
      "Full-service xR creative studio (Prague / Munich) with 48+ immersive projects for brands like DHL, Deutsche Telekom and Harley-Davidson. Working on 'The Blu: Expedition Taiwan', a free-roam VR experience co-produced by VIVERSE, Wevr and Taiwan's Ministry of Culture.",
    points: [
      "Designed and implemented shaders and visual systems for real-time applications",
      "Produced and optimized 3D assets, including modeling and rigging",
    ],
  },
];

/* ------------------------------------------------------------
   EDUCATION
   ------------------------------------------------------------ */
const EDUCATION = [
  {
    degree: "Bachelor of Arts — Expanded Realities",
    field: "Augmented and Virtual Reality Design",
    school: "Darmstadt University of Applied Sciences (h_da)",
    period: "2023 — 2027",
  },
];

/* ------------------------------------------------------------
   SKILLS — grouped; add groups or items freely.
   ------------------------------------------------------------ */
const SKILLS = [
  {
    group: "Development",
    items: ["Unity 3D development", "C# programming", "WebXR"],
  },
  {
    group: "XR Frameworks",
    items: ["ARKit", "ARCore", "OpenXR"],
  },
  {
    group: "3D & Real-Time",
    items: ["3D modeling", "Spatial audio", "Real-time rendering", "Shaders & VFX"],
  },
  {
    group: "Hardware",
    items: ["Basic Arduino & electronics"],
  },
];

/* ------------------------------------------------------------
   LANGUAGES
   ------------------------------------------------------------ */
const LANGUAGES = [
  { name: "Arabic", level: "Native", detail: "Native Arabic speaker" },
  {
    name: "English",
    level: "Bilingual · C1",
    detail: "IELTS Band 7.5 · CEFR C1",
  },
  { name: "German", level: "B1", detail: "German language level B1" },
];
