import { useState } from "react";
import JobCardLayout from "../DigitalJobcard/JobCardLayout";
import InfoTable from "../jobcardlayout/InfoTable";
import ProductionLog from "../jobcardlayout/ProductionLog";
import RemarksSection from "../jobcardlayout/RemarksSection";
import LayingUpMachineTable from "../jobcardlayout/LayingUpMachineTable";
import InputLotTable from "../jobcardlayout/InputLotTable";
import LayingDetailsTable from "../jobcardlayout/LayingDetailsTable";


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

const LayingUp = ({ onBack }: Props) => {
  const [isUrdu, setIsUrdu] = useState(true);

  const t = (ur: string, en: string) => (isUrdu ? ur : en);

  const rows = [
    [
      { content: t("ورک آرڈر نمبر", "Work Order No") },
      { content: "PC-03447/2526" },
      { content: t("ہفتہ", "Week") },
      { content: "2" },
      { content: t("مہینہ", "Month") },
      { content: "Dec" },
      { content: t("سال", "Year") },
      { content: "2025" },
    ],
    [
      { content: t("تفصیل", "Description") },
      { content: "CU/PVC/SWA/PVC 3x50 MM² 600/1000 V", colSpan: 7 },
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
        title={t("لے اپ", "LAYING UP")}
        isUrdu={isUrdu}
        setIsUrdu={setIsUrdu}
        onBack={onBack}
      >
        <InfoTable rows={rows} />

        <LayingUpMachineTable isUrdu={isUrdu} />

        <InputLotTable isUrdu={isUrdu} />

        <LayingDetailsTable isUrdu={isUrdu} />

        <ProductionLog isUrdu={isUrdu} />

        <RemarksSection isUrdu={isUrdu} />
      </JobCardLayout>

    </div>
  );
};

export default LayingUp;