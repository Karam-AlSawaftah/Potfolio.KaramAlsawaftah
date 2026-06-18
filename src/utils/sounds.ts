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

const SOUND_MAP: Record<SoundName, string> = {
  restore:     "/sounds/restore.wav",
  minimize:    "/sounds/minimize.wav",
  menuCommand: "/sounds/menu-command.wav",
  balloon:     "/sounds/balloon.wav",
  ding:        "/sounds/ding.wav",
  error:       "/sounds/error.wav",
  logon:       "/sounds/logon.wav",
  notify:      "/sounds/notify.wav",
  startup:     "/sounds/startup.wav",
};

const cache: Partial<Record<SoundName, HTMLAudioElement>> = {};

export function playSound(name: SoundName, volume = 0.4) {
  if (!cache[name]) cache[name] = new Audio(SOUND_MAP[name]);
  const audio = cache[name]!;
  audio.currentTime = 0;
  audio.volume = volume;
  audio.play().catch(() => {});
}
