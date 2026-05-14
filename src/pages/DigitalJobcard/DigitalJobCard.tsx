import { useState } from "react";
import SupervisorDashboard from "./SupervisorDashboard";

const JOB_CARDS = [

  { id: 'extrusion', label: 'Extrusion' },
  
  // { id: 'bunching', label: 'Bunching' },
  { id: 'laying-up', label: 'Laying Up' },
  { id: 'armouring', label: 'Armouring' },
  // { id: 'sheathing', label: 'Sheathing' },
  // { id: 'rewinding', label: 'Rewinding' },
  // { id: 'tinning', label: 'Tinning' },
  // { id: 'stranding ', label: 'Stranding' },
  { id: 'drawing', label: 'Drawing' },
  { id: 'cu-taping', label: 'CU Taping' },
];

type JobData = {
  jobName: string;
  jobId: string;
  machine: string;
  process: string;
  products: any[];
};

type Props = {
  onCreateJob: (data: JobData) => void;
  onSelectJob?: (id: string) => void;
};

const DigitalJobCard = ({ onCreateJob }: Props) => {
  const [activeTab, setActiveTab] = useState<"jobCard" | "supervisor">("jobCard");

  return (
    <div className="min-h-screen bg-[#f8fafc] p-2 md:p-4">
      <header className="max-w-7xl mx-auto mb-8">
        <div className="bg-[#007a3d] text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase">Digital Job Flow</h1>
          </div>

          <div className="flex bg-black/20 p-1.5 rounded-xl backdrop-blur-md">
            <button
              onClick={() => setActiveTab("jobCard")}
              className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === "jobCard"
                  ? "bg-white text-[#007a3d] shadow-lg"
                  : "text-white/70 hover:text-white"
                }`}
            >
              Job Cards
            </button>
            <button
              onClick={() => setActiveTab("supervisor")}
              className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === "supervisor"
                  ? "bg-white text-[#007a3d] shadow-lg"
                  : "text-white/70 hover:text-white"
                }`}
            >
              Supervisor
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {activeTab === "jobCard" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-500">
            {JOB_CARDS.map((job) => (
              <button
                key={job.id}
                className="group relative cursor-pointer bg-white border border-gray-200 hover:border-[#007a3d] p-10 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 text-center flex flex-col items-center justify-center min-h-[180px] overflow-hidden"
                onClick={() =>
                  onCreateJob({
                    jobName: job.label,
                    process: job.label, 
                    jobId: job.id,
                    machine: "",
                    products: [],
                  })
                }
              >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gray-50 rounded-full group-hover:bg-green-50 transition-colors duration-500" />

                <span className="relative z-10 text-xl font-black text-gray-800 group-hover:text-[#007a3d] transition-colors tracking-tighter">
                  {job.label.toUpperCase()}
                </span>

                <p className="relative z-10 text-[10px] font-bold text-gray-400 mt-2 group-hover:text-green-600/70 uppercase tracking-widest">
                  Tap to open log
                </p>

                <div className="absolute bottom-0 left-0 w-0 h-1.5 bg-[#007a3d] transition-all duration-500 group-hover:w-full" />
              </button>
            ))}
          </div>
        ) : (
          <SupervisorDashboard onCreateJob={onCreateJob} />
        )}
      </main>
    </div>
  );
};

export default DigitalJobCard;