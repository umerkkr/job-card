import { useState } from "react";

const JobCardLayout = ({ title, children, isUrdu, setIsUrdu }: any) => {
  const [voiceText, setVoiceText] = useState("");

  const toggleLanguage = () => {
    setIsUrdu(!isUrdu);
  };

  const startVoice = () => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = isUrdu ? "ur-PK" : "en-US";

    recognition.onresult = (e: any) => {
      setVoiceText(e.results[0][0].transcript);
    };

    recognition.start();
  };

  return (
    <div className="bg-white border-2 border-black p-5 text-[11px] max-w-[1200px] mx-auto shadow">
      
      <div className="bg-green-700 text-white p-2 flex justify-between items-center rounded mb-4">
        <button
          onClick={toggleLanguage}
          className="bg-white text-green-700 px-3 py-1 text-xs rounded font-bold"
        >
          {isUrdu
            ? "Switch to English / انگریزی"
            : "Switch to Urdu / اردو"}
        </button>

        <div className="font-bold">
          {isUrdu ? "آپریشنل ڈیش بورڈ" : "Operational Dashboard"}
        </div>
      </div>

      <div className="grid grid-cols-3 border-b-2 border-black pb-1 mb-2">
        <div className="font-bold text-[20px]">
          PAKISTAN CABLES LIMITED
        </div>

        <div className="text-center text-[18px] leading-tight font-bold">
          { title}
        </div>

        <div className="text-right text-[11px]">
          Print Date: 4/6/2026 11:43:30 AM <br />
          Printed by: ABC USER
        </div>
      </div>

     <table className="w-full border mb-2">
  <tbody>
    <tr>
      <th className="border p-1 w-[120px] bg-gray-100">
        {isUrdu ? "ہدایات:" : "INSTRUCTIONS:"}
      </th>
      <td className="border p-1">
        <div className="flex items-center">
          <input
            value={voiceText}
            onChange={(e) => setVoiceText(e.target.value)}
            placeholder={
              isUrdu
                ? "بولنے کے لیے مائیک دبائیں..."
                : "Click mic to speak..."
            }
            className="w-full text-left font-bold outline-none"
          />
          <button onClick={startVoice} className="ml-2">
            🎤
          </button>
        </div>
      </td>
    </tr>
  </tbody>
</table>

      {children}
    </div>
  );
};

export default JobCardLayout;