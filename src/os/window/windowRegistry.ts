// ─── Window Registry ────────────────────────────────────────────────────────
// Single source of truth for every app window in the OS.
//
// To add a new app:
//   1. Add its AppId to src/types/window.ts
//   2. Create the component in src/apps/<name>/
//   3. Add an entry here — desktop/startMenu metadata auto-wires it everywhere.
//
// Desktop icons and Start Menu lists are DERIVED from this file at runtime.
// You do NOT need to edit Desktop.tsx or StartMenu.tsx.
// ─────────────────────────────────────────────────────────────────────────────

import type { AppId, WindowRegistryEntry } from "../../types/window";
import HomeApp from "../../apps/home/HomeApp";
import ProjectsApp from "../../apps/projects/ProjectsApp";
import ProjectDetail from "../../apps/projects/ProjectDetail";
import AboutApp from "../../apps/about/AboutApp";
import ContactApp from "../../apps/contact/ContactApp";
import MyComputerApp from "../../apps/system/MyComputerApp";
import RecycleBinApp from "../../apps/system/RecycleBinApp";
import WinampApp from "../../apps/winamp/WinampApp";

const B = import.meta.env.BASE_URL;

export const windowRegistry: Record<AppId, WindowRegistryEntry> = {
  home: {
    title: "WELCOME.SYS",
    icon: `${B}icons/icon-home.svg`,
    winIcon: { row: 21, col: 0 },
    defaultSize: { width: 460, height: 460 },
    defaultPosition: { x: 160, y: 60 },
    component: HomeApp,
    desktop: { label: "Welcome" },
    startMenu: { left: "Welcome" },
  },
  projects: {
    title: "PROJECTS",
    icon: `${B}icons/icon-projects.svg`,
    winIcon: { row: 20, col: 0 },
    defaultSize: { width: 500, height: 380 },
    defaultPosition: { x: 260, y: 110 },
    component: ProjectsApp,
    desktop: { label: "Projects" },
    startMenu: { left: "Projects", right: { label: "My Projects", emoji: "📁" } },
  },
  about: {
    title: "ABOUT.TXT - Notepad",
    icon: `${B}icons/icon-about.svg`,
    winIcon: { row: 13, col: 0 },
    defaultSize: { width: 460, height: 460 },
    defaultPosition: { x: 300, y: 90 },
    component: AboutApp,
    desktop: { label: "About Me" },
    startMenu: { left: "About Me", right: { label: "About Me", emoji: "👤" } },
  },
  contact: {
    title: "CONTACT.LNK",
    icon: `${B}icons/icon-contact.svg`,
    winIcon: { row: 19, col: 0 },
    defaultSize: { width: 380, height: 360 },
    defaultPosition: { x: 340, y: 140 },
    component: ContactApp,
    desktop: { label: "Contact" },
    startMenu: { left: "Contact", right: { label: "Contact", emoji: "✉" } },
  },
  "project-detail": {
    // Opened programmatically by ProjectsApp — no desktop icon or Start Menu entry.
    title: "PROJECT",
    icon: `${B}icons/icon-project-detail.svg`,
    winIcon: { row: 0, col: 5 },
    defaultSize: { width: 460, height: 520 },
    defaultPosition: { x: 220, y: 70 },
    component: ProjectDetail,
  },
  "my-computer": {
    title: "My Computer",
    icon: "",
    winIcon: { row: 2, col: 0 },
    defaultSize: { width: 380, height: 340 },
    defaultPosition: { x: 200, y: 120 },
    component: MyComputerApp,
    desktop: { label: "My Computer" },
    startMenu: { right: { label: "My Computer", emoji: "🖥" } },
  },
  "recycle-bin": {
    title: "Recycle Bin",
    icon: "",
    winIcon: { row: 3, col: 0 },
    defaultSize: { width: 300, height: 220 },
    defaultPosition: { x: 240, y: 160 },
    component: RecycleBinApp,
    desktop: { label: "Recycle Bin" },
    // No Start Menu entry — Recycle Bin doesn't appear in Start Menu on real XP either.
  },
  winamp: {
    title: "BUTTERCHURN.VIZ",
    icon: `${B}icons/icon-home.svg`,
    winIcon: { row: 7, col: 4 },
    defaultSize: { width: 560, height: 480 },
    defaultPosition: { x: 120, y: 60 },
    component: WinampApp,
    desktop: { label: "Butterchurn" },
    startMenu: { left: "Butterchurn", right: { label: "Visualizer", emoji: "🎵" } },
  },
};
