import { useEffect, useMemo, useRef, useState } from "react";
import { Mic, MicOff, PencilLine, Save, Volume2 } from "lucide-react";

type VoiceComponentProps = {
  isUrdu: boolean;
  active?: boolean;
};

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0?: { transcript?: string };
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionErrorEventLike = {
  error: string;
};

type SpeechRecognitionInstance = {
  start: () => void;
  stop: () => void;
  abort: () => void;
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
};

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
    SpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

const VoiceComponent = ({ isUrdu, active = true }: VoiceComponentProps) => {
  const [voiceText, setVoiceText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [instructions, setInstructions] = useState<string[]>([]);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const finalTranscriptRef = useRef("");

  const recognitionCtor = useMemo(() => window.SpeechRecognition || window.webkitSpeechRecognition, []);

  useEffect(() => {
    setIsSupported(Boolean(recognitionCtor));
  }, [recognitionCtor]);

  useEffect(() => {
    if (!active) {
      recognitionRef.current?.stop();
    }
  }, [active]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

  const stopListening = (save = true) => {
    recognitionRef.current?.stop();
    setIsListening(false);

    if (save && voiceText.trim()) {
      setInstructions((prev) => [...prev, voiceText.trim()]);
      setVoiceText("");
      finalTranscriptRef.current = "";
    }
  };

  const startListening = () => {
    if (!isSupported || !recognitionCtor) {
      setStatusMessage(
        isUrdu
          ? "آپ کے browser میں speech recognition support نہیں ہے۔ Chrome یا Edge استعمال کریں۔"
          : "Speech recognition is not supported in this browser. Try Chrome or Edge."
      );
      return;
    }

    try {
      const recognition = new recognitionCtor();
      recognition.lang = isUrdu ? "ur-PK" : "en-US";
      recognition.interimResults = true;
      recognition.continuous = true;

      finalTranscriptRef.current = "";
      setVoiceText("");
      setStatusMessage(isUrdu ? "بولنا شروع کریں..." : "Start speaking...");

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let interimTranscript = "";
        let finalTranscript = finalTranscriptRef.current;

        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const result = event.results[i];
          const transcript = result[0]?.transcript?.trim() || "";

          if (result.isFinal) {
            finalTranscript = `${finalTranscript} ${transcript}`.trim();
          } else {
            interimTranscript = `${interimTranscript} ${transcript}`.trim();
          }
        }

        finalTranscriptRef.current = finalTranscript;
        setVoiceText([finalTranscript, interimTranscript].filter(Boolean).join(" ").trim());
      };

      recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
        setStatusMessage(
          isUrdu
            ? `Speech recognition error: ${event.error}`
            : `Speech recognition error: ${event.error}`
        );
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      setIsListening(true);
      recognition.start();
    } catch (error) {
      setStatusMessage(
        isUrdu
          ? `Recording شروع نہیں ہو سکی: ${String(error)}`
          : `Recording could not start: ${String(error)}`
      );
      setIsListening(false);
    }
  };

  const saveTypedInstruction = () => {
    if (!voiceText.trim()) return;
    setInstructions((prev) => [...prev, voiceText.trim()]);
    setVoiceText("");
    finalTranscriptRef.current = "";
  };

  return (
    <div className={`rounded-[20px] border border-slate-200 bg-white p-3 ${isUrdu ? "rtl" : "ltr"}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-green-700" />
            <div className="text-[13px] font-black text-slate-950">
              {isUrdu ? "ریکارڈ / ٹائپ ہدایات" : "Record / Type Instructions"}
            </div>
          </div>
          <div className="mt-1 text-[10px] font-semibold text-slate-500">
            {isUrdu ? "آپ بول بھی سکتے ہیں یا ٹائپ بھی کر سکتے ہیں" : "You can speak or type instructions here"}
          </div>
        </div>
        <div className={`rounded-full px-3 py-1 text-[10px] font-black ${isListening ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-600"}`}>
          {isListening ? (isUrdu ? "ریکارڈنگ" : "Listening") : (isUrdu ? "تیار" : "Ready")}
        </div>
      </div>

      {!isSupported && (
        <div className="mb-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-900">
          {isUrdu
            ? "آپ کے browser میں speech recognition support نہیں ہے۔ Chrome/Edge استعمال کریں۔"
            : "Your browser does not support speech recognition. Try Chrome or Edge."}
        </div>
      )}

      {statusMessage && (
        <div className="mb-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-700">
          {statusMessage}
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <label className="block">
          <div className="mb-1.5 text-[10px] font-black uppercase tracking-wide text-slate-500">
            {isUrdu ? "ہدایات" : "Instructions"}
          </div>
          <textarea
            value={voiceText}
            onChange={(e) => {
              setVoiceText(e.target.value);
              finalTranscriptRef.current = e.target.value;
            }}
            placeholder={isUrdu ? "یہاں ہدایات لکھیں یا بولیں..." : "Type or speak your instructions..."}
            className="min-h-[96px] w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium outline-none focus:border-green-400"
          />
        </label>

        <div className="flex gap-2 md:flex-col">
          <button
            type="button"
            onClick={isListening ? () => stopListening(true) : startListening}
            disabled={!isSupported}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50 ${
              isListening ? "bg-red-600" : "bg-slate-900"
            }`}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isListening ? (isUrdu ? "روکیں" : "Stop") : (isUrdu ? "بولیں" : "Speak")}
          </button>

          <button
            type="button"
            onClick={saveTypedInstruction}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-black text-green-800 shadow-sm"
          >
            <Save className="h-4 w-4" />
            {isUrdu ? "محفوظ کریں" : "Save"}
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] font-semibold text-slate-500">
        <span>{isUrdu ? "براہ راست speech-to-text" : "Browser speech-to-text"}</span>
        <span>{isUrdu ? "محفوظ شدہ ہدایات نیچے دکھائی جائیں گی" : "Saved instructions appear below"}</span>
      </div>

      {instructions.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-slate-500">
            <PencilLine className="h-4 w-4" />
            {isUrdu ? "ریکارڈ شدہ ہدایات" : "Recorded Instructions"}
          </div>
          <div className="grid gap-2">
            {instructions.map((instruction, index) => (
              <div key={`${instruction}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-700">
                {instruction}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceComponent;
