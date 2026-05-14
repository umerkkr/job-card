import { useState, useEffect, useRef } from 'react';


declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
const VoiceComponent = ({ isUrdu } : { isUrdu: boolean }) => {
  const [voiceText, setVoiceText] = useState("");
  const [isListening, setIsListening] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.continuous = true; 
      recognition.interimResults = true; 
      recognition.lang = isUrdu ? 'ur-PK' : 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setVoiceText(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      alert("Your browser does not support speech recognition.");
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [isUrdu]);

  const handleVoiceToggle = () => {
    if (!isListening) {
      setVoiceText("");
      recognitionRef.current?.start();
      setIsListening(true);
    } else {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="mt-4 border-2 border-black rounded">
      <div className="bg-gray-100 border-b border-black px-3 py-2 font-bold text-[14px]">
        {isUrdu ? "ہدایات" : "INSTRUCTIONS"}
      </div>

      <div className="p-3">
        <div className="mb-2 text-[13px] font-bold text-red-600">
          {isUrdu
            ? isListening ? "🛑 روکنے کے لیے بٹن دبائیں" : "🎤 بولنے کے لیے مائیک بٹن دبائیں"
            : isListening ? "🛑 Click the button to stop" : "🎤 Click the microphone button to speak"}
        </div>

        <div className="flex items-center gap-3">
          <input
            value={voiceText}
            onChange={(e) => setVoiceText(e.target.value)}
            placeholder={
              isUrdu
                ? "آپ کی آواز یہاں لکھی جائے گی..."
                : "Your speech will appear here..."
            }
            className="w-full border border-gray-400 p-2 text-[14px] font-bold rounded outline-none"
          />

          <button
            onClick={handleVoiceToggle}
            className={`${
              isListening ? "bg-red-600 animate-pulse" : "bg-green-700"
            } text-white w-14 h-14 rounded-full text-[28px] flex items-center justify-center shadow-lg transition-all duration-200`}
          >
            {isListening ? "🛑" : "🎤"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceComponent;