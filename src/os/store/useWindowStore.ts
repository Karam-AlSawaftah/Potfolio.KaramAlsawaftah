import { create } from "zustand";
import type { AppId, Position, Size, WindowState } from "../../types/window";
import { windowRegistry } from "../window/windowRegistry";
import { getProjectById } from "../../apps/projects/projectsData";

interface WindowStore {
  windows: WindowState[];
  nextZIndex: number;
  activeWindowId: string | null;
  openWindow: (appId: AppId, props?: Record<string, unknown>) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  updatePosition: (id: string, position: Position) => void;
  updateSize: (id: string, size: Size) => void;
}

let instanceCounter = 0;

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  nextZIndex: 1,
  activeWindowId: null,

  openWindow: (appId, props) => {
    const { windows } = get();
    const nextZIndex = Math.min(get().nextZIndex, 3999);

    // Singleton apps (home, projects, about, contact) just get focused if open
    if (appId !== "project-detail") {
      const existing = windows.find((w) => w.appId === appId);
      if (existing) {
        set({
          windows: windows.map((w) =>
            w.id === existing.id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w
          ),
          nextZIndex: nextZIndex + 1,
          activeWindowId: existing.id,
        });
        return;
      }
    }

    const entry = windowRegistry[appId];
    instanceCounter += 1;
    const id = `${appId}-${instanceCounter}`;

    // Stagger window positions a bit so multiple windows don't perfectly overlap
    const offset = (windows.length % 6) * 28;

    let title = entry.title;
    if (appId === "project-detail" && props?.projectId) {
      const project = getProjectById(props.projectId as string);
      if (project) title = project.title.toUpperCase();
    }

    const newWindow: WindowState = {
      id,
      appId,
      title,
      icon: entry.icon,
      position: {
        x: entry.defaultPosition.x + offset,
        y: entry.defaultPosition.y + offset,
      },
      size: entry.defaultSize,
      zIndex: nextZIndex,
      isMinimized: false,
      isMaximized: false,
      props,
    };

    set({
      windows: [...windows, newWindow],
      nextZIndex: nextZIndex + 1,
      activeWindowId: id,
    });
  },

  closeWindow: (id) => {
    const { windows, activeWindowId } = get();
    const remaining = windows.filter((w) => w.id !== id);
    set({
      windows: remaining,
      activeWindowId: activeWindowId === id ? null : activeWindowId,
    });
  },

  focusWindow: (id) => {
    const { windows } = get();
    const nextZIndex = Math.min(get().nextZIndex, 3999);
    set({
      windows: windows.map((w) => (w.id === id ? { ...w, zIndex: nextZIndex, isMinimized: false } : w)),
      nextZIndex: nextZIndex + 1,
      activeWindowId: id,
    });
  },

  minimizeWindow: (id) => {
    const { windows, activeWindowId } = get();
    set({
      windows: windows.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)),
      activeWindowId: activeWindowId === id ? null : activeWindowId,
    });
  },

  toggleMaximize: (id) => {
    const { windows } = get();
    set({
      windows: windows.map((w) => {
        if (w.id !== id) return w;
        if (w.isMaximized) {
          return {
            ...w,
            isMaximized: false,
            position: w.prevPosition ?? w.position,
            size: w.prevSize ?? w.size,
          };
        }
        return {
          ...w,
          isMaximized: true,
          prevPosition: w.position,
          prevSize: w.size,
        };
      }),
    });
  },

  updatePosition: (id, position) => {
    set({
      windows: get().windows.map((w) => (w.id === id ? { ...w, position } : w)),
    });
  },

  updateSize: (id, size) => {
    set({
      windows: get().windows.map((w) => (w.id === id ? { ...w, size } : w)),
    });
  },
}));
