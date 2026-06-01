import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, LayoutGrid, RefreshCw, RotateCcw, ShieldCheck, Siren, X } from "lucide-react";
import LayingUpActionPanel, { type ActionCardData, type ActionKey } from "./LayingUpActionPanel";

type Props = { onBack: () => void; data?: any; crewNo?: string; onLogout?: () => void };
type Status = "READY" | "SETUP" | "RUNNING" | "QC_HOLD" | "STOPPED" | "FAULT" | "COMPLETED";
type ModalMode = "startJob" | "stop" | "qcHold" | "complete" | "changeDrum" | "fault" | null;

const ORDER_LENGTH = 1000;
const PROCESS_KEY = "INSULATION";
const PROCESS_TITLE = "Insulation";
const DEFAULT_JOB_ID = "INS-001";
const DEFAULT_MACHINE = "M-88";
const DEFAULT_MACHINE_SUB = "Insulation";

const actionCards: readonly ActionCardData[] = [
  { key: "start", title: "START", urdu: "شروع", subtitle: "Start setup", tone: "green", icon: LayoutGrid },
  { key: "startJob", title: "START JOB", urdu: "جاب شروع", subtitle: "Begin production", tone: "green2", icon: CheckCircle2 },
  { key: "stop", title: "STOP", urdu: "رکیں", subtitle: "Reason", tone: "red", icon: Siren },
  { key: "qcHold", title: "QC HOLD", urdu: "QC ہولڈ", subtitle: "Inspect", tone: "amber", icon: ShieldCheck },
  { key: "resume", title: "RESUME", urdu: "جاری رکھیں", subtitle: "After hold", tone: "emerald", icon: RotateCcw },
  { key: "complete", title: "COMPLETE", urdu: "مکمل", subtitle: "Complete Job", tone: "green2", icon: CheckCircle2 },
  { key: "changeDrum", title: "DRUM", urdu: "ڈرم", subtitle: "Change", tone: "slate", icon: RefreshCw },
  { key: "breakdown", title: "FAULT", urdu: "خرابی", subtitle: "Breakdown", tone: "red2", icon: Siren },
] as const;

function fieldClassName() {
  return "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-black outline-none focus:border-emerald-400";
}

function Modal({ title, sub, children, onClose }: { title: string; sub: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-3">
      <div className="w-[96vw] max-w-2xl rounded-[20px] bg-white p-4 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="text-xl font-black">{title}</div>
            <div className="text-sm font-bold text-slate-500">{sub}</div>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 p-2">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5">
      <div className="truncate text-[9px] font-black text-slate-500">{label}</div>
      <div className="truncate text-[12px] font-black">{value}</div>
    </div>
  );
}

export default function Insulation({ onBack, data }: Props) {
  const [isUrdu, setIsUrdu] = useState(true);
  const [status, setStatus] = useState<Status>("READY");
  const [workflow, setWorkflow] = useState<ModalMode>(null);
  const [lengthInput, setLengthInput] = useState("");
  const [reason, setReason] = useState("QC Review");
  const [remarks, setRemarks] = useState("");
  const [inputDrum, setInputDrum] = useState("");
  const [outputDrum, setOutputDrum] = useState("");
  const [inputDrumValue, setInputDrumValue] = useState("");
  const [outputDrumValue, setOutputDrumValue] = useState("");
  const [liveClock, setLiveClock] = useState(() => new Date());
  const [events, setEvents] = useState<string[]>([]);
  const [setupSeconds, setSetupSeconds] = useState(0);
  const [producedLength, setProducedLength] = useState(0);
  const [embossingActive, setEmbossingActive] = useState(true);

  const progress = Math.max(0, Math.min(100, Math.round((producedLength / ORDER_LENGTH) * 100)));
  const statusText = useMemo(
    () =>
      status === "RUNNING"
        ? "RUNNING"
        : status === "SETUP"
          ? "SETUP"
          : status === "QC_HOLD"
            ? "QC HOLD"
            : status === "STOPPED"
              ? "STOPPED"
              : status === "FAULT"
                ? "FAULT"
                : status === "COMPLETED"
                  ? "COMPLETED"
                  : "READY",
    [status]
  );
  const setupTimeLabel = `${String(Math.floor(setupSeconds / 60)).padStart(2, "0")}:${String(setupSeconds % 60).padStart(2, "0")}`;
  const liveClockLabel = liveClock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const pushEvent = (msg: string) =>
    setEvents((prev) => [`${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ${msg}`, ...prev]);

  useEffect(() => {
    const clockTimer = window.setInterval(() => setLiveClock(new Date()), 1000);
    const embossTimer = window.setInterval(() => setEmbossingActive((prev) => !prev), 6000);
    return () => {
      window.clearInterval(clockTimer);
      window.clearInterval(embossTimer);
    };
  }, []);

  useEffect(() => {
    if (status !== "SETUP") return;
    const setupTimer = window.setInterval(() => setSetupSeconds((prev) => prev + 1), 1000);
    return () => window.clearInterval(setupTimer);
  }, [status]);

  const openWorkflow = (mode: ModalMode) => {
    setWorkflow(mode);
    setReason(mode === "fault" ? "Electrical fault" : mode === "stop" ? "Management decision" : "QC Review");
    setRemarks("");
    setLengthInput(mode === "startJob" ? "0" : "");

    if (mode === "startJob" || mode === "changeDrum") {
      setInputDrum(inputDrumValue);
      setOutputDrum(outputDrumValue);
    }
  };

  const commitStartJob = () => {
    const nextInputDrum = inputDrum.trim();
    const nextOutputDrum = outputDrum.trim();

    if (nextInputDrum) setInputDrumValue(nextInputDrum);
    if (nextOutputDrum) setOutputDrumValue(nextOutputDrum);

    setStatus("RUNNING");
    setProducedLength(0);
    setLengthInput("0");
    pushEvent(`Start Job committed: ${nextInputDrum || "-"} -> ${nextOutputDrum || "-"}`);
    pushEvent("Meter reading recorded at 0 m");
    pushEvent(`Setup completed in ${setupTimeLabel}`);
    setWorkflow(null);
  };

  const finalize = () => {
    const numericLength = Number(lengthInput);
    if (!Number.isNaN(numericLength) && lengthInput.trim()) setProducedLength(Math.max(0, numericLength));

    if (workflow === "changeDrum") {
      const nextInputDrum = inputDrum.trim();
      const nextOutputDrum = outputDrum.trim();
      if (nextInputDrum) setInputDrumValue(nextInputDrum);
      if (nextOutputDrum) setOutputDrumValue(nextOutputDrum);
      pushEvent(`Drum changed: ${nextInputDrum || inputDrumValue || "-"} -> ${nextOutputDrum || outputDrumValue || "-"} | ${lengthInput || producedLength} m`);
      setStatus("RUNNING");
    } else if (workflow === "qcHold") {
      setStatus("QC_HOLD");
      pushEvent(`QC Hold committed at ${lengthInput || producedLength} m: ${reason}${remarks ? ` | ${remarks}` : ""}`);
    } else if (workflow === "stop") {
      setStatus("STOPPED");
      pushEvent(`Stop job committed: ${reason}${remarks ? ` | ${remarks}` : ""}`);
    } else if (workflow === "fault") {
      setStatus("FAULT");
      pushEvent(`Fault logged at ${lengthInput || producedLength} m: ${reason}${remarks ? ` | ${remarks}` : ""}`);
    } else if (workflow === "complete") {
      setStatus("COMPLETED");
      pushEvent(`Job completed at ${lengthInput || producedLength} m${remarks ? ` | ${remarks}` : ""}`);
    }

    setWorkflow(null);
  };

  const handleAction = (key: ActionKey) => {
    if (key === "start") {
      setStatus("SETUP");
      setSetupSeconds(0);
      setProducedLength(0);
      pushEvent("Setup Time Started");
      return;
    }

    if (key === "startJob") return openWorkflow("startJob");
    if (key === "stop") return openWorkflow("stop");
    if (key === "qcHold") return openWorkflow("qcHold");
    if (key === "complete") return openWorkflow("complete");
    if (key === "changeDrum") return openWorkflow("changeDrum");
    if (key === "breakdown") return openWorkflow("fault");
    if (key === "resume") {
      setStatus("RUNNING");
      pushEvent("Resume pressed");
    }
  };

  const disabledKeys = useMemo<Partial<Record<ActionKey, boolean>>>(() => {
    if (status === "COMPLETED") {
      return { start: true, startJob: true, stop: true, qcHold: true, resume: true, complete: true, changeDrum: true, breakdown: true };
    }
    if (status === "READY") {
      return { startJob: true, stop: true, qcHold: true, resume: true, complete: true, changeDrum: true, breakdown: true };
    }
    if (status === "SETUP") {
      return { start: true, stop: true, qcHold: true, resume: true, complete: true, changeDrum: true, breakdown: true };
    }
    if (status === "QC_HOLD" || status === "STOPPED" || status === "FAULT") {
      return { start: true, startJob: true, stop: true, qcHold: true, resume: false, complete: true, changeDrum: true, breakdown: true };
    }
    return { start: true, startJob: true, resume: true };
  }, [status]);

  const modalTitle =
    workflow === "startJob"
      ? "Start Job / جاب شروع"
      : workflow === "complete"
        ? "Complete Job / مکمل"
        : workflow === "stop"
          ? "Stop Job / روکیں"
          : workflow === "qcHold"
            ? "QC Hold / QC ہولڈ"
            : workflow === "changeDrum"
              ? "Change Drum / ڈرم تبدیل"
              : "Fault / خرابی";

  return (
    <div className="min-h-screen bg-[#f4f6f8] p-2 text-slate-950" style={{ fontFamily: "Ubuntu, sans-serif" }}>
      <div className="mx-auto flex max-w-[1400px] flex-col gap-2">
        <header className="sticky top-1 z-30 rounded-2xl border border-slate-200 bg-white/95 px-2 py-1.5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <button onClick={onBack} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black">{"<-"} Back</button>
            <div className="text-center">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-green-700">{PROCESS_KEY}</div>
              <div className="text-lg font-black">{PROCESS_TITLE} Job Card</div>
            </div>
            <button onClick={() => setIsUrdu((prev) => !prev)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black">
              {isUrdu ? "English / اردو" : "اردو / English"}
            </button>
          </div>
        </header>

        <section className="grid gap-2 xl:grid-cols-[1.55fr_1fr]">
          <div className="rounded-2xl bg-[linear-gradient(135deg,#0d8c35_0%,#0a6f2b_100%)] p-3 text-white shadow-lg">
            <div className="grid grid-cols-[1fr_210px] gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wide text-white/85">Product</div>
                <div className="mt-0.5 text-[15px] font-black leading-tight">{data?.jobName || PROCESS_KEY}</div>
                <div className="mt-2 grid gap-x-3 gap-y-0.5 text-[11px] font-bold sm:grid-cols-3">
                  <div className="truncate">Job: {data?.jobId || DEFAULT_JOB_ID}</div>
                  <div className="truncate">Batch: {data?.process || PROCESS_TITLE}</div>
                  <div className="truncate">WO: {data?.machine || DEFAULT_MACHINE}</div>
                </div>
              </div>
              <div>
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
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-slate-200 bg-white px-2 py-2 shadow-sm"><div className="text-[9px] font-black uppercase text-slate-500">Machine</div><div className="text-[12px] font-black">{DEFAULT_MACHINE}</div><div className="text-[10px] text-slate-500">{DEFAULT_MACHINE_SUB}</div></div>
            <div className="rounded-xl border border-slate-200 bg-white px-2 py-2 shadow-sm"><div className="text-[9px] font-black uppercase text-slate-500">Operator</div><div className="text-[12px] font-black">Ali Raza</div><div className="text-[10px] text-slate-500">Supervisor: Ahmed Khan</div></div>
            <div className="rounded-xl border border-slate-200 bg-white px-2 py-2 shadow-sm"><div className="text-[9px] font-black uppercase text-slate-500">Shift</div><div className="text-[12px] font-black">Shift A</div><div className="text-[10px] text-slate-500">18:11</div></div>
            <div className="rounded-xl border border-slate-200 bg-white px-2 py-2 shadow-sm"><div className="text-[9px] font-black uppercase text-slate-500">QC</div><div className="text-[12px] font-black">OK</div><div className="text-[10px] text-slate-500">Approved</div></div>
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
                ["Input Lot / Drum No", "-"],
                ["Length", "-"],
                ["Color", "-"],
                ["Insulation thickness", "-"],
                ["Core size", "-"],
                ["OD", "-"],
                ["Spark test", "-"],
                ["Line speed", "-"]
              ].map(([label, value]) => <InfoBox key={label} label={label} value={value} />)}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <LayingUpActionPanel cards={actionCards} onAction={handleAction} disabledKeys={disabledKeys} />
        </section>

        <section className="grid gap-2 lg:grid-cols-[1fr_1fr_1.15fr]">
          <div className={`rounded-2xl border p-2.5 ${embossingActive ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="truncate text-[12px] font-black text-amber-900">CHECK EMBOSSING WHEEL & ALIGNMENT</div>
                <div className="text-[10px] font-semibold text-amber-700">Auto turn-off in</div>
              </div>
              <div className={`text-[14px] font-black ${embossingActive ? "text-emerald-700" : "text-amber-700"}`}>{embossingActive ? "ON" : "OFF"}</div>
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
                <div className="truncate text-[11px] font-black">{inputDrumValue || "-"}</div>
                <div className="mt-1 rounded-lg bg-slate-50 px-2 py-1 text-center text-[10px] font-black">Total: {inputDrumValue ? 1 : 0}</div>
              </div>
              <div className="rounded-xl border border-slate-200 p-2">
                <div className="mb-1 text-[11px] font-black">OUTPUT</div>
                <div className="truncate text-[11px] font-black">{outputDrumValue || "-"}</div>
                <div className="mt-1 rounded-lg bg-slate-50 px-2 py-1 text-center text-[10px] font-black">Total: {outputDrumValue ? 1 : 0}</div>
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
                  events.map((entry) => <div key={entry} className="text-[10px] font-semibold text-slate-600">{entry}</div>)
                )}
              </div>
            </div>
          </div>
        </section>

        <footer className="sticky bottom-1 z-20 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <div className="grid grid-cols-3 items-center gap-2 text-[11px] font-bold text-slate-700">
            <div>MACHINE STATUS: <span className="font-black text-amber-700">{statusText}</span></div>
            <div className="text-center">SETUP TIME: <b>{setupTimeLabel}</b></div>
            <div className="flex items-center justify-end gap-2">
              <span>LIVE CLOCK: <b>{liveClockLabel}</b></span>
              <button onClick={() => pushEvent("Refresh clicked")} className="grid h-7 w-7 place-items-center rounded-full border border-slate-200"><RefreshCw className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        </footer>
      </div>

      {workflow && (
        <Modal title={modalTitle} sub={workflow === "startJob" ? "Enter drums and confirm the zero meter reading." : "Fill the fields and commit the action."} onClose={() => setWorkflow(null)}>
          <div className="grid gap-4">
            {(workflow === "startJob" || workflow === "changeDrum") && (
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Input Drum / ان پٹ ڈرم</div>
                  <input value={inputDrum} onChange={(e) => setInputDrum(e.target.value)} className={fieldClassName()} placeholder="Enter input drum" />
                </label>
                <label className="block">
                  <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Output Drum / آؤٹ پٹ ڈرم</div>
                  <input value={outputDrum} onChange={(e) => setOutputDrum(e.target.value)} className={fieldClassName()} placeholder="Enter output drum" />
                </label>
              </div>
            )}

            {workflow === "startJob" && (
              <label className="block">
                <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Meter Reading / میٹر ریڈنگ</div>
                <input value="0" readOnly className={fieldClassName()} />
              </label>
            )}

            {workflow !== "startJob" && (
              <label className="block">
                <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Length (m) / لمبائی</div>
                <input value={lengthInput} onChange={(e) => setLengthInput(e.target.value)} type="number" className={fieldClassName()} />
              </label>
            )}

            {(workflow === "qcHold" || workflow === "stop" || workflow === "fault") && (
              <label className="block">
                <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Reason / وجہ</div>
                <select value={reason} onChange={(e) => setReason(e.target.value)} className={fieldClassName()}>
                  <option value="QC Review">QC Review / QC ریویو</option>
                  <option value="Management decision">Management decision / مینجمنٹ فیصلہ</option>
                  <option value="Electrical fault">Electrical fault / برقی خرابی</option>
                  <option value="Mechanical fault">Mechanical fault / مکینیکل خرابی</option>
                </select>
              </label>
            )}

            {workflow !== "startJob" && (
              <label className="block">
                <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Remarks / ریمارکس</div>
                <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} className="min-h-[96px] w-full rounded-2xl border border-slate-200 p-4 font-bold outline-none focus:border-emerald-400" />
              </label>
            )}

            <button onClick={workflow === "startJob" ? commitStartJob : finalize} className="rounded-2xl bg-green-700 py-3 font-black text-white">
              Commit / محفوظ کریں
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
