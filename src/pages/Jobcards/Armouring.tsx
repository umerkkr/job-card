import { useState } from "react";
import JobCardLayout from "../DigitalJobcard/JobCardLayout";
import MachineTable from "../jobcardlayout/MachineTable";
import RemarksSection from "../jobcardlayout/RemarksSection";
import SpecialRequirementsTable from "../jobcardlayout/SpecialRequirementsTable";
import ProductionLog from "../jobcardlayout/ProductionLog";
import InfoTable from "../jobcardlayout/InfoTable";
import InputLotTable from "../jobcardlayout/InputLotTable";
import ArmouringDetailsTable from "../jobcardlayout/ArmouringDetailsTable";

const Armouring = ({ onBack }: any) => {
  const [isUrdu, setIsUrdu] = useState(true);  

  const getRows = () => [
    [
      { content: isUrdu ? "ورک آرڈر نمبر" : "Work Order No" },
      {
        content: (
          <input
            defaultValue="PC -05696/2526, PC -05721/2526, PC -05729/2526"
            readOnly
            className="w-full font-bold text-center outline-none"
          />
        ),
      },
      { content: isUrdu ? "ہفتہ" : "Week" },
      {
        content: (
          <input
            defaultValue="5"
            readOnly
            className="w-full font-bold text-center outline-none"
          />
        ),
      },
      { content: isUrdu ? "مہینہ" : "Month" },
      {
        content: (
          <input
            defaultValue="Mar"
            readOnly
            className="w-full font-bold text-center outline-none"
          />
        ),
      },
      { content: isUrdu ? "سال" : "Year" },
      {
        content: (
          <input
            defaultValue="2026"
            readOnly
            className="w-full font-bold text-center outline-none"
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
  title="ARMOURING"
  jobId="armouring"
  isUrdu={isUrdu}
  setIsUrdu={setIsUrdu}
>
  <InfoTable rows={getRows()} />

  <MachineTable isUrdu={isUrdu} />

  <SpecialRequirementsTable isUrdu={isUrdu} />

  <InputLotTable isUrdu={isUrdu} />

  <ArmouringDetailsTable isUrdu={isUrdu} />

  <ProductionLog isUrdu={isUrdu} />

  <RemarksSection isUrdu={isUrdu} />
</JobCardLayout>

  </div>
);
};

export default Armouring;