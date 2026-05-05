import { useState } from "react";
import JobCardLayout from "../DigitalJobcard/JobCardLayout";
import BunchingCarriageTable from "../jobcardlayout/BunchingCarriageTable";
import InfoTable from "../jobcardlayout/InfoTable";
import MachineTable from "../jobcardlayout/MachineTable";
import ProductionLog from "../jobcardlayout/ProductionLog";
import RemarksSection from "../jobcardlayout/RemarksSection";

const Stranding = ({ onBack }: any) => {
  const [isUrdu, setIsUrdu] = useState(true);
  const t = (u: string, e: string) => (isUrdu ? u : e);

  return (
     <div className="max-w-[1200px] mx-auto">

    <button
      onClick={onBack}
      className="mb-3 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
    >
      ← Back
    </button>

    <JobCardLayout
      title={t("اسٹرینڈنگ", "STRANDING")}
      isUrdu={isUrdu}
      setIsUrdu={setIsUrdu}
      onBack={onBack}
    >
      <InfoTable rows={[]} />
      <MachineTable isUrdu={isUrdu} />
      <BunchingCarriageTable isUrdu={isUrdu} />
      <ProductionLog isUrdu={isUrdu} />
      <RemarksSection isUrdu={isUrdu} />
    </JobCardLayout>
    </div>
  );
};

export default Stranding;