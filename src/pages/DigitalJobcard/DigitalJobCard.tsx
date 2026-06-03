import { useMemo } from "react";
import { useActiveJobs, type ActiveJob } from "../../hooks/useActiveJobs";

const PROCESS_CARD_MAP: Record<string, { id: string; label: string; accent: string }> = {
  MULTI_WIRE_DRAWING: { id: "drawing", label: "Drawing", accent: "from-emerald-50 to-white" },
  WIRE_DRAWING: { id: "drawing", label: "Drawing", accent: "from-emerald-50 to-white" },
  LAYING_UP: { id: "laying-up", label: "Laying Up", accent: "from-teal-50 to-white" },
  LAYUP: { id: "laying-up", label: "Laying Up", accent: "from-teal-50 to-white" },
  INSULATION: { id: "insulation", label: "Insulation", accent: "from-sky-50 to-white" },
  SHEATHING: { id: "sheathing", label: "Sheathing", accent: "from-indigo-50 to-white" },
};

type JobData = {
  jobName: string;
  jobId: string;
  machine: string;
  process: string;
  processName?: string;
  jobNumber?: string;
  status?: string;
  productCode?: string;
  products: any[];
};

type Props = {
  onCreateJob: (data: JobData) => void;
  onSelectJob?: (id: string) => void;
};

const DigitalJobCard = ({ onCreateJob }: Props) => {
  const { data: activeJobs } = useActiveJobs();

  const availableCards = useMemo(() => {
    if (!activeJobs?.length) return [];

    const cards = activeJobs
      .map((job: ActiveJob) => {
        const card = PROCESS_CARD_MAP[job.processName];
        if (!card) return null;

        return {
          ...card,
          job,
        };
      })
      .filter(Boolean) as Array<(typeof PROCESS_CARD_MAP)[keyof typeof PROCESS_CARD_MAP] & { job: ActiveJob }>;

    const seen = new Set<string>();
    return cards.filter((card) => {
      if (seen.has(card.id)) return false;
      seen.add(card.id);
      return true;
    });
  }, [activeJobs]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f9fa_0%,#eef3f6_100%)] p-2 md:p-4">
      <header className="mx-auto mb-6 max-w-7xl">
        <div className="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#0b6d2f_0%,#0f7a36_55%,#0a5c27_100%)] p-6 text-white shadow-2xl">
          <div className="text-xs font-bold uppercase tracking-[0.28em] text-white/75">
            Cable Flow MES
          </div>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Job Cards</h1>
          <p className="mt-2 max-w-2xl text-sm font-semibold text-white/80">
            Select a process card to open the matching job-card workspace.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {availableCards.length === 0 ? (
            <div className="rounded-[26px] border border-dashed border-slate-300 bg-white p-8 text-sm font-semibold text-slate-500">
              No matching job cards were returned by the API.
            </div>
          ) : availableCards.map((job) => (
            <button
              key={job.id}
              className={`group relative overflow-hidden rounded-[26px] border border-slate-200 bg-gradient-to-br ${job.accent} p-8 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl`}
              onClick={() =>
                onCreateJob({
                  jobName: job.job.jobNumber || job.label,
                  process: job.label,
                  jobId: job.id,
                  machine: job.job.machineCode || "",
                  processName: job.job.processName,
                  jobNumber: job.job.jobNumber,
                  status: job.job.status,
                  productCode: job.job.productCode,
                  products: job.job.batches || [],
                })
              }
            >
              <div className="absolute right-0 top-0 h-24 w-24 -translate-y-6 translate-x-6 rounded-full bg-white/70 transition group-hover:bg-green-50" />
              <div className="relative z-10">
                <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                  Operator Job Card
                </div>
                <div className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  {job.label.toUpperCase()}
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-500">
                  {job.job.jobNumber} · {job.job.productDescription}
                </p>
              </div>
              <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-green-700 transition-all duration-500 group-hover:w-full" />
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DigitalJobCard;
