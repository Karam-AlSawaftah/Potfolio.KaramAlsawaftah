// ── window.ts ──────────────────────────────────────────────────────────────
// Types for the OS window manager (not portfolio content types).
// When adding a new app, add its id to AppId here, then add a full entry
// to windowRegistry.ts — that's the only two files you need to touch.
// ───────────────────────────────────────────────────────────────────────────

export type AppId = "home" | "projects" | "about" | "contact" | "project-detail" | "my-computer" | "recycle-bin" | "winamp";

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  icon?: string;
  position: Position;
  size: Size;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  prevPosition?: Position;
  prevSize?: Size;
  props?: Record<string, unknown>;
}

export interface WinIconCoord {
  row: number;
  col: number;
}

export interface WindowRegistryEntry {
  title: string;
  icon: string;
  winIcon?: WinIconCoord;
  defaultSize: Size;
  defaultPosition: Position;
  component: React.ComponentType<{ windowId: string; props?: Record<string, unknown> }>;
  // When present, this app gets a desktop icon and/or a Start Menu entry.
  // This makes windowRegistry the single source of truth — Desktop and StartMenu
  // derive their lists from here, so you only edit one file when adding an app.
  desktop?: { label: string };
  startMenu?: {
    left?: string;                              // label in left (white) pane
    right?: { label: string; emoji: string };  // entry in right (blue) pane
  };
}
