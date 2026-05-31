import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, PencilLine, Save, Volume2 } from "lucide-react";
import * as Vosk from "vosk-browser";

type VoiceComponentProps = {
  isUrdu: boolean;
  modelUrl?: string;
  active?: boolean;
};

const DEFAULT_MODEL_URL = "/models/vosk-model-small-en-us-0.15.tar.gz";

const VoiceComponent = ({ isUrdu, modelUrl = DEFAULT_MODEL_URL, active = true }: VoiceComponentProps) => {
  const [voiceText, setVoiceText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [instructions, setInstructions] = useState<string[]>([]);
  const [modelReady, setModelReady] = useState(false);
  const [modelMissing, setModelMissing] = useState(false);

  const modelRef = useRef<any>(null);
  const recognizerRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const finalTranscriptRef = useRef("");

  useEffect(() => {
    setIsSupported(Boolean(navigator.mediaDevices?.getUserMedia));

    let cancelled = false;

    const loadModel = async () => {
      try {
        setStatusMessage(
          isUrdu
            ? "Vosk model لوڈ ہو رہا ہے..."
            : "Loading offline Vosk model..."
        );

        const probe = await fetch(modelUrl, { method: "HEAD" });
        if (!probe.ok) {
          throw new Error(`Model file not found at ${modelUrl} (${probe.status})`);
        }

        const model = await Vosk.createModel(modelUrl);
        if (cancelled) return;
        modelRef.current = model;
        setModelReady(true);
        setModelMissing(false);
        setStatusMessage(
          isUrdu
            ? "Offline speech model ready"
            : "Offline speech model ready"
        );
      } catch (error) {
        if (cancelled) return;
        setModelReady(false);
        setModelMissing(true);
        setStatusMessage(
          isUrdu
            ? `Model load نہیں ہو سکا: ${String(error)}`
            : `Model could not load: ${String(error)}`
        );
      }
    };

    loadModel();

    return () => {
      cancelled = true;
      recognizerRef.current?.free?.();
      modelRef.current?.terminate?.();
      processorRef.current?.disconnect?.();
      sourceRef.current?.disconnect?.();
      streamRef.current?.getTracks?.().forEach((track) => track.stop());
      audioContextRef.current?.close?.();
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [isUrdu, modelUrl]);

  useEffect(() => {
    if (!active) {
      stopListening(false);
    }
  }, [active]);

  const stopListening = (save = true) => {
    setIsListening(false);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

    try {
      processorRef.current?.disconnect();
      sourceRef.current?.disconnect();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      audioContextRef.current?.close();
    } catch {
      // ignore cleanup errors
    }

    processorRef.current = null;
    sourceRef.current = null;
    streamRef.current = null;
    audioContextRef.current = null;

    if (save && voiceText.trim()) {
      setInstructions((prev) => [...prev, voiceText.trim()]);
    }
  };

  const startListening = async () => {
    if (!isSupported) {
      setStatusMessage(
        isUrdu
          ? "Mic access اس browser میں دستیاب نہیں ہے"
          : "Microphone access is not available in this browser"
      );
      return;
    }

    if (!modelReady || !modelRef.current) {
      setStatusMessage(
        isUrdu
          ? "Offline model ابھی ready نہیں ہے"
          : "Offline model is not ready yet"
      );
      return;
    }

    try {
      finalTranscriptRef.current = "";
      setVoiceText("");
      setStatusMessage(isUrdu ? "بولنا شروع کریں..." : "Start speaking...");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          channelCount: 1,
          sampleRate: 16000,
        },
        video: false,
      });

      const audioContext = new AudioContext({ sampleRate: 16000 });
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      const recognizer = new modelRef.current.KaldiRecognizer();

      recognizer.on("result", (message: any) => {
        const text = message?.result?.text || "";
        if (text.trim()) {
          finalTranscriptRef.current = `${finalTranscriptRef.current}${text} `.trim() + " ";
          setVoiceText(finalTranscriptRef.current.trim());
        }
      });

      recognizer.on("partialresult", (message: any) => {
        const partial = message?.result?.partial || "";
        setVoiceText(`${finalTranscriptRef.current}${partial}`.trim());
      });

      processor.onaudioprocess = (event) => {
        try {
          recognizer.acceptWaveform(event.inputBuffer);
        } catch {
          setStatusMessage(
            isUrdu
              ? "Audio processing میں مسئلہ ہے"
              : "Audio processing error"
          );
        }
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      streamRef.current = stream;
      audioContextRef.current = audioContext;
      sourceRef.current = source;
      processorRef.current = processor;
      recognizerRef.current = recognizer;
      setIsListening(true);
      timeoutRef.current = window.setTimeout(() => stopListening(), 15000);
    } catch (error) {
      setStatusMessage(
        isUrdu
          ? `Recording شروع نہیں ہو سکی: ${String(error)}`
          : `Recording could not start: ${String(error)}`
      );
      setIsListening(false);
      stopListening(false);
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
            ? "آپ کے browser میں mic access support نہیں ہے. Chrome/Edge استعمال کریں."
            : "Your browser does not support microphone access. Try Chrome or Edge."}
        </div>
      )}

      {modelMissing && (
        <div className="mb-3 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-semibold text-red-800">
          {isUrdu
            ? "Offline model نہیں ملا. اسے /public/models میں رکھیں."
            : "Offline model not found. Put it under /public/models."}
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
            onClick={isListening ? () => stopListening() : startListening}
            disabled={!isSupported || !modelReady}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50 ${
              isListening ? "bg-red-600" : "bg-slate-900"
            }`}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isListening ? (isUrdu ? "روکیں" : "Stop") : (isUrdu ? "بولیں" : "Speak")}
          </button>

          <button
            onClick={saveTypedInstruction}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-black text-green-800 shadow-sm"
          >
            <Save className="h-4 w-4" />
            {isUrdu ? "محفوظ کریں" : "Save"}
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] font-semibold text-slate-500">
        <span>{isUrdu ? "زیادہ سے زیادہ 15 سیکنڈ" : "Max 15 sec"}</span>
        <span>{isUrdu ? "ریکارڈ شدہ ہدایات نیچے دکھائی جائیں گی" : "Saved instructions appear below"}</span>
      </div>

      {instructions.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-slate-500">
            <PencilLine className="h-4 w-4" />
            {isUrdu ? "ریکارڈ شدہ ہدایات" : "Recorded Instructions"}
          </div>
          <div className="grid gap-2">
            {instructions.map((instruction, index) => (
              <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-700">
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
