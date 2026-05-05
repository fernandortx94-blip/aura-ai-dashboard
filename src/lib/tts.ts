// Text-to-Speech via Web Speech API (no external service).

export type VoiceSettings = {
  voiceURI: string | null;
  rate: number; // 0.1 - 10
  pitch: number; // 0 - 2
  enabled: boolean;
};

const STORAGE_KEY = "ferbot.voice.settings";

const DEFAULTS: VoiceSettings = {
  voiceURI: null,
  rate: 1,
  pitch: 1,
  enabled: true,
};

export function getVoiceSettings(): VoiceSettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

export function setVoiceSettings(patch: Partial<VoiceSettings>) {
  const next = { ...getVoiceSettings(), ...patch };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("ferbot:voice-settings", { detail: next }));
  return next;
}

export function getVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
  return window.speechSynthesis.getVoices();
}

export function onVoicesChanged(cb: () => void): () => void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return () => {};
  const handler = () => cb();
  window.speechSynthesis.addEventListener("voiceschanged", handler);
  return () => window.speechSynthesis.removeEventListener("voiceschanged", handler);
}

export function stopSpeaking() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
}

function pickVoice(uri: string | null): SpeechSynthesisVoice | null {
  const voices = getVoices();
  if (!voices.length) return null;
  if (uri) {
    const found = voices.find((v) => v.voiceURI === uri);
    if (found) return found;
  }
  const es = voices.find((v) => v.lang?.toLowerCase().startsWith("es"));
  return es || voices[0];
}

export function speak(text: string): void {
  const clean = text?.trim();
  if (!clean) return;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const settings = getVoiceSettings();
  if (!settings.enabled) return;
  stopSpeaking();
  const utter = new SpeechSynthesisUtterance(clean);
  const voice = pickVoice(settings.voiceURI);
  if (voice) {
    utter.voice = voice;
    utter.lang = voice.lang;
  }
  utter.rate = settings.rate;
  utter.pitch = settings.pitch;
  window.speechSynthesis.speak(utter);
}