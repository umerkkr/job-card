import RemarksSection from "../jobcardlayout/RemarksSection";
import VoiceComponent from "../jobcardlayout/Instructions";

const JobCardLayout = ({ title, children, isUrdu, setIsUrdu }: any) => {

  const toggleLanguage = () => {
    setIsUrdu(!isUrdu);
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
          {title}
        </div>

        <div className="text-right text-[11px]">
          Print Date: 4/6/2026 11:43:30 AM <br />
          Printed by: ABC USER
        </div>
      </div>
      {children}
      <VoiceComponent isUrdu={isUrdu} />
        <RemarksSection isUrdu={isUrdu} />
    </div>
  );
};

export default JobCardLayout;