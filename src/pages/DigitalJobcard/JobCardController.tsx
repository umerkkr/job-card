import { useState } from "react";
import type { AuthUser } from "../../App";
import DigitalJobCard from "./DigitalJobCard";

import WireDrawing from "../Jobcards/Drawing";
import LayingUp from "../Jobcards/LayingUp";
import Sheathing from "../Jobcards/Sheathing";

type JobData = {
  jobName: string;
  jobId: string;
  machine: string;
  process: string;
  products: any[];
};

type Props = {
  user: AuthUser;
  onLogout: () => void;
};

const JobCardController = ({ user, onLogout }: Props) => {
  const [jobData, setJobData] = useState<JobData | null>(null);

  const handleBack = () => setJobData(null);

  if (!jobData) {
    return <DigitalJobCard onCreateJob={setJobData} />;
  }

  switch (jobData.jobId) {
  // case "armouring":
  //   return <Armouring onBack={handleBack} data={jobData} crewNo={user.crewNo} onLogout={onLogout} />;

  case "drawing":
    return <WireDrawing onBack={handleBack} data={jobData} crewNo={user.crewNo} onLogout={onLogout} />;

  // case "stranding":
  //   return <Stranding onBack={handleBack} data={jobData} crewNo={user.crewNo} onLogout={onLogout} />;

  // case "extrusion":
  //   return <Extrusion onBack={handleBack} data={jobData} crewNo={user.crewNo} onLogout={onLogout} />;

  // case "bunching":
  //   return <Bunching onBack={handleBack} data={jobData} crewNo={user.crewNo} onLogout={onLogout} />;

  case "laying-up":
    return <LayingUp onBack={handleBack} data={jobData} crewNo={user.crewNo} onLogout={onLogout} />;

  case "sheathing":
    return <Sheathing onBack={handleBack} data={jobData} crewNo={user.crewNo} onLogout={onLogout} />;

  // case "sheathing":
  //   return <Bradding onBack={handleBack} data={jobData} crewNo={user.crewNo} onLogout={onLogout} />;

  // case "cu-taping":
  //   return <CuTaping onBack={handleBack} data={jobData} crewNo={user.crewNo} onLogout={onLogout} />;

  default:
    return <DigitalJobCard onCreateJob={setJobData} />;
}
};

export default JobCardController;
