import { useState } from "react";
import DigitalJobCard from "./DigitalJobCard";

import Armouring from "../Jobcards/Armouring";
import Extrusion from "../Jobcards/Extrusion";
import Bradding from "../Jobcards/Bradding";
import Bunching from "../Jobcards/Bunching";
import Stranding from "../Jobcards/Stranding";
import WireDrawing from "../Jobcards/Drawing";
import LayingUp from "../Jobcards/LayingUp";
import CuTaping from "../Jobcards/CUTaping";

type JobData = {
  jobName: string;
  jobId: string;
  machine: string;
  products: any[];
};

const JobCardController = () => {
  const [jobData, setJobData] = useState<JobData | null>(null);

  const handleBack = () => setJobData(null);

  if (!jobData) {
    return <DigitalJobCard onCreateJob={setJobData} />;
  }

  switch (jobData.jobId) {
  case "armouring":
    return <Armouring onBack={handleBack} data={jobData} />;

  case "drawing":
    return <WireDrawing onBack={handleBack} data={jobData} />;

  case "stranding":
    return <Stranding onBack={handleBack} data={jobData} />;

  case "extrusion":
    return <Extrusion onBack={handleBack} data={jobData} />;

  case "bunching":
    return <Bunching onBack={handleBack} data={jobData} />;

  case "laying-up":
    return <LayingUp onBack={handleBack} data={jobData} />;

  case "sheathing":
    return <Bradding onBack={handleBack} data={jobData} />;

  case "cu-taping":
    return <CuTaping onBack={handleBack} data={jobData} />;

  default:
    return <DigitalJobCard onCreateJob={setJobData} />;
}
};

export default JobCardController;