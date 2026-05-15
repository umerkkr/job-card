import { useState } from "react";
import JobCardLayout from "../DigitalJobcard/JobCardLayout";
import InfoTable from "../jobcardlayout/InfoTable";
import MachineTable from "../jobcardlayout/MachineTable";
import ProductionLog from "../jobcardlayout/ProductionLog";

const Bradding = ({ onBack }: any) => {
  const [isUrdu, setIsUrdu] = useState(true);
  const t = (u: string, e: string) => (isUrdu ? u : e);

  const rows = [
    [
      { content: t("ورک آرڈر نمبر", "Work Order No") },
      { content: "PC-05808/2526" },
      { content: t("ہفتہ", "Week") },
      { content: "1" },
      { content: t("مہینہ", "Month") },
      { content: "Apr" },
      { content: t("سال", "Year") },
      { content: "2026" },
    ],
    [
      { content: t("تفصیل", "Description") },
      { content: "CU/ARMOURED 4x120 MM²", colSpan: 7 },
    ],
  ];

  return (
     <div className="max-w-[1200px] mx-auto">

    <button
      onClick={onBack}
      className="mb-3 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
    >
      ← Back
    </button>

    <JobCardLayout
      title={t("بریڈنگ", "BRADDING")}
      isUrdu={isUrdu}
      setIsUrdu={setIsUrdu}
      onBack={onBack}
    >
      <InfoTable rows={rows} />
      <MachineTable isUrdu={isUrdu} />
      <ProductionLog isUrdu={isUrdu} />
    </JobCardLayout>
    </div>
  );
};

export default Bradding;