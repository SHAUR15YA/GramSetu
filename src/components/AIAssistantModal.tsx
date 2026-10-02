import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  RotateCcw,
  Volume2,
  VolumeX,
  Sprout,
  HeartPulse,
  GraduationCap,
  Landmark,
  CloudSun
} from "lucide-react";
import Markdown from "react-markdown";
import { LanguageCode, ChatMessage, ActiveDomain } from "../types";
import { getTranslation } from "../data/translations";
import { AudioReaderButton } from "./AudioReaderButton";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: LanguageCode;
  initialPrompt?: string;
  initialDomain?: ActiveDomain;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  initialPrompt,
  initialDomain = "overview",
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<ActiveDomain>(initialDomain);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize initial greeting when modal opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greetingText =
        currentLang === "hi"
          ? "नमस्ते! मैं आपका ग्राम मित्र एआई सहायक हूँ। आप मुझसे फसलों की बीमारी, मंडी भाव, प्राथमिक उपचार, स्कूल के पाठ, सरकारी योजनाओं या पर्यावरण की स्थिति के बारे में पूछ सकते हैं।"
          : currentLang === "es"
          ? "¡Hola! Soy tu Asistente Rural Comunitario con IA. ¿En qué puedo ayudarte hoy respecto a agricultura, salud, educación, trámites públicos o medio ambiente?"
          : currentLang === "sw"
          ? "Habari! Mimi ni Msaidizi wako wa Kijiji wa AI. Unaweza kuniuliza kuhusu magonjwa ya mazao, afya, masomo, ruzuku za serikali au mazingira."
          : "Hello! I am GramMitra, your Rural Community AI Assistant. Ask me anything about crop diseases, health triage, school lessons, welfare schemes, or environmental monitoring in your preferred language!";

      setMessages([
        {
          id: "msg-0",
          role: "assistant",
          content: greetingText,
          timestamp: "Just now",
          domain: "overview",
        },
      ]);
    }
  }, [isOpen, currentLang]);

  // Handle initialPrompt if provided
  useEffect(() => {
    if (initialPrompt && isOpen) {
      setInputText(initialPrompt);
      if (initialDomain) setSelectedDomain(initialDomain);
    }
  }, [initialPrompt, initialDomain, isOpen]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Quick suggestions based on selected domain
  const suggestions: Record<ActiveDomain, string[]> = {
    overview: [
      "I am a farmer with an annual income below ₹2 lakh. Tell me which government schemes I may be eligible for and how to apply.",
      "Suggest free courses and a roadmap to become a software engineer.",
      "How to treat heatstroke in village fields?",
      "How to set up safe UPI mobile banking?"
    ],
    agriculture: [
      "I am a farmer with an annual income below ₹2 lakh. Tell me which government schemes I may be eligible for and how to apply.",
      "My tomato leaves have concentric brown spots, what should I spray?",
      "How much neem oil to mix in 1 liter water for aphids?",
      "What is the basal fertilizer dose for wheat sowing?"
    ],
    healthcare: [
      "What should I do immediately for a scorpion sting?",
      "How to prepare safe ORS solution for child diarrhea?",
      "What are the danger signs of severe dehydration?",
      "When is the next immunization camp at the Anganwadi?"
    ],
    education: [
      "Suggest free courses and a roadmap to become a software engineer.",
      "Explain how a solar inverter works using water pipe analogies",
      "How do check-dams recharge deep borewell aquifers?",
      "Teach me basic arithmetic for calculating fertilizer costs"
    ],
    government: [
      "I am a farmer with an annual income below ₹2 lakh. Tell me which government schemes I may be eligible for and how to apply.",
      "How can a farmer with 1.5 acres apply for PM-KISAN?",
      "What documents are needed for PM Awas rural housing grant?",
      "How to get 60% subsidy for solar water pump (KUSUM)?"
    ],
    environment: [
      "Our village borewell is at 46m depth, what irrigation schedule is best?",
      "How to build low-cost rainwater recharge pits around farm wells?",
      "What should we do to protect cattle during 42°C heatwaves?",
      "How to start organic mulching to lock soil moisture?"
    ]
  };

  // Speech Recognition (Voice Input)
  const toggleVoiceInput = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please type your query.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;

      const langMap: Record<LanguageCode, string> = {
        en: "en-US",
        hi: "hi-IN",
        es: "es-ES",
        sw: "sw-TZ",
        bn: "bn-IN",
        te: "te-IN",
        fr: "fr-FR",
        pt: "pt-BR",
      };
      recognition.lang = langMap[currentLang] || "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
        }
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: "Just now",
      domain: selectedDomain,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          category: selectedDomain,
          language: currentLang,
          history: historyPayload.slice(-6),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get answer");
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: "assistant",
        content: data.reply,
        timestamp: "Just now",
        domain: selectedDomain,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content:
          "I experienced a network delay. For urgent medical cases please dial 108 or your local ASHA worker; for crop distress consult the Kisan Call Centre at 1800-180-1551.",
        timestamp: "Just now",
        domain: selectedDomain,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="ai-assistant-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4"
    >
      <div
        id="ai-assistant-modal-panel"
        className="bg-stone-900 text-stone-100 rounded-2xl sm:rounded-3xl max-w-3xl w-full h-[90vh] max-h-[750px] flex flex-col border border-stone-700 shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="bg-stone-950 p-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white font-['Outfit']">
                  GramMitra AI Copilot
                </h3>
                <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Multilingual 5-in-1
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Voice & Text rural assistance powered by Gemini 3.8
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMessages([])}
              className="text-xs text-stone-400 hover:text-stone-200 px-2 py-1 rounded hover:bg-stone-800 transition-colors flex items-center gap-1"
              title="Reset Chat"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="bg-stone-900/90 px-4 py-2 border-b border-stone-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[11px] text-stone-400 font-medium mr-1">Focus:</span>
          {[
            { id: "overview", label: "All Topics" },
            { id: "agriculture", label: "🌾 Agriculture" },
            { id: "healthcare", label: "🏥 Healthcare" },
            { id: "education", label: "📚 Education" },
            { id: "government", label: "🏛️ Govt Schemes" },
            { id: "environment", label: "🌍 Environment" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedDomain(tab.id as ActiveDomain)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                selectedDomain === tab.id
                  ? "bg-emerald-600 text-white font-semibold"
                  : "bg-stone-800 text-stone-300 hover:bg-stone-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Chat Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#141312]">
          {messages.map((msg) => {
            const isAsst = msg.role === "assistant";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] sm:max-w-[80%] ${
                  isAsst ? "self-start" : "ml-auto flex-row-reverse"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isAsst
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-stone-700 text-stone-200"
                  }`}
                >
                  {isAsst ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isAsst
                      ? "bg-stone-900 border border-stone-800 text-stone-100 shadow-xs"
                      : "bg-emerald-700 text-white"
                  }`}
                >
                  {isAsst && (
                    <div className="flex items-center justify-between border-b border-stone-800 pb-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        GramMitra Advisory
                      </span>
                      <AudioReaderButton
                        textToRead={msg.content}
                        lang={currentLang}
                        variant="minimal"
                      />
                    </div>
                  )}

                  <div className="prose prose-invert prose-sm max-w-none">
                    <div className="markdown-body">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 self-start max-w-[80%]">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0">
                <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
              </div>
              <div className="p-3 rounded-2xl bg-stone-900 border border-stone-800 text-xs text-stone-400 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Consulting rural knowledge base with AI...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="bg-stone-950 px-4 py-2 border-t border-stone-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] text-stone-500 uppercase tracking-wider font-bold shrink-0">
            Suggested:
          </span>
          {suggestions[selectedDomain].map((sug, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(sug)}
              className="text-[11px] bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white px-2.5 py-1 rounded-full border border-stone-700 whitespace-nowrap transition-colors"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <div className="p-3 sm:p-4 bg-stone-950 border-t border-stone-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Input Button */}
            <button
              id="voice-input-btn"
              type="button"
              onClick={toggleVoiceInput}
              className={`p-2.5 rounded-xl border transition-colors ${
                isListening
                  ? "bg-red-600 text-white border-red-500 animate-pulse"
                  : "bg-stone-800 text-stone-300 hover:text-white border-stone-700 hover:bg-stone-700"
              }`}
              title={isListening ? "Listening... click to stop" : "Speak into microphone"}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-400" />}
            </button>

            <input
              id="ai-chat-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about farming, health, welfare, or weather..."
              className="flex-1 bg-stone-900 text-stone-100 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <button
              id="ai-chat-send-btn"
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-800 disabled:text-stone-600 text-white p-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
