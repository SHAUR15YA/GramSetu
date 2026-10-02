import React, { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { LanguageCode } from "../types";
import { speakText, stopSpeech } from "../utils/speech";
import { getTranslation } from "../data/translations";

interface AudioReaderButtonProps {
  id?: string;
  textToRead: string;
  lang: LanguageCode;
  className?: string;
  variant?: "pill" | "icon" | "minimal";
  label?: string;
}

export const AudioReaderButton: React.FC<AudioReaderButtonProps> = ({
  id,
  textToRead,
  lang,
  className = "",
  variant = "pill",
  label
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const success = speakText(
        textToRead,
        lang,
        () => setIsPlaying(false),
        () => setIsPlaying(false)
      );
      if (!success) {
        setIsPlaying(false);
      }
    }
  };

  const buttonLabel = isPlaying
    ? getTranslation(lang, "stopListening")
    : label || getTranslation(lang, "listenAloud");

  if (variant === "icon") {
    return (
      <button
        id={id || `audio-read-btn-${Math.random().toString(36).substring(2, 7)}`}
        type="button"
        onClick={handleTogglePlay}
        className={`p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
          isPlaying
            ? "bg-emerald-600 text-white animate-pulse"
            : "bg-stone-100 hover:bg-stone-200 text-stone-700"
        } ${className}`}
        title={buttonLabel}
        aria-label={buttonLabel}
      >
        {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
    );
  }

  return (
    <button
      id={id || `audio-read-btn-${Math.random().toString(36).substring(2, 7)}`}
      type="button"
      onClick={handleTogglePlay}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
        isPlaying
          ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300 animate-pulse"
          : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
      } ${className}`}
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-3.5 h-3.5" />
          <span className="whitespace-nowrap">{buttonLabel}</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-ping" />
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5" />
          <span className="whitespace-nowrap">{buttonLabel}</span>
        </>
      )}
    </button>
  );
};
