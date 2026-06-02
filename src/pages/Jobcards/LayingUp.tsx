// @ts-nocheck
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

type ModalMode = string | null;

type DecisionChoice = "rewind" | "rework" | "holdJob" | "deviation" | null;
type NextAfterRewind = "continue" | "rework";

const ORDER_LENGTH = 145;
const INPUT_DRUM_LOV = [
  "M4288/X -00190/2526-##659416--18-JUL-25",
  "M4212/X -00190/2526-##659446--18-JUL-25",
  "N4559/X -00190/2526-##659442--18-JUL-25",
  "L-01/11-2024",
  "LT24091033- 2",
];
const OUTPUT_DRUM_LOV = [
  "R-848/X -00190/25",
];

const actionCards: readonly ActionCardData[] = [
  { key: "start", title: "START", urdu: "شروع", subtitle: "Start setup", tone: "green", icon: LayoutGrid },
  { key: "startJob", title: "START JOB", urdu: "جاب شروع", subtitle: "Begin production", tone: "green2", icon: CheckCircle2 },
  { key: "stop", title: "STOP", urdu: "روکیں", subtitle: "Reason", tone: "red", icon: Siren },
  { key: "qcHold", title: "QC HOLD", urdu: "QC ہولڈ", subtitle: "Inspect", tone: "amber", icon: ShieldCheck },
  { key: "resume", title: "RESUME", urdu: "جاری رکھیں", subtitle: "After hold", tone: "emerald", icon: RotateCcw },
  { key: "complete", title: "COMPLETE", urdu: "جاب مکمل کریں", subtitle: "Complete Job", tone: "green2", icon: CheckCircle2 },
  { key: "changeDrum", title: "DRUM", urdu: "ڈرم تبدیل کریں", subtitle: "Change", tone: "slate", icon: RefreshCw },
  { key: "tooling", title: "TOOLING", urdu: "ٹولنگ", subtitle: "Die / core change", tone: "brown", icon: BookOpenText },
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
      <div className="w-[96vw] max-w-4xl rounded-[20px] bg-white p-4 shadow-2xl">
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

type DrumPickerProps = {
  label: string;
  helper?: string;
  items: string[];
  value: string[];
  onChange: (value: string[]) => void;
};

function DrumPicker({ label, helper, items, value, onChange }: DrumPickerProps) {
  const cleanItems = useMemo(
    () => Array.from(new Set(items.filter((item) => item && item.trim() !== ""))),
    [items]
  );

  const toggleItem = (item: string) => {
    if (value.includes(item)) {
      onChange(value.filter((x) => x !== item));
    } else {
      onChange([...value, item]);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="mb-3">
        <div className="text-xs font-black uppercase tracking-wider text-slate-500">
          {label}
        </div>

        {helper && (
          <div className="mt-0.5 text-[11px] font-semibold text-slate-400">
            {helper}
          </div>
        )}
      </div>

      <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2">
        <div className="grid gap-2">
          {cleanItems.map((item) => {
            const selected = value.includes(item);

            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleItem(item)}
                className={`flex min-h-[46px] items-center justify-between rounded-xl border px-3 py-2 text-left text-sm font-black transition ${
                  selected
                    ? "border-emerald-400 bg-emerald-50 text-emerald-900"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className="truncate">{item}</span>
                {selected && (
                  <span className="ml-2 shrink-0 text-emerald-700">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function LayingUp({ onLogout }: Props) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [status, setStatus] = useState<Status>("READY");
  const [setupSeconds, setSetupSeconds] = useState(0);
  const [producedLength, setProducedLength] = useState(0);
  const [workflow, setWorkflow] = useState<any>(null);
  const [showStartJobModal, setShowStartJobModal] = useState(false);
  const [decisionChoice, setDecisionChoice] = useState<DecisionChoice>(null);
  const [lockedDecisionAction, setLockedDecisionAction] = useState<"rewind" | "rework" | null>(null);
  const [nextAfterRewind, setNextAfterRewind] = useState<NextAfterRewind>("continue");
  const [toolingReason, setToolingReason] = useState("Die Linking Size");
  const [reason, setReason] = useState("QC Review");
  const [remarks, setRemarks] = useState("");
  const [lengthInput, setLengthInput] = useState("");
  const [inputDrum, setInputDrum] = useState<string[]>([]);
  const [outputDrum, setOutputDrum] = useState<string[]>([]);
  const [scanCode, setScanCode] = useState("");
  const [decisionComment, setDecisionComment] = useState("");
  const [stopReason, setStopReason] = useState("Management decision");
  const [events, setEvents] = useState<string[]>([]);
  const [inputDrumValue, setInputDrumValue] = useState<string[]>([]);
  const [outputDrumValue, setOutputDrumValue] = useState<string[]>([]);
  const [liveClock, setLiveClock] = useState(() => new Date());
  const [jobSeconds, setJobSeconds] = useState(0);

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
  const liveClockLabel = liveClock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const isStartJobWorkflow = workflow === "startJob";
  const modalTitle =
    workflow === "qcHold"
      ? "QC Hold"
      : workflow === "changeDrum"
        ? "Change Drum"
        : workflow === "fault"
          ? "Fault"
          : workflow === "materialIssue"
            ? "Material Issue"
            : workflow === "tooling"
              ? "Tooling"
              : workflow === "decision"
                ? "Decision"
                : workflow === "stop"
                  ? "Stop Job"
                  : isStartJobWorkflow
                    ? "Start Job"
                    : workflow === "complete"
                      ? "Complete Job"
                      : workflow === "rewind"
                        ? "Rewind"
                        : "Rework";

  const pushEvent = (msg: string) =>
    setEvents((prev) => [`${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ${msg}`, ...prev]);

  const openWorkflow = (mode: ModalMode) => {
    setWorkflow(mode);
    setReason("QC Review");
    setRemarks("");
    setLengthInput("");
    setInputDrum([]);
    setOutputDrum([]);
    setScanCode("");
    setToolingReason("Die Linking Size");
    setDecisionComment("");
    setDecisionChoice(null);
    setNextAfterRewind("continue");
    if (mode === "changeDrum") {
      setInputDrum(inputDrumValue);
      setOutputDrum(outputDrumValue);
    }
    if (mode === "stop") {
      setReason("Management decision");
      setStopReason("Management decision");
    }
    if (mode === "startJob") {
      setLengthInput("0");
      setInputDrum([]);
      setOutputDrum([]);
      setScanCode("");
      setRemarks("");
      setShowStartJobModal(true);
    }
    if (mode === "fault") {
      setReason("Electrical fault");
    }
    if (mode === "materialIssue") {
      setReason("Material shortage");
    }
    if (mode === "tooling") {
      setToolingReason("Die Linking Size");
    }
  };

  const closeWorkflow = () => setWorkflow(null);
  const closeStartJobModal = () => {
    setShowStartJobModal(false);
    setWorkflow(null);
  };

  const commitStartJob = () => {
    setInputDrumValue(inputDrum);
    setOutputDrumValue(outputDrum);

    setStatus("RUNNING");
    setLockedDecisionAction(null);
    setProducedLength(0);
    setLengthInput("0");

    pushEvent(
      `Start Job committed: ${inputDrum.length > 0 ? inputDrum.join(", ") : "No input drum"
      } -> ${outputDrum.length > 0 ? outputDrum.join(", ") : "No output drum"
      }`
    );

    pushEvent("Meter reading recorded at 0 m");
    pushEvent(`Setup completed in ${setupTimeLabel}`);

    setShowStartJobModal(false);
    setWorkflow(null);
  };

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
      const nextInputDrum = inputDrum.filter((item) => item && item.trim() !== "");
      const nextOutputDrum = outputDrum.filter((item) => item && item.trim() !== "");
      if (nextInputDrum.length > 0) setInputDrumValue(nextInputDrum);
      if (nextOutputDrum.length > 0) setOutputDrumValue(nextOutputDrum);
      pushEvent(`Drum changed ${scanCode ? `(Scan: ${scanCode})` : ""}: ${nextInputDrum.length ? nextInputDrum.join(", ") : "IN"} -> ${nextOutputDrum.length ? nextOutputDrum.join(", ") : "OUT"} | ${lengthInput || producedLength} m`);
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

    if (workflow === "tooling") {
      if (!Number.isNaN(numericLength) && lengthInput.trim()) setProducedLength(Math.max(0, numericLength));
      setStatus("RUNNING");
      pushEvent(`Tooling committed at ${lengthInput || producedLength} m: ${toolingReason}${remarks ? ` | ${remarks}` : ""}`);
    }

    if (workflow === "decision") {
      pushEvent(`Decision committed: ${decisionChoice || "none"}${decisionComment ? ` | ${decisionComment}` : ""}`);
      setLockedDecisionAction(decisionChoice === "rewind" || decisionChoice === "rework" ? decisionChoice : null);
      setStatus("DECISION_PENDING");
      setWorkflow(null);
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
      setLockedDecisionAction(null);
      pushEvent(`Rewind committed at ${lengthInput || producedLength} m | next: ${nextAfterRewind}`);
    }

    if (workflow === "rework") {
      if (!Number.isNaN(numericLength) && lengthInput.trim()) setProducedLength(Math.max(0, numericLength));
      setStatus("REWORKING");
      setLockedDecisionAction(null);
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
        tooling: true,
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
        tooling: true,
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
        tooling: true,
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
        tooling: true,
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
        tooling: false,
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
        tooling: true,
        rewind: lockedDecisionAction !== "rewind",
        rework: lockedDecisionAction !== "rework",
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
        tooling: true,
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
        tooling: true,
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
        tooling: false,
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
        tooling: false,
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
        tooling: false,
        rewind: true,
        rework: true,
        breakdown: false,
        materialIssue: false,
        decisionPending: false,
      };
    }

    return { start: true, startJob: true };
  }, [status, stopReason, lockedDecisionAction, nextAfterRewind, isStartup, isSetupActive, isRunning]);

  const handleAction = (key: ActionKey) => {
    if (key === "start") {
      const settingTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setStatus("SETUP");
      setLockedDecisionAction(null);
      setSetupSeconds(0);
      setProducedLength(0);
      setJobSeconds(0);
      pushEvent(`Setup Time Started at ${settingTime}`);
      return;
    }

    if (key === "startJob") {
      setWorkflow("startJob");
      setShowStartJobModal(true);
      setLengthInput("0");
      setInputDrum(inputDrumValue);
      setOutputDrum(outputDrumValue);
      setScanCode("");
      setRemarks("");
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
    if (key === "tooling") return openWorkflow("tooling");
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

  useEffect(() => {
    if (!isRunning) return;

    const timer = window.setInterval(() => {
      setJobSeconds((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    const clockTimer = window.setInterval(() => setLiveClock(new Date()), 1000);
    return () => {
      window.clearInterval(clockTimer);
    };
  }, []);

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
                  <span className="text-[9px] font-bold text-white/70">Order Length / آرڈر لمبائی</span>
                  <span className="text-[13px] font-black">{ORDER_LENGTH} m</span>
                </div>
              </div>
              <div className="rounded-xl bg-white/10 px-2 py-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-bold text-white/70">Planned Hours / منصوبہ بند گھنٹے</span>
                  <span className="text-[13px] font-black">3085</span>
                </div>
              </div>
              <div className="rounded-xl bg-white/10 px-2 py-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-bold text-white/70">Size / سائز</span>
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

        <section className="grid gap-2 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <div className="text-[13px] font-black">Drum Traceability</div>
                <div className="text-[10px] text-slate-500">Input and output drums</div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 p-2">
              <div className="mb-1 text-[11px] font-black">INPUT</div>

              {inputDrumValue.length > 0 &&
                inputDrumValue.map((drum) => (
                  <div key={drum} className="truncate text-[11px] font-black">
                    {drum}
                  </div>
                ))}

              <div className="mt-1 rounded-lg bg-slate-50 px-2 py-1 text-center text-[10px] font-black">
                Total: {inputDrumValue.length}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-2">
              <div className="mb-1 text-[11px] font-black">OUTPUT</div>

              {outputDrumValue.length > 0 &&
                outputDrumValue.map((drum) => (
                  <div key={drum} className="truncate text-[11px] font-black">
                    {drum}
                  </div>
                ))}

              <div className="mt-1 rounded-lg bg-slate-50 px-2 py-1 text-center text-[10px] font-black">
                Total: {outputDrumValue.length}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm">
            <div className="mb-1 text-[12px] font-black">Event Log</div>
            <div className="max-h-40 overflow-y-auto pr-1">
              <div className="grid gap-0.5">
                {events.length === 0 ? (
                  <div className="text-[10px] font-semibold text-slate-400">No events yet.</div>
                ) : (
                  events.map((entry) => (
                    <div key={entry} className="text-[10px] font-semibold text-slate-600">
                      {entry}
                    </div>
                  ))
                )}
              </div>
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
                JOB TIMER: <b>{String(Math.floor(jobSeconds / 60)).padStart(2, "0")}:{String(jobSeconds % 60).padStart(2, "0")}</b>
              </span>
              <button onClick={() => pushEvent("Refresh clicked")} className="grid h-7 w-7 place-items-center rounded-full border border-slate-200">
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </footer>
      </div>

      {showStartJobModal && (
        <Modal title="Start Job" sub="Enter drums and confirm the zero meter reading." onClose={closeStartJobModal}>
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <DrumPicker
                label="Input Drum / ان پٹ ڈرم"
                helper="Select one or more input drums"
                items={INPUT_DRUM_LOV}
                value={inputDrum}
                onChange={setInputDrum}
              />

              <DrumPicker
                label="Output Drum / آؤٹ پٹ ڈرم"
                helper="Select one or more output drums"
                items={OUTPUT_DRUM_LOV}
                value={outputDrum}
                onChange={setOutputDrum}
              />
            </div>

            <label className="flex flex-col">
              <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">
                Meter Reading / میٹر ریڈنگ
              </div>
              <input value="0" readOnly className={fieldClassName()} />
            </label>

            <button onClick={commitStartJob} className="rounded-2xl bg-green-700 py-3 font-black text-white">
              Commit
            </button>
          </div>
        </Modal>
      )}

      {workflow && workflow !== "startJob" && (
        <Modal
          title={modalTitle}
          sub="Fill the fields and commit the action."
          onClose={closeWorkflow}
        >
          <div className="grid gap-4">
            {(isStartJobWorkflow || workflow === "qcHold" || workflow === "fault" || workflow === "materialIssue" || workflow === "stop" || workflow === "complete" || workflow === "rewind" || workflow === "rework") && (
              <label className="block">
                <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">
                  {workflow === "complete" || workflow === "rewind" || workflow === "rework" ? "Length (m)" : "Length (m)"}
                </div>
                <input value={lengthInput} onChange={(e) => setLengthFromInput(e.target.value)} type="number" className={fieldClassName()} placeholder="Enter length" />
              </label>
            )}

            {isStartJobWorkflow && (
              <div className="grid gap-4 md:grid-cols-2">
                <DrumPicker
                  label="Input Drum / ان پٹ ڈرم"
                  helper="Select one or more input drums"
                  items={INPUT_DRUM_LOV}
                  value={inputDrum}
                  onChange={setInputDrum}
                />
                <DrumPicker
                  label="Output Drum / آؤٹ پٹ ڈرم"
                  helper="Select one or more output drums"
                  items={OUTPUT_DRUM_LOV}
                  value={outputDrum}
                  onChange={setOutputDrum}
                />
                <label className="block md:col-span-2">
                  <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Meter Reading / میٹر ریڈنگ</div>
                  <input value="0" readOnly className={fieldClassName()} />
                </label>
              </div>
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
                      <option value="Wrong spool">un identified kundies</option>
                      <option value="Wrong spool">Wrong Spool</option>
                      <option value="Wrong spool">No Feed</option>
                      <option value="Wrong spool">Quality Issues</option>
                    </>
                  )}
                  {workflow === "stop" && (
                    <>
                      <option value="Management decision">Management decision</option>
                      <option value="Setup issue">Prayer Time</option>
                      <option value="Setup issue">Meal Time</option>
                      <option value="Setup issue">Purging /Color Change</option>
                    </>
                  )}
                </select>
              </label>
            )}

            {workflow === "tooling" && (
              <label className="block">
                <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Tooling Reason / وجہ</div>
                <select
                  value={toolingReason}
                  onChange={(e) => setToolingReason(e.target.value)}
                  className={fieldClassName()}
                >
                  <option value="Die Linking Size">Die Linking Size / ڈائی لنکنگ سائز</option>
                  <option value="Die/Core Change">Die/Core Change / ڈائی / کور چینج</option>
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
                <DrumPicker
                  label="Input Drum / ان پٹ ڈرم"
                  helper="Update one or more input drums"
                  items={INPUT_DRUM_LOV}
                  value={inputDrum}
                  onChange={setInputDrum}
                />
                <DrumPicker
                  label="Output Drum / آؤٹ پٹ ڈرم"
                  helper="Update one or more output drums"
                  items={OUTPUT_DRUM_LOV}
                  value={outputDrum}
                  onChange={setOutputDrum}
                />
                <label className="block">
                  <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Scan</div>
                  <input value={scanCode} onChange={(e) => setScanCode(e.target.value)} className={fieldClassName()} placeholder="Scan code" />
                </label>
                <label className="block">
                  <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Length (m) / لمبائی</div>
                  <input value={lengthInput} onChange={(e) => setLengthFromInput(e.target.value)} type="number" className={fieldClassName()} placeholder="Enter length" />
                </label>
              </div>
            )}

            {workflow === "tooling" && (
              <div className="grid gap-4">
                <label className="block">
                  <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Length (m) / لمبائی</div>
                  <input
                    value={lengthInput}
                    onChange={(e) => setLengthFromInput(e.target.value)}
                    type="number"
                    className={fieldClassName()}
                    placeholder="Enter length"
                  />
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
