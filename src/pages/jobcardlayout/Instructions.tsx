import { useState, useEffect, useRef } from 'react';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const VoiceComponent = ({ isUrdu }: { isUrdu: boolean }) => {
  const [voiceText, setVoiceText] = useState("");
  const [isListening, setIsListening] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<any>(null);
  // This Ref keeps track of "confirmed" text so it doesn't duplicate
  const finalTranscriptRef = useRef(""); 

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = isUrdu ? 'ur-PK' : 'en-US';

      recognition.onresult = (event: any) => {
        let interimTranscript = "";
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscriptRef.current += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        // Combine confirmed text + what you are currently saying
        const currentDisplay = (finalTranscriptRef.current + interimTranscript).trim();
        setVoiceText(currentDisplay);
      };

      recognition.onerror = () => stopListening();
      recognition.onend = () => setIsListening(false);
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isUrdu]);

  const startListening = () => {
    finalTranscriptRef.current = ""; // Reset internal buffer
    setVoiceText(""); 
    recognitionRef.current?.start();
    setIsListening(true);

    timeoutRef.current = setTimeout(() => stopListening(), 60000);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleVoiceToggle = () => {
    if (!isListening) startListening();
    else stopListening();
  };

  return (
    <div className={`w-full  my-2 ${isUrdu ? 'rtl' : 'ltr'}`}>
      <div className={`flex items-center gap-2 p-1.5 rounded-lg border bg-white transition-all ${
        isListening ? "border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]" : "border-gray-300"
      }`}>
        
        {/* Compact Indicator */}
        <div className="flex items-center justify-center pl-2">
           <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-ping' : 'bg-gray-300'}`} />
        </div>

        <input
          value={voiceText}
          onChange={(e) => {
            setVoiceText(e.target.value);
            finalTranscriptRef.current = e.target.value; // Sync manual edits
          }}
          placeholder={isUrdu ? "ریمارکس یہاں لکھیں..." : "Type or speak remarks..."}
          className="flex-grow bg-transparent py-1.5 text-sm outline-none text-gray-700 font-medium"
        />

        {/* Action Button */}
        <button
          onClick={handleVoiceToggle}
          className={`flex items-center justify-center min-w-[40px] h-10 px-3 rounded-md transition-colors ${
            isListening ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {isListening ? (
             <span className="text-xs font-bold uppercase tracking-tighter">Stop</span>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
          )}
        </button>
      </div>
      
      {/* Tiny Status Text */}
      <div className="flex justify-between px-1 mt-1">
        <span className="text-[10px] text-gray-400 italic">
          {isListening ? (isUrdu ? "ریکارڈنگ..." : "Listening...") : ""}
        </span>
        <span className="text-[10px] text-gray-400">
          {isUrdu ? "زیادہ سے زیادہ 1 منٹ" : "Max 1 min"}
        </span>
      </div>
    </div>
  );
};

export default VoiceComponent;