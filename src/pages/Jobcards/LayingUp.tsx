import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  Bell,
  BookOpenText,
  Building2,
  CheckCircle2,
  Clock3,
  LayoutGrid,
  LogOut,
  Plus,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Siren,
  UserCircle2,
  UserRound,
  X,
} from "lucide-react";
import VoiceComponent from "../jobcardlayout/Instructions";
import LayingUpActionPanel, { type ActionCardData, type ActionKey } from "./LayingUpActionPanel";

type Props = { onBack?: () => void; data?: any; crewNo?: string; onLogout?: () => void };
type Status =
  | "READY"
  | "SETUP"
  | "RUNNING"
  | "QC_HOLD"
  | "STOPPED"
  | "FAULT"
  | "MATERIAL_ISSUE"
  | "DECISION_PENDING"
  | "REWINDING"
  | "REWORKING"
  | "RUNNING_REWIND"
  | "RUNNING_REWORK"
  | "COMPLETED";

type ModalMode =
  | "qcHold"
  | "changeDrum"
  | "fault"
  | "materialIssue"
  | "decision"
  | "stop"
  | "complete"
  | "rewind"
  | "rework"
  | null;

type DecisionChoice = "rewind" | "rework" | "holdJob" | "deviation" | null;
type NextAfterRewind = "continue" | "rework";

const ORDER_LENGTH = 145;

const actionCards: readonly ActionCardData[] = [
  { key: "start", title: "START", urdu: "شروع", subtitle: "Start setup", tone: "green", icon: LayoutGrid },
  { key: "startJob", title: "START JOB", urdu: "جاب شروع", subtitle: "Begin production", tone: "green2", icon: CheckCircle2 },
  { key: "stop", title: "STOP", urdu: "روکیں", subtitle: "Reason", tone: "red", icon: Siren },
  { key: "qcHold", title: "QC HOLD", urdu: "QC ہولڈ", subtitle: "Inspect", tone: "amber", icon: ShieldCheck },
  { key: "resume", title: "RESUME", urdu: "جاری رکھیں", subtitle: "After hold", tone: "emerald", icon: RotateCcw },
  { key: "complete", title: "COMPLETE", urdu: "مکمل", subtitle: "Complete Job", tone: "green2", icon: CheckCircle2 },
  { key: "changeDrum", title: "DRUM", urdu: "ڈرم", subtitle: "Change", tone: "slate", icon: RefreshCw },
  { key: "rewind", title: "REWIND", urdu: "ری وائنڈ", subtitle: "Approval", tone: "violet", icon: RotateCcw },
  { key: "rework", title: "REWORK", urdu: "ری ورک", subtitle: "Approval", tone: "orange", icon: Plus },
  { key: "breakdown", title: "FAULT", urdu: "خرابی", subtitle: "Breakdown", tone: "red2", icon: Siren },
  { key: "materialIssue", title: "MATERIAL", urdu: "میٹریل", subtitle: "Issue", tone: "amber2", icon: Bell },
  { key: "decisionPending", title: "DECISION", urdu: "فیصلہ", subtitle: "Supervisor", tone: "brown", icon: Clock3 },
] as const;

function TopInfoCard({
  label,
  value,
  sub,
  icon: Icon,
  green = false,
}: {
  label: string;
  value: string;
  sub: string;
  icon: ComponentType<{ className?: string }>;
  green?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-2 py-2 shadow-sm">
      <div className="flex items-center gap-2">
        <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${green ? "bg-emerald-50" : "bg-slate-100"}`}>
          <Icon className={`h-4 w-4 ${green ? "text-emerald-700" : "text-slate-700"}`} />
        </div>
        <div className="min-w-0">
          <div className="truncate text-[9px] font-black uppercase leading-none text-slate-500">{label}</div>
          <div className="truncate text-[12px] font-black leading-tight">{value}</div>
          <div className="truncate text-[10px] font-semibold leading-tight text-slate-500">{sub}</div>
        </div>
      </div>
    </div>
  );
}

function Modal({
  title,
  sub,
  children,
  onClose,
}: {
  title: string;
  sub: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-3">
      <div className="w-full max-w-3xl rounded-[20px] bg-white p-4 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="text-xl font-black">{title}</div>
            <div className="text-sm font-bold text-slate-500">{sub}</div>
          </div>
          <button onClick={onClose} className="rounded-xl border border-slate-200 p-2">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function fieldClassName() {
  return "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-black outline-none focus:border-emerald-400";
}

export default function LayingUp({ onLogout }: Props) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [status, setStatus] = useState<Status>("READY");
  const [setupSeconds, setSetupSeconds] = useState(0);
  const [producedLength, setProducedLength] = useState(0);
  const [workflow, setWorkflow] = useState<ModalMode>(null);
  const [decisionChoice, setDecisionChoice] = useState<DecisionChoice>(null);
  const [nextAfterRewind, setNextAfterRewind] = useState<NextAfterRewind>("continue");
  const [reason, setReason] = useState("QC Review");
  const [remarks, setRemarks] = useState("");
  const [lengthInput, setLengthInput] = useState("");
  const [inputDrum, setInputDrum] = useState("");
  const [outputDrum, setOutputDrum] = useState("");
  const [scanCode, setScanCode] = useState("");
  const [decisionComment, setDecisionComment] = useState("");
  const [stopReason, setStopReason] = useState("Management decision");
  const [events, setEvents] = useState<string[]>([]);

  const statusText = useMemo(() => {
    switch (status) {
      case "SETUP":
        return "SETUP";
      case "RUNNING":
        return "RUNNING";
      case "QC_HOLD":
        return "QC HOLD";
      case "STOPPED":
        return "STOPPED";
      case "FAULT":
        return "FAULT";
      case "MATERIAL_ISSUE":
        return "MATERIAL ISSUE";
      case "DECISION_PENDING":
        return "DECISION";
      case "REWINDING":
        return "REWINDING";
      case "REWORKING":
        return "REWORKING";
      case "RUNNING_REWIND":
      case "RUNNING_REWORK":
        return "RUNNING";
      case "COMPLETED":
        return "COMPLETED";
      default:
        return "READY";
    }
  }, [status]);

  const progress = Math.max(0, Math.min(100, Math.round((producedLength / ORDER_LENGTH) * 100)));
  const setupTimeLabel = `${String(Math.floor(setupSeconds / 60)).padStart(2, "0")}:${String(setupSeconds % 60).padStart(2, "0")}`;

  const pushEvent = (msg: string) =>
    setEvents((prev) => [`${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ${msg}`, ...prev]);

  const openWorkflow = (mode: ModalMode) => {
    setWorkflow(mode);
    setReason("QC Review");
    setRemarks("");
    setLengthInput("");
    setInputDrum("");
    setOutputDrum("");
    setScanCode("");
    setDecisionComment("");
    setDecisionChoice(null);
    setNextAfterRewind("continue");
    if (mode === "stop") {
      setReason("Management decision");
      setStopReason("Management decision");
    }
    if (mode === "fault") {
      setReason("Electrical fault");
    }
    if (mode === "materialIssue") {
      setReason("Material shortage");
    }
  };

  const closeWorkflow = () => setWorkflow(null);

  const setLengthFromInput = (value: string) => {
    setLengthInput(value);
    const numeric = Number(value);
    if (!Number.isNaN(numeric) && value.trim() !== "") {
      setProducedLength(Math.max(0, numeric));
    }
  };

  const finalizeWorkflow = () => {
    const numericLength = Number(lengthInput);

    if (workflow === "qcHold") {
      if (!Number.isNaN(numericLength) && lengthInput.trim()) setProducedLength(Math.max(0, numericLength));
      setStatus("QC_HOLD");
      pushEvent(`QC Hold committed at ${lengthInput || producedLength} m: ${reason}${remarks ? ` | ${remarks}` : ""}`);
    }

    if (workflow === "changeDrum") {
      if (!Number.isNaN(numericLength) && lengthInput.trim()) setProducedLength(Math.max(0, numericLength));
      pushEvent(`Drum changed ${scanCode ? `(Scan: ${scanCode})` : ""}: ${inputDrum || "IN"} -> ${outputDrum || "OUT"} | ${lengthInput || producedLength} m`);
      setStatus("RUNNING");
    }

    if (workflow === "fault") {
      if (!Number.isNaN(numericLength) && lengthInput.trim()) setProducedLength(Math.max(0, numericLength));
      setStatus("FAULT");
      pushEvent(`Fault logged at ${lengthInput || producedLength} m: ${reason}${remarks ? ` | ${remarks}` : ""}`);
    }

    if (workflow === "materialIssue") {
      if (!Number.isNaN(numericLength) && lengthInput.trim()) setProducedLength(Math.max(0, numericLength));
      setStatus("MATERIAL_ISSUE");
      pushEvent(`Material issue at ${lengthInput || producedLength} m: ${reason}${remarks ? ` | ${remarks}` : ""}`);
    }

    if (workflow === "decision") {
      pushEvent(`Decision committed: ${decisionChoice || "none"}${decisionComment ? ` | ${decisionComment}` : ""}`);
      setStatus("DECISION_PENDING");
    }

    if (workflow === "stop") {
      setStatus("STOPPED");
      pushEvent(`Stop job committed: ${stopReason}${remarks ? ` | ${remarks}` : ""}`);
    }

    if (workflow === "complete") {
      if (!Number.isNaN(numericLength) && lengthInput.trim()) setProducedLength(Math.max(0, numericLength));
      setStatus("COMPLETED");
      pushEvent(`Job completed at ${lengthInput || producedLength} m${remarks ? ` | ${remarks}` : ""}`);
    }

    if (workflow === "rewind") {
      if (!Number.isNaN(numericLength) && lengthInput.trim()) setProducedLength(Math.max(0, numericLength));
      setStatus(nextAfterRewind === "rework" ? "REWORKING" : "REWINDING");
      pushEvent(`Rewind committed at ${lengthInput || producedLength} m | next: ${nextAfterRewind}`);
    }

    if (workflow === "rework") {
      if (!Number.isNaN(numericLength) && lengthInput.trim()) setProducedLength(Math.max(0, numericLength));
      setStatus("REWORKING");
      pushEvent(`Rework committed at ${lengthInput || producedLength} m${remarks ? ` | ${remarks}` : ""}`);
    }

    setWorkflow(null);
  };

  const isStartup = status === "READY";
  const isSetupActive = status === "SETUP";
  const isRunning = status === "RUNNING";
  const disabledKeys = useMemo<Partial<Record<ActionKey, boolean>>>(() => {
    if (status === "COMPLETED") {
      return {
        start: true,
        startJob: true,
        stop: true,
        qcHold: true,
        resume: true,
        complete: true,
        changeDrum: true,
        rewind: true,
        rework: true,
        breakdown: true,
        materialIssue: true,
        decisionPending: true,
      };
    }

    if (isStartup) {
      return {
        startJob: true,
        stop: true,
        qcHold: true,
        resume: true,
        complete: true,
        changeDrum: true,
        rewind: true,
        rework: true,
        breakdown: true,
        materialIssue: true,
        decisionPending: true,
      };
    }

    if (isSetupActive) {
      return {
        start: true,
        stop: true,
        qcHold: true,
        resume: true,
        complete: true,
        changeDrum: true,
        rewind: true,
        rework: true,
        breakdown: true,
        materialIssue: true,
        decisionPending: true,
      };
    }

    if (status === "QC_HOLD") {
      return {
        start: true,
        startJob: true,
        stop: true,
        qcHold: true,
        resume: false,
        complete: true,
        changeDrum: true,
        rewind: true,
        rework: true,
        breakdown: true,
        materialIssue: true,
        decisionPending: true,
      };
    }

    if (status === "FAULT" || status === "MATERIAL_ISSUE" || status === "STOPPED") {
      const allowDecision = status !== "STOPPED" || ["Management decision", "Setup issue"].includes(stopReason);
      return {
        start: true,
        startJob: true,
        stop: true,
        qcHold: true,
        resume: false,
        complete: true,
        changeDrum: true,
        rewind: true,
        rework: true,
        breakdown: true,
        materialIssue: true,
        decisionPending: !allowDecision ? true : false,
      };
    }

    if (status === "DECISION_PENDING") {
      return {
        start: true,
        startJob: true,
        stop: true,
        qcHold: true,
        resume: false,
        complete: true,
        changeDrum: true,
        rewind: decisionChoice !== "rewind",
        rework: decisionChoice !== "rework",
        breakdown: true,
        materialIssue: true,
        decisionPending: false,
      };
    }

    if (status === "REWINDING") {
      return {
        start: true,
        startJob: true,
        stop: true,
        qcHold: true,
        resume: false,
        complete: true,
        changeDrum: true,
        rewind: true,
        rework: true,
        breakdown: true,
        materialIssue: true,
        decisionPending: true,
      };
    }

    if (status === "REWORKING") {
      return {
        start: true,
        startJob: true,
        stop: true,
        qcHold: true,
        resume: false,
        complete: true,
        changeDrum: true,
        rewind: true,
        rework: true,
        breakdown: true,
        materialIssue: true,
        decisionPending: true,
      };
    }

    if (status === "RUNNING_REWIND") {
      return {
        start: true,
        startJob: true,
        stop: false,
        qcHold: false,
        resume: true,
        complete: false,
        changeDrum: false,
        rewind: true,
        rework: true,
        breakdown: false,
        materialIssue: false,
        decisionPending: false,
      };
    }

    if (status === "RUNNING_REWORK") {
      return {
        start: true,
        startJob: true,
        stop: false,
        qcHold: false,
        resume: true,
        complete: false,
        changeDrum: false,
        rewind: true,
        rework: true,
        breakdown: false,
        materialIssue: false,
        decisionPending: false,
      };
    }

    if (isRunning) {
      return {
        start: true,
        startJob: true,
        stop: false,
        qcHold: false,
        resume: true,
        complete: false,
        changeDrum: false,
        rewind: true,
        rework: true,
        breakdown: false,
        materialIssue: false,
        decisionPending: false,
      };
    }

    return { start: true, startJob: true };
  }, [status, stopReason, decisionChoice, nextAfterRewind, isStartup, isSetupActive, isRunning]);

  const handleAction = (key: ActionKey) => {
    if (key === "start") {
      const settingTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setStatus("SETUP");
      setSetupSeconds(0);
      setProducedLength(0);
      pushEvent(`Setup Time Started at ${settingTime}`);
      return;
    }

    if (key === "startJob") {
      setStatus("RUNNING");
      setProducedLength(0);
      pushEvent(`Setup completed in ${setupTimeLabel}`);
      pushEvent("Meter reading recorded at 0 m");
      pushEvent("Job started");
      return;
    }

    if (key === "stop") return openWorkflow("stop");
    if (key === "qcHold") return openWorkflow("qcHold");
    if (key === "resume") {
      if (status === "QC_HOLD" || status === "STOPPED" || status === "FAULT" || status === "MATERIAL_ISSUE") {
        setStatus("RUNNING");
        pushEvent("Resume pressed");
      }
      if (status === "REWINDING") {
        setStatus(nextAfterRewind === "rework" ? "RUNNING_REWORK" : "RUNNING_REWIND");
        pushEvent("Resume pressed");
      }
      if (status === "REWORKING") {
        setStatus("RUNNING_REWORK");
        pushEvent("Resume pressed");
      }
      return;
    }
    if (key === "complete") return openWorkflow("complete");
    if (key === "changeDrum") return openWorkflow("changeDrum");
    if (key === "rewind") return openWorkflow("rewind");
    if (key === "rework") return openWorkflow("rework");
    if (key === "breakdown") return openWorkflow("fault");
    if (key === "materialIssue") return openWorkflow("materialIssue");
    if (key === "decisionPending") return openWorkflow("decision");
  };

  useEffect(() => {
    if (!isSetupActive) return;

    const timer = window.setInterval(() => {
      setSetupSeconds((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isSetupActive]);

  return (
    <div className="min-h-screen bg-[#f4f6f8] p-2 text-slate-950" style={{ fontFamily: "Ubuntu, sans-serif" }}>
      <div className="mx-auto flex max-w-[1400px] flex-col gap-2">
        <header className="sticky top-1 z-30 rounded-2xl border border-slate-200 bg-white/95 px-2 py-1.5 shadow-sm backdrop-blur">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <div className="truncate text-[15px] font-black tracking-tight">PAKISTAN CABLES LIMITED</div>
            </div>

            <div className="rounded-full bg-slate-100 px-3 py-1 text-[13px] font-black tracking-tight">LAYING UP</div>

            <div className="flex items-center justify-end gap-1.5">
              <button className="rounded-full border border-amber-700 bg-amber-700 px-3 py-1.5 text-[11px] font-black text-white shadow-sm">
                ⌛ {statusText}
              </button>
              <button onClick={() => pushEvent("Refreshed")} className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white">
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowInstructions((v) => !v)}
                className="inline-flex h-8 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-[11px] font-black text-slate-700 shadow-sm"
              >
                <BookOpenText className="h-4 w-4" />
                Instructions
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((v) => !v)}
                  className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white shadow-sm"
                  aria-label="Profile menu"
                >
                  <UserCircle2 className="h-5 w-5 text-slate-700" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-10 z-40 w-40 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <div className="border-b border-slate-100 px-3 py-2">
                      <div className="text-[11px] font-black uppercase tracking-wide text-slate-500">Account</div>
                      <div className="text-[13px] font-black text-slate-950">Operator</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        onLogout?.();
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] font-bold text-slate-700 hover:bg-slate-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-2 xl:grid-cols-[1.55fr_1fr]">
          <div className="rounded-2xl bg-[linear-gradient(135deg,#0d8c35_0%,#0a6f2b_100%)] p-3 text-white shadow-lg">
            <div className="grid grid-cols-[1fr_210px] gap-3">
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wide text-white/85">Product</div>
                <div className="mt-0.5 text-[15px] font-black leading-tight">CU/PVC/SWA/PVC 3x50 MM² 600/1000 V</div>
                <div className="mt-2 grid gap-x-3 gap-y-0.5 text-[11px] font-bold sm:grid-cols-3">
                  <div className="truncate">Job: PC-03447/2526</div>
                  <div className="truncate">Batch: PCF-BED-150-1-EXTD26-180565</div>
                  <div className="truncate">WO: X-06357/2526</div>
                </div>
              </div>

              <div className="text-left">
                <div className="flex items-end justify-start gap-2">
                  <div>
                    <div className="text-[10px] font-bold text-white/75">Progress</div>
                    <div className="text-[32px] font-black leading-none">{progress}%</div>
                  </div>
                  <div className="pb-1 text-[12px] font-black">{producedLength.toFixed(1)} m / {ORDER_LENGTH} m</div>
                </div>
                <div className="mt-2 h-3 rounded-full border border-white/30 bg-white/25 p-0.5">
                  <div className="h-full rounded-full bg-lime-400" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2 text-left">
              <div className="rounded-xl bg-white/10 px-2 py-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-bold text-white/70">Order Length</span>
                  <span className="text-[13px] font-black">{ORDER_LENGTH} m</span>
                </div>
              </div>
              <div className="rounded-xl bg-white/10 px-2 py-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-bold text-white/70">Planned Hours</span>
                  <span className="text-[13px] font-black">3085</span>
                </div>
              </div>
              <div className="rounded-xl bg-white/10 px-2 py-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-bold text-white/70">Size</span>
                  <span className="text-[13px] font-black">50 mm²</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <TopInfoCard label="Machine" value="SIPOLAS" sub="Extrusion" icon={Building2} />
            <TopInfoCard label="Shift" value="Shift A" sub="18:11" icon={Clock3} />
            <TopInfoCard label="Operator" value="Ali Raza" sub="Supervisor: Ahmed Khan" icon={UserRound} />
            <TopInfoCard label="QC" value="OK" sub="Approved" icon={CheckCircle2} green />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <button type="button" className="flex w-full items-center justify-between rounded-2xl px-3 py-2">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-blue-700" />
              <div className="text-[13px] font-black">Job Card Information</div>
            </div>
          </button>

          <div className="border-t border-slate-200 p-2 pt-1.5">
            <div className="grid grid-cols-4 gap-1.5 md:grid-cols-8">
              {[
                ["Input Lot / Drum No", "DR-2025-0556"],
                ["Length (m)", "148"],
                ["Color", "1"],
                ["Lay Length (m)", "145"],
                ["P/P tape size", "4 mm"],
                ["Overlap", "4 mm"],
                ["Lay direction", "RH"],
                ["OD", "24.25 mm"],
              ].map(([a, b]) => (
                <div key={a} className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5">
                  <div className="truncate text-[9px] font-black text-slate-500">{a}</div>
                  <div className="truncate text-[12px] font-black">{b}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <LayingUpActionPanel
            cards={actionCards}
            onAction={handleAction}
            disabledKeys={disabledKeys}
          />
        </section>

        {showInstructions && (
          <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-[14px] font-black">Instructions / ہدایات</div>
                <div className="text-[10px] text-slate-500">Record or type the instruction notes for this job card.</div>
              </div>
              <button
                type="button"
                onClick={() => setShowInstructions(false)}
                className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <VoiceComponent isUrdu={false} active={showInstructions} />
          </section>
        )}

        <section className="grid gap-2 lg:grid-cols-[1fr_1fr_1.15fr]">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="truncate text-[12px] font-black text-amber-900">CHECK EMBOSSING WHEEL & ALIGNMENT</div>
                <div className="text-[10px] font-semibold text-amber-700">Auto turn-off in</div>
              </div>
              <div className="text-[14px] font-black text-amber-700">OFF</div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <div className="text-[13px] font-black">Drum Traceability</div>
                <div className="text-[10px] text-slate-500">Input and output drums</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-slate-200 p-2">
                <div className="mb-1 text-[11px] font-black">INPUT</div>
                <div className="truncate text-[11px] font-black">DR-2025-0556</div>
                <div className="truncate text-[11px] font-black">DR-2025-0557</div>
                <div className="mt-1 rounded-lg bg-slate-50 px-2 py-1 text-center text-[10px] font-black">Total: 2</div>
              </div>
              <div className="rounded-xl border border-slate-200 p-2">
                <div className="mb-1 text-[11px] font-black">OUTPUT</div>
                <div className="truncate text-[11px] font-black">DR-2025-0778</div>
                <div className="mt-1 rounded-lg bg-slate-50 px-2 py-1 text-center text-[10px] font-black">Total: 1</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm">
            <div className="mb-1 text-[12px] font-black">Event Log</div>
            <div className="grid gap-0.5">
              {events.slice(0, 3).map((entry) => (
                <div key={entry} className="truncate text-[10px] font-semibold text-slate-600">
                  {entry}
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="sticky bottom-1 z-20 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <div className="grid grid-cols-3 items-center gap-2 text-[11px] font-bold text-slate-700">
            <div>
              MACHINE STATUS: <span className="font-black text-amber-700">{statusText}</span>
            </div>
            <div className="text-center">
              SETUP TIME: <b>{setupTimeLabel}</b>
            </div>
            <div className="flex items-center justify-end gap-2">
              <span>
                LAST SYNC: <b>11:28 AM</b>
              </span>
              <button onClick={() => pushEvent("Refreshed")} className="grid h-7 w-7 place-items-center rounded-full border border-slate-200">
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </footer>
      </div>

      {workflow && (
        <Modal
          title={
            workflow === "qcHold"
              ? "QC Hold"
              : workflow === "changeDrum"
                ? "Change Drum"
                : workflow === "fault"
                  ? "Fault"
                  : workflow === "materialIssue"
                    ? "Material Issue"
                    : workflow === "decision"
                      ? "Decision"
                      : workflow === "stop"
                        ? "Stop Job"
                        : workflow === "complete"
                          ? "Complete Job"
                          : workflow === "rewind"
                            ? "Rewind"
                            : "Rework"
          }
          sub="Fill the fields and commit the action."
          onClose={closeWorkflow}
        >
          <div className="grid gap-4">
            {(workflow === "qcHold" || workflow === "fault" || workflow === "materialIssue" || workflow === "stop" || workflow === "complete" || workflow === "rewind" || workflow === "rework") && (
              <label className="block">
                <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">
                  {workflow === "complete" || workflow === "rewind" || workflow === "rework" ? "Length (m)" : "Length (m)"}
                </div>
                <input value={lengthInput} onChange={(e) => setLengthFromInput(e.target.value)} type="number" className={fieldClassName()} placeholder="Enter length" />
              </label>
            )}

            {(workflow === "qcHold" || workflow === "fault" || workflow === "materialIssue" || workflow === "stop") && (
              <label className="block">
                <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Reason</div>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className={fieldClassName()}
                >
                  {workflow === "qcHold" && <option value="QC Review">QC Review</option>}
                  {workflow === "fault" && (
                    <>
                      <option value="Electrical fault">Electrical fault</option>
                      <option value="Mechanical fault">Mechanical fault</option>
                    </>
                  )}
                  {workflow === "materialIssue" && (
                    <>
                      <option value="Material shortage">Material shortage</option>
                      <option value="Wrong spool">Wrong spool</option>
                    </>
                  )}
                  {workflow === "stop" && (
                    <>
                      <option value="Management decision">Management decision</option>
                      <option value="Setup issue">Setup issue</option>
                    </>
                  )}
                </select>
              </label>
            )}

            {workflow === "stop" && (
              <label className="block">
                <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Stop Reason</div>
                <select
                  value={stopReason}
                  onChange={(e) => setStopReason(e.target.value)}
                  className={fieldClassName()}
                >
                  <option value="Management decision">Management decision</option>
                  <option value="Setup issue">Setup issue</option>
                </select>
              </label>
            )}

            {(workflow === "qcHold" || workflow === "fault" || workflow === "materialIssue" || workflow === "stop" || workflow === "complete" || workflow === "rewind" || workflow === "rework") && (
              <label className="block">
                <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Remarks</div>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="min-h-[96px] w-full rounded-2xl border border-slate-200 p-4 font-bold outline-none focus:border-emerald-400"
                />
              </label>
            )}

            {workflow === "changeDrum" && (
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Input Drum</div>
                  <input value={inputDrum} onChange={(e) => setInputDrum(e.target.value)} className={fieldClassName()} placeholder="Scan / enter input drum" />
                </label>
                <label className="block">
                  <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Output Drum</div>
                  <input value={outputDrum} onChange={(e) => setOutputDrum(e.target.value)} className={fieldClassName()} placeholder="Scan / enter output drum" />
                </label>
                <label className="block">
                  <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Scan</div>
                  <input value={scanCode} onChange={(e) => setScanCode(e.target.value)} className={fieldClassName()} placeholder="Scan code" />
                </label>
                <label className="block">
                  <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Length (m)</div>
                  <input value={lengthInput} onChange={(e) => setLengthFromInput(e.target.value)} type="number" className={fieldClassName()} placeholder="Enter length" />
                </label>
              </div>
            )}

            {workflow === "decision" && (
              <div className="grid gap-4">
                <div className="grid gap-2 md:grid-cols-4">
                  {[
                    { key: "rewind", label: "Send to Rewind" },
                    { key: "rework", label: "Send to Rework" },
                    { key: "holdJob", label: "Hold Job" },
                    { key: "deviation", label: "Deviation" },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setDecisionChoice(item.key as DecisionChoice)}
                      className={`rounded-2xl border px-4 py-3 text-left font-black ${decisionChoice === item.key ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <label className="block">
                  <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Comments</div>
                  <textarea
                    value={decisionComment}
                    onChange={(e) => setDecisionComment(e.target.value)}
                    className="min-h-[96px] w-full rounded-2xl border border-slate-200 p-4 font-bold outline-none focus:border-emerald-400"
                    placeholder="Add comments..."
                  />
                </label>
              </div>
            )}

            {workflow === "rework" && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">After commit</div>
                <div className="text-sm font-bold text-slate-700">Job will remain in rework until the operator resumes it.</div>
              </div>
            )}

            {workflow === "rewind" && (
              <div className="grid gap-3">
                <label className="block">
                  <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">After rewind</div>
                  <select value={nextAfterRewind} onChange={(e) => setNextAfterRewind(e.target.value as NextAfterRewind)} className={fieldClassName()}>
                    <option value="continue">Continue with job</option>
                    <option value="rework">Send to rework</option>
                  </select>
                </label>
              </div>
            )}
            <button onClick={finalizeWorkflow} className="rounded-2xl bg-green-700 py-3 font-black text-white">
              Commit
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
