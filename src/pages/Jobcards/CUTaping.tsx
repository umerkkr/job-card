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

  // COLLAPSIBLE STATE
  const [open, setOpen] = useState(false);

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
        <div className="border border-black text-[11px]">

          {/* COLLAPSIBLE HEADER */}
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between bg-gray-100 border-b border-black px-3 py-2 font-bold text-[13px]"
          >
            <span>
              {isUrdu
                ? "جاب کارڈ کی تفصیلات"
                : "JOB CARD DETAILS"}
            </span>

            <span
              className={`transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          {/* COLLAPSIBLE CONTENT */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              open
                ? "max-h-[5000px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <InfoTable rows={rows} />

            <MachineTable isUrdu={isUrdu} />

            <SpecialRequirementsTable isUrdu={isUrdu} />

            <InputLotTable isUrdu={isUrdu} />

            <TapeDetailsTable isUrdu={isUrdu} />
          </div>

          {/* ALWAYS VISIBLE */}
          <ProductionLog isUrdu={isUrdu} />
        </div>
      </JobCardLayout>
    </div>
  );
};

export default CuTaping;