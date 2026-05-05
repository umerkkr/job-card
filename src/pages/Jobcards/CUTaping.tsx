import { useState } from "react";
import JobCardLayout from "../DigitalJobcard/JobCardLayout";

import InfoTable from "../jobcardlayout/InfoTable";
import SpecialRequirementsTable from "../jobcardlayout/SpecialRequirementsTable";
import InputLotTable from "../jobcardlayout/InputLotTable";
import ProductionLog from "../jobcardlayout/ProductionLog";
import RemarksSection from "../jobcardlayout/RemarksSection";
import TapeDetailsTable from "../jobcardlayout/TapeDetails";
import MachineTable from "../jobcardlayout/MachineTable";

const CuTaping = ({ onBack }: any) => {
  const [isUrdu, setIsUrdu] = useState(true);

  const rows = [
    [
      { content: isUrdu ? "ورک آرڈر نمبر" : "Work Order No" },
      { content: "X-06944/2526" },
      { content: isUrdu ? "ہفتہ" : "Week" },
      { content: "5" },
      { content: isUrdu ? "مہینہ" : "Month" },
      { content: "Apr" },
      { content: isUrdu ? "سال" : "Year" },
      { content: "2026" },
    ],
    [
      { content: isUrdu ? "تفصیل" : "Description" },
      {
        content:
          "AL/XLPE/PVC/SWA/PVC 3X300MM² 8.7/15 KV (TRIPLE EXT.) BLACK SHEATH",
        colSpan: 7,
      },
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
        title="CU TAPING"
        jobId="cu-taping"
        isUrdu={isUrdu}
        setIsUrdu={setIsUrdu}
      >
        <InfoTable rows={rows} />

        <MachineTable isUrdu={isUrdu} />

        <SpecialRequirementsTable isUrdu={isUrdu} />

        <InputLotTable isUrdu={isUrdu} />

        <TapeDetailsTable isUrdu={isUrdu} />

        <ProductionLog isUrdu={isUrdu} />

        <RemarksSection isUrdu={isUrdu} />
      </JobCardLayout>

    </div>
  );
};

export default CuTaping;