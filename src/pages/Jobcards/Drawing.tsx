import { useState } from "react";
import JobCardLayout from "../DigitalJobcard/JobCardLayout";
import MachineTable from "../jobcardlayout/MachineTable";
import RemarksSection from "../jobcardlayout/RemarksSection";
import SpecialRequirementsTable from "../jobcardlayout/SpecialRequirementsTable";
import ProductionLog from "../jobcardlayout/ProductionLog";
import InfoTable from "../jobcardlayout/InfoTable";

const WireDrawing = ({ onBack }: any) => {
  const [isUrdu, setIsUrdu] = useState(false);

  const getRows = () => [
    [
      { content: isUrdu ? "ورک آرڈر نمبر" : "Work Order No" },
      {
        content: (
          <input
            defaultValue="LX-04542/2526"
            readOnly
            className="w-full font-bold text-center outline-none"
          />
        ),
      },
      { content: isUrdu ? "ہفتہ" : "Week" },
      {
        content: (
          <input defaultValue="3" readOnly className="w-full text-center font-bold" />
        ),
      },
      { content: isUrdu ? "مہینہ" : "Month" },
      {
        content: (
          <input defaultValue="Mar" readOnly className="w-full text-center font-bold" />
        ),
      },
      { content: isUrdu ? "سال" : "Year" },
      {
        content: (
          <input defaultValue="2026" readOnly className="w-full text-center font-bold" />
        ),
      },
    ],

    [
      { content: isUrdu ? "تفصیل" : "Description" },
      {
        content: (
          <input
            defaultValue="Aluminium Wire H-12 of dia 3.24 mm"
            readOnly
            className="w-full font-bold text-center outline-none"
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
        title={isUrdu ? "وائر ڈرائنگ" : "WIRE DRAWING"}
        isUrdu={isUrdu}
        setIsUrdu={setIsUrdu}
      >
        <InfoTable rows={getRows()} />

        <MachineTable isUrdu={isUrdu} />

        <SpecialRequirementsTable isUrdu={isUrdu} />

        <ProductionLog isUrdu={isUrdu} />

        <RemarksSection isUrdu={isUrdu} />
      </JobCardLayout>
    </div>
  );
};

export default WireDrawing;