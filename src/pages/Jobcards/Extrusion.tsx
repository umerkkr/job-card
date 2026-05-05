import { useState } from "react";
import JobCardLayout from "../DigitalJobcard/JobCardLayout";
import InfoTable from "../jobcardlayout/InfoTable";
import ProductionLog from "../jobcardlayout/ProductionLog";
import RemarksSection from "../jobcardlayout/RemarksSection";
import ExtrusionDetailsTable from "../jobcardlayout/ExtrusionDetailsTable";
import SpecialRequirementsTable from "../jobcardlayout/SpecialRequirementsTable";
import ExtrusionMachineTable from "../jobcardlayout/ExtrusionMachineTable";

type Props = { onBack: () => void };

const Extrusion = ({ onBack }: Props) => {
  const [isUrdu, setIsUrdu] = useState(true);

  const t = (ur: string, en: string) => (isUrdu ? ur : en);

  const rows = [
    [
      { content: t("ورک آرڈر نمبر", "Work Order No") },
      { content: "LX-05871/2526" },
      { content: t("ہفتہ", "Week") },
      { content: "2" },
      { content: t("مہینہ", "Month") },
      { content: "Apr" },
      { content: t("سال", "Year") },
      { content: "2026" },
    ],
    [
      { content: t("تفصیل", "Description") },
      { content: "AL/XLPE/PVC 1x150 MM² 600/1000 V", colSpan: 7 },
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
      title={t("ایکسٹروژن", "EXTRUSION")}
      isUrdu={isUrdu}
      setIsUrdu={setIsUrdu}
      onBack={onBack}
    >
      <InfoTable rows={rows} />

      <ExtrusionMachineTable isUrdu={isUrdu} />
      <SpecialRequirementsTable isUrdu={isUrdu} />

      <ExtrusionDetailsTable isUrdu={isUrdu} />

      <ProductionLog isUrdu={isUrdu} />

      <RemarksSection isUrdu={isUrdu} />
    </JobCardLayout>
    </div>
  );
};

export default Extrusion;