import { LanguageCode } from "../types";

export interface SpeechState {
  isPlaying: boolean;
  activeText: string | null;
}

// Clean markdown syntax for clean natural spoken audio
export function cleanMarkdownForSpeech(text: string): string {
  return text
    .replace(/[#*_`~>-]/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

const LANG_CODE_MAP: Record<LanguageCode, string> = {
  en: "en-US",
  hi: "hi-IN",
  es: "es-ES",
  sw: "sw-TZ",
  bn: "bn-IN",
  te: "te-IN",
  fr: "fr-FR",
  pt: "pt-BR",
};

export function speakText(
  text: string,
  lang: LanguageCode,
  onEnd?: () => void,
  onError?: () => void
): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return false;
  }

  window.speechSynthesis.cancel();

  const clean = cleanMarkdownForSpeech(text);
  if (!clean) return false;

  const utterance = new SpeechSynthesisUtterance(clean);
  const targetCode = LANG_CODE_MAP[lang] || "en-US";
  utterance.lang = targetCode;
  utterance.rate = 0.92; // slightly slower for high clarity in rural announcements
  utterance.pitch = 1.0;

  // Find best matching voice if available
  const voices = window.speechSynthesis.getVoices();
  const match = voices.find((v) => v.lang.startsWith(targetCode.slice(0, 2)));
  if (match) {
    utterance.voice = match;
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    if (onError) onError();
  };

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeech(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
