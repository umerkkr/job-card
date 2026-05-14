import { useState } from "react";
import JobCardLayout from "../DigitalJobcard/JobCardLayout";
import InfoTable from "../jobcardlayout/InfoTable";
import ProductionLog from "../jobcardlayout/ProductionLog";
import RemarksSection from "../jobcardlayout/RemarksSection";
import ExtrusionDetailsTable from "../jobcardlayout/ExtrusionDetailsTable";
import SpecialRequirementsTable from "../jobcardlayout/SpecialRequirementsTable";
import ExtrusionMachineTable from "../jobcardlayout/ExtrusionMachineTable";

type JobData = {
  jobName: string;
  jobId: string;
  machine: string;
  products: any[];
};

type Props = {
  onBack: () => void;
  data: JobData;
};

const Extrusion = ({ onBack }: Props) => {
  const [isUrdu, setIsUrdu] = useState(true);

  // COLLAPSIBLE STATE
  const [open, setOpen] = useState(false);

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
        <div className="border border-black text-[11px]">
          
          {/* COLLAPSIBLE HEADER */}
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between bg-gray-100 border-b border-black px-3 py-2 font-bold text-[13px]"
          >
            <span>
              {t("جاب کارڈ کی تفصیلات", "JOB CARD DETAILS")}
            </span>

            <span
              className={`transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              open
                ? "max-h-[5000px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <InfoTable rows={rows} />

            <ExtrusionMachineTable isUrdu={isUrdu} />

            <SpecialRequirementsTable isUrdu={isUrdu} />

            <ExtrusionDetailsTable isUrdu={isUrdu} />
          </div>

          <ProductionLog isUrdu={isUrdu} />
        </div>
      </JobCardLayout>
    </div>
  );
};

export default Extrusion;