// All XP UI sounds are routed through this utility.
// To add a sound: drop the .wav into public/sounds/, add an entry to SOUND_MAP,
// and add the key to the SoundName union below.

type SoundName =
  | "restore"
  | "minimize"
  | "menuCommand"
  | "balloon"
  | "ding"
  | "error"
  | "logon"
  | "notify"
  | "startup";

const BASE = import.meta.env.BASE_URL;
const SOUND_MAP: Record<SoundName, string> = {
  restore:     `${BASE}sounds/restore.wav`,
  minimize:    `${BASE}sounds/minimize.wav`,
  menuCommand: `${BASE}sounds/menu-command.wav`,
  balloon:     `${BASE}sounds/balloon.wav`,
  ding:        `${BASE}sounds/ding.wav`,
  error:       `${BASE}sounds/error.wav`,
  logon:       `${BASE}sounds/logon.wav`,
  notify:      `${BASE}sounds/notify.wav`,
  startup:     `${BASE}sounds/startup.wav`,
};

const cache: Partial<Record<SoundName, HTMLAudioElement>> = {};

export function playSound(name: SoundName, volume = 0.4) {
  if (!cache[name]) cache[name] = new Audio(SOUND_MAP[name]);
  const audio = cache[name]!;
  audio.currentTime = 0;
  audio.volume = volume;
  audio.play().catch(() => {});
}
