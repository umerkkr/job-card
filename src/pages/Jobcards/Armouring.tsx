import { useState } from "react";
import JobCardLayout from "../DigitalJobcard/JobCardLayout";
import MachineTable from "../jobcardlayout/MachineTable";
import SpecialRequirementsTable from "../jobcardlayout/SpecialRequirementsTable";
import ProductionLog from "../jobcardlayout/ProductionLog";
import InfoTable from "../jobcardlayout/InfoTable";
import InputLotTable from "../jobcardlayout/InputLotTable";
import ArmouringDetailsTable from "../jobcardlayout/ArmouringDetailsTable";

const Armouring = ({ onBack }: any) => {
  const [isUrdu, setIsUrdu] = useState(true);
  const [open, setOpen] = useState(false);

  const getRows = () => [
    [
      { content: isUrdu ? "ورک آرڈر نمبر" : "Work Order No" },
      {
        content: (
          <input
            defaultValue="PC -05696/2526, PC -05721/2526, PC -05729/2526"
            readOnly
            className="w-full font-bold text-center outline-none bg-transparent"
          />
        ),
      },
      { content: isUrdu ? "ہفتہ" : "Week" },
      {
        content: (
          <input
            defaultValue="5"
            readOnly
            className="w-full font-bold text-center outline-none bg-transparent"
          />
        ),
      },
      { content: isUrdu ? "مہینہ" : "Month" },
      {
        content: (
          <input
            defaultValue="Mar"
            readOnly
            className="w-full font-bold text-center outline-none bg-transparent"
          />
        ),
      },
      { content: isUrdu ? "سال" : "Year" },
      {
        content: (
          <input
            defaultValue="2026"
            readOnly
            className="w-full font-bold text-center outline-none bg-transparent"
          />
        ),
      },
    ],
    [
      { content: isUrdu ? "تفصیل" : "Description" },
      {
        content: (
          <input
            defaultValue="CU/PVC 1X95MM² (FLEXIBLE) 450/750 V (GREEN/YELLOW), CU/PVC/PVC 1x185 MM²"
            readOnly
            className="w-full font-bold text-center outline-none bg-transparent"
          />
        ),
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
        title={"ARMOURING"}
        jobId="armouring"
        isUrdu={isUrdu}
        setIsUrdu={setIsUrdu}
      >
        <div className="border border-black text-[11px] bg-white">
          {/* COLLAPSIBLE HEADER */}
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between bg-gray-100 border-b border-black px-3 py-2 font-bold text-[13px]"
          >
            <span>
              {isUrdu ? "جاب کارڈ کی تفصیلات" : "JOB CARD DETAILS"}
            </span>

            <span
              className={`transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          {/* ALL TABLES AND LOGS ARE NOW INSIDE THIS DIV */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              open
                ? "max-h-[5000px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <InfoTable rows={getRows()} />

            <MachineTable isUrdu={isUrdu} />

            <SpecialRequirementsTable isUrdu={isUrdu} />

            <InputLotTable isUrdu={isUrdu} />

            <ArmouringDetailsTable isUrdu={isUrdu} />

            <ProductionLog isUrdu={isUrdu} />
          </div>
        </div>
      </JobCardLayout>
    </div>
  );
};

export default Armouring;