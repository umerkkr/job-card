import { useEffect, useMemo, useState } from "react";
import { BookOpenText, LayoutGrid, LogOut, RefreshCw, UserCircle2, X } from "lucide-react";
import LayingUpActionPanel, { STANDARD_ACTION_CARDS, type ActionKey } from "./LayingUpActionPanel";

type Props = { onBack: () => void; data?: any; crewNo?: string; onLogout?: () => void };
type Status = "READY" | "SETUP" | "RUNNING" | "QC_HOLD" | "STOPPED" | "FAULT" | "MATERIAL_ISSUE" | "DECISION_PENDING" | "REWINDING" | "REWORKING" | "RUNNING_REWIND" | "RUNNING_REWORK" | "TOOLING" | "COMPLETED";
type ModalMode = "startJob" | "stop" | "qcHold" | "complete" | "changeDrum" | "fault" | "materialIssue" | "decision" | "rewind" | "rework" | "tooling" | null;

const ORDER_LENGTH = 500;
const INPUT_SPOOL_LOV = ["C-49131"];
const OUTPUT_SPOOL_LOV = ["SFM00000544-X  -00145/2526"];

const actionCards = STANDARD_ACTION_CARDS;

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

export default function WireDrawing({ onBack, data, crewNo, onLogout }: Props) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [status, setStatus] = useState<Status>("READY");
  const [workflow, setWorkflow] = useState<ModalMode>(null);
  const [lengthInput, setLengthInput] = useState("");
  const [reason, setReason] = useState("QC Review");
  const [remarks, setRemarks] = useState("");
  const [inputDrum, setInputDrum] = useState("");
  const [outputDrum, setOutputDrum] = useState("");
  const [inputDrumValue, setInputDrumValue] = useState("");
  const [outputDrumValue, setOutputDrumValue] = useState("");
  const [events, setEvents] = useState<string[]>([]);
  const [setupSeconds, setSetupSeconds] = useState(0);
  const [jobSeconds, setJobSeconds] = useState(0);
  const [producedLength, setProducedLength] = useState(0);
  const [decisionChoice, setDecisionChoice] = useState<"rewind" | "rework" | "holdJob" | "deviation" | null>(null);
  const [nextAfterRewind, setNextAfterRewind] = useState<"continue" | "rework">("continue");
  const [toolingReason, setToolingReason] = useState("Die Linking Size");

  const progress = Math.max(0, Math.min(100, Math.round((producedLength / ORDER_LENGTH) * 100)));
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
      case "TOOLING":
        return "TOOLING";
      case "COMPLETED":
        return "COMPLETED";
      default:
        return "READY";
    }
  }, [status]);
  const setupTimeLabel = `${String(Math.floor(setupSeconds / 60)).padStart(2, "0")}:${String(setupSeconds % 60).padStart(2, "0")}`;
  const pushEvent = (msg: string) => setEvents((prev) => [`${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ${msg}`, ...prev]);

  useEffect(() => {
    return undefined;
  }, []);

  useEffect(() => {
    if (status !== "SETUP") return;
    const setupTimer = window.setInterval(() => setSetupSeconds((prev) => prev + 1), 1000);
    return () => window.clearInterval(setupTimer);
  }, [status]);

  useEffect(() => {
    if (status !== "RUNNING") return;
    const jobTimer = window.setInterval(() => setJobSeconds((prev) => prev + 1), 1000);
    return () => window.clearInterval(jobTimer);
  }, [status]);

  const openWorkflow = (mode: ModalMode) => {
    setWorkflow(mode);
    if (mode === "tooling") {
      setStatus("TOOLING");
    }
    setReason(mode === "fault" ? "Electrical fault" : mode === "stop" ? "Management decision" : "QC Review");
    setRemarks("");
    setLengthInput(mode === "startJob" ? "0" : "");
    setDecisionChoice(null);
    setNextAfterRewind("continue");
    setToolingReason("Die Linking Size");
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
    setJobSeconds(0);
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
      pushEvent(`Spool changed: ${nextInputDrum || inputDrumValue || "-"} -> ${nextOutputDrum || outputDrumValue || "-"} | ${lengthInput || producedLength} m`);
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
    } else if (workflow === "materialIssue") {
      setStatus("MATERIAL_ISSUE");
      pushEvent(`Material issue logged at ${lengthInput || producedLength} m: ${reason}${remarks ? ` | ${remarks}` : ""}`);
    } else if (workflow === "decision") {
      setStatus("DECISION_PENDING");
      pushEvent(`Decision committed: ${decisionChoice || "none"}${remarks ? ` | ${remarks}` : ""}`);
    } else if (workflow === "rewind") {
      setStatus(nextAfterRewind === "rework" ? "REWORKING" : "REWINDING");
      pushEvent(`Rewind committed at ${lengthInput || producedLength} m | next: ${nextAfterRewind}`);
    } else if (workflow === "rework") {
      setStatus("REWORKING");
      pushEvent(`Rework committed at ${lengthInput || producedLength} m${remarks ? ` | ${remarks}` : ""}`);
    } else if (workflow === "tooling") {
      setStatus("RUNNING");
      pushEvent(`Tooling committed at ${lengthInput || producedLength} m: ${toolingReason}${remarks ? ` | ${remarks}` : ""}`);
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
    if (key === "resume") {
      setStatus("RUNNING");
      pushEvent("Resume pressed");
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

  const disabledKeys = useMemo<Partial<Record<ActionKey, boolean>>>(() => {
    if (status === "COMPLETED") {
      return { start: true, startJob: true, stop: true, qcHold: true, resume: true, complete: true, changeDrum: true, tooling: true, rewind: true, rework: true, breakdown: true, materialIssue: true, decisionPending: true };
    }
    if (status === "READY") {
      return { startJob: true, stop: true, qcHold: true, resume: true, complete: true, changeDrum: true, tooling: true, rewind: true, rework: true, breakdown: true, materialIssue: true, decisionPending: true };
    }
    if (status === "SETUP") {
      return { start: true, stop: true, qcHold: true, resume: true, complete: true, changeDrum: true, tooling: true, rewind: true, rework: true, breakdown: true, materialIssue: true, decisionPending: true };
    }
    if (status === "QC_HOLD") {
      return { start: true, startJob: true, stop: true, qcHold: true, resume: false, complete: true, changeDrum: true, tooling: true, rewind: true, rework: true, breakdown: true, materialIssue: true, decisionPending: true };
    }
    if (status === "FAULT" || status === "MATERIAL_ISSUE" || status === "STOPPED") {
      const allowDecision = status !== "STOPPED" || ["Management decision", "Setup issue"].includes(reason);
      return { start: true, startJob: true, stop: true, qcHold: true, resume: false, complete: true, changeDrum: true, tooling: false, rewind: true, rework: true, breakdown: true, materialIssue: true, decisionPending: !allowDecision };
    }
    if (status === "DECISION_PENDING") {
      return { start: true, startJob: true, stop: true, qcHold: true, resume: false, complete: true, changeDrum: true, tooling: true, rewind: decisionChoice !== "rewind", rework: decisionChoice !== "rework", breakdown: true, materialIssue: true, decisionPending: false };
    }
    if (status === "REWINDING" || status === "REWORKING" || status === "TOOLING") {
      return { start: true, startJob: true, stop: true, qcHold: true, resume: false, complete: true, changeDrum: true, tooling: true, rewind: true, rework: true, breakdown: true, materialIssue: true, decisionPending: true };
    }
    if (status === "RUNNING_REWIND" || status === "RUNNING_REWORK" || status === "RUNNING") {
      return { start: true, startJob: true, stop: false, qcHold: false, resume: true, complete: false, changeDrum: false, tooling: false, rewind: true, rework: true, breakdown: false, materialIssue: false, decisionPending: false };
    }
    return { start: true, startJob: true };
  }, [status, reason, decisionChoice]);

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
              ? "Change Spool / سپول تبدیل"
              : workflow === "tooling"
                ? "Tooling / ٹولنگ"
                : workflow === "decision"
                  ? "Decision / فیصلہ"
                  : workflow === "rewind"
                    ? "Rewind / ری وائنڈ"
                    : workflow === "rework"
                      ? "Rework / ری ورک"
                      : "Fault / خرابی";

  return (
    <div className="min-h-screen bg-[#f4f6f8] p-2 text-slate-950" style={{ fontFamily: "Ubuntu, sans-serif" }}>
      <div className="mx-auto flex max-w-[1400px] flex-col gap-2">
        <header className="sticky top-1 z-30 rounded-2xl border border-slate-200 bg-white/95 px-2 py-1.5 shadow-sm backdrop-blur">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                onClick={onBack}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-50"
              >
                {"<-"} Back
              </button>
              <div className="truncate text-[15px] font-black tracking-tight">PAKISTAN CABLES LIMITED</div>
            </div>

            <div className="rounded-full bg-slate-100 px-3 py-1 text-[13px] font-black tracking-tight">WIRE DRAWING</div>

            <div className="flex items-center justify-end gap-1.5">
              <button
                type="button"
                className="rounded-full border border-amber-700 bg-amber-700 px-3 py-1.5 text-[11px] font-black text-white shadow-sm"
              >
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
        <div className="mt-0.5 text-[15px] font-black leading-tight">{data?.jobName || "WIRE DRAWING"}</div>
        <div className="mt-2 grid gap-x-3 gap-y-0.5 text-[11px] font-bold sm:grid-cols-3">
          <div className="truncate">Job: {data?.jobId || "DRA-001"}</div>
          <div className="truncate">Batch: {data?.process || "Wire Drawing"}</div>
          <div className="truncate">WO: {data?.machine || "M-85"}</div>
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
    <div className="rounded-xl border border-slate-200 bg-white px-2 py-2 shadow-sm">
      <div className="text-[9px] font-black uppercase leading-none text-slate-500">Machine</div>
      <div className="truncate text-[12px] font-black leading-tight">M-85</div>
      <div className="truncate text-[10px] font-semibold leading-tight text-slate-500">Drawing</div>
    </div>
    <div className="rounded-xl border border-slate-200 bg-white px-2 py-2 shadow-sm">
      <div className="text-[9px] font-black uppercase leading-none text-slate-500">Operator</div>
      <div className="truncate text-[12px] font-black leading-tight">Ali Raza</div>
      <div className="truncate text-[10px] font-semibold leading-tight text-slate-500">Supervisor: Ahmed Khan</div>
    </div>
    <div className="rounded-xl border border-slate-200 bg-white px-2 py-2 shadow-sm">
      <div className="text-[9px] font-black uppercase leading-none text-slate-500">Shift</div>
      <div className="truncate text-[12px] font-black leading-tight">Shift A</div>
      <div className="truncate text-[10px] font-semibold leading-tight text-slate-500">18:11</div>
    </div>
    <div className="rounded-xl border border-slate-200 bg-white px-2 py-2 shadow-sm">
      <div className="text-[9px] font-black uppercase leading-none text-slate-500">QC</div>
      <div className="truncate text-[12px] font-black leading-tight">OK</div>
      <div className="truncate text-[10px] font-semibold leading-tight text-slate-500">Approved</div>
    </div>
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
                ["Spool No", inputDrumValue || "-"],
                ["Total spool Qty", outputDrumValue || "1 x 36 x 1444.6698"],
                ["Length (m)", producedLength ? producedLength.toFixed(1) : "2011.279"],
                ["Packing Standards",  "630mm (H/ Blue)"],
                ["Machine", data?.machine || "M-85"],
                ["Crew", crewNo || "N/A"],
                ["Shift", "Shift A"],
                ["QC", status === "RUNNING" ? "OK" : "PENDING"],
              ].map(([label, value]) => <InfoBox key={label} label={label} value={value} />)}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <LayingUpActionPanel cards={actionCards} onAction={handleAction} disabledKeys={disabledKeys} />
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
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-700">
              No instructions configured yet for Wire Drawing.
            </div>
          </section>
        )}

        <section className="grid gap-2 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <div className="text-[13px] font-black">Spool Traceability</div>
                <div className="text-[10px] text-slate-500">Input and output spools</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-slate-200 p-2">
                <div className="mb-1 text-[11px] font-black">INPUT</div>
                <div className="truncate text-[11px] font-black">{inputDrumValue || "-"}</div>
              </div>
              <div className="rounded-xl border border-slate-200 p-2">
                <div className="mb-1 text-[11px] font-black">OUTPUT</div>
                <div className="truncate text-[11px] font-black">{outputDrumValue || "-"}</div>
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
            <div>MACHINE STATUS: <span className="font-black text-amber-700">{statusText}</span></div>
            <div className="text-center">SETUP TIME: <b>{setupTimeLabel}</b></div>
            <div className="flex items-center justify-end gap-2">
              <span>JOB TIMER: <b>{String(Math.floor(jobSeconds / 60)).padStart(2, "0")}:{String(jobSeconds % 60).padStart(2, "0")}</b></span>
              <button onClick={() => pushEvent("Refresh clicked")} className="grid h-7 w-7 place-items-center rounded-full border border-slate-200"><RefreshCw className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        </footer>
      </div>

      {workflow && (
        <Modal
          title={modalTitle}
          sub={workflow === "startJob" ? "Enter input/output spool and confirm the zero meter reading." : "Fill the fields and commit the action."}
          onClose={() => {
            if (workflow === "tooling" && status === "TOOLING") {
              setStatus("RUNNING");
            }
            setWorkflow(null);
          }}
        >
          <div className="grid gap-4">
            {(workflow === "startJob" || workflow === "changeDrum" || workflow === "tooling" || workflow === "rewind" || workflow === "rework" || workflow === "complete" || workflow === "qcHold" || workflow === "fault" || workflow === "materialIssue" || workflow === "stop") && (
              <label className="block">
                <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">{workflow === "startJob" ? "Meter Reading / میٹر ریڈنگ" : "Length (m) / لمبائی"}</div>
                <input value={lengthInput} onChange={(e) => setLengthInput(e.target.value)} type="number" className={fieldClassName()} placeholder={workflow === "startJob" ? "Enter meter reading" : "Enter length"} />
              </label>
            )}
            {(workflow === "startJob" || workflow === "changeDrum") && (
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Input Spool / ان پٹ سپول</div>
                  <select
                    value={inputDrum}
                    onChange={(e) => setInputDrum(e.target.value)}
                    className={fieldClassName()}
                  >
                    <option value="">Select input spool</option>
                    {INPUT_SPOOL_LOV.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Output Spool / آؤٹ پٹ سپول</div>
                  <select
                    value={outputDrum}
                    onChange={(e) => setOutputDrum(e.target.value)}
                    className={fieldClassName()}
                  >
                    <option value="">Select output spool</option>
                    {OUTPUT_SPOOL_LOV.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </label>
              </div>
            )}
            {workflow === "tooling" && (
              <label className="block">
                <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Tooling Reason / وجہ</div>
                <select value={toolingReason} onChange={(e) => setToolingReason(e.target.value)} className={fieldClassName()}>
                  <option value="Die Linking Size">Die Linking Size / ڈائی لنکنگ سائز</option>
                  <option value="Die/Core Change">Die/Core Change / ڈائی / کور چینج</option>
                </select>
              </label>
            )}
            {workflow === "decision" && (
              <div className="grid gap-2 md:grid-cols-4">
                {[
                  { key: "rewind", label: "Send to Rewind" },
                  { key: "rework", label: "Send to Rework" },
                  { key: "holdJob", label: "Hold Job" },
                  { key: "deviation", label: "Deviation" },
                ].map((item) => (
                  <button key={item.key} type="button" onClick={() => setDecisionChoice(item.key as any)} className={`rounded-2xl border px-4 py-3 text-left font-black ${decisionChoice === item.key ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
            {(workflow === "qcHold" || workflow === "fault" || workflow === "materialIssue" || workflow === "stop" || workflow === "complete" || workflow === "rewind" || workflow === "rework" || workflow === "decision" || workflow === "tooling") && (
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
