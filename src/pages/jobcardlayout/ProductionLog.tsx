import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Gauge,
  Languages,
  PauseCircle,
  Play,
  PlusCircle,
  QrCode,
  RotateCcw,
  ShieldCheck,
  Square,
  UserRound,
  Wrench,
  X,
} from "lucide-react";

type Lang = "ur" | "en";
type JobStatus =
  | "READY"
  | "SETTING"
  | "RUNNING"
  | "STOPPED"
  | "QC_HOLD"
  | "WAITING_SUPERVISOR"
  | "COMPLETED";

type StopReason =
  | "CHANGE_DRUM"
  | "JOB_COMPLETE"
  | "MACHINE_BREAKDOWN"
  | "MATERIAL_ISSUE"
  | "POWER_FAILURE"
  | "SETUP_ISSUE"
  | "OTHER";

type ChildType = "REWIND" | "REWORK" | "STRIPPING" | "QC_HOLD" | "DRUM_CHANGE";
type ChildStatus = "PENDING_SUPERVISOR" | "APPROVED" | "COMPLETED";

type LogRow = {
  id: string;
  rowNo: number;
  startTime: string;
  endTime?: string;
  inputDrum: string;
  outputDrum?: string;
  startMeter: number;
  endMeter?: number;
  producedMeters: number;
  reason?: StopReason;
  status: "RUNNING" | "STOPPED" | "COMPLETED";
  remarks?: string;
};

type TimelineEvent = {
  id: string;
  time: string;
  title: string;
  detail: string;
  tone: "green" | "blue" | "amber" | "red" | "purple" | "slate";
};

type ChildActivity = {
  id: string;
  type: ChildType;
  status: ChildStatus;
  time: string;
  reason: string;
};

type Job = {
  jobNo: string;
  batchNo: string;
  product: string;
  workOrder: string;
  machine: string;
  process: string;
  shift: string;
  operator: string;
  supervisor: string;
  targetMeters: number;
  completedMeters: number;
  inputDrum: string;
  currentStartMeter?: number;
  startSettingTime?: string;
  status: JobStatus;
  qcPending: boolean;
  supervisorPending: boolean;
};

type ModalType =
  | "START_JOB"
  | "ADD_PRODUCTION"
  | "STOP_JOB"
  | "RESUME_JOB"
  | "QC_HOLD"
  | "REQUEST_ACTIVITY"
  | null;

type ModalState = {
  type: ModalType;
  activityType?: ChildType;
};

const initialJob: Job = {
  jobNo: "BED-260521-13",
  batchNo: "PCF-BED-150-1-EXTD26-180565",
  product: "CU/XLPE/SWA/PVC 3X150 MM2 6.35/11KV",
  workOrder: "X-06357/2526",
  machine: "SIPOLAS",
  process: "Extrusion",
  shift: "Shift A",
  operator: "Ali Raza",
  supervisor: "Ahmed Khan",
  targetMeters: 500,
  completedMeters: 0,
  inputDrum: "",
  status: "READY",
  qcPending: false,
  supervisorPending: false,
};

const t = {
  ur: {
    pageTitle: "آپریٹر جاب کارڈ",
    pageSub: "لائیو بیچ ایکزیکیوشن ورک اسپیس",
    english: "English",
    urdu: "اردو",
    job: "جاب",
    batch: "بیچ",
    product: "پروڈکٹ",
    workOrder: "ورک آرڈر",
    machine: "مشین",
    process: "پروسیس",
    shift: "شفٹ",
    operator: "آپریٹر",
    supervisor: "سپروائزر",
    status: "اسٹیٹس",
    settingTime: "سیٹنگ شروع وقت",
    target: "ٹارگٹ",
    completed: "مکمل",
    remaining: "باقی",
    progress: "پروگریس",
    inputDrum: "ان پٹ ڈرم",
    outputDrum: "آؤٹ پٹ ڈرم",
    startMeter: "اسٹارٹ میٹر",
    endMeter: "اینڈ میٹر",
    produced: "پروڈیوسڈ",
    actions: "ایکشنز",
    actionsHint: "تمام آپریٹر بٹن ایک ہی کارڈ میں ہیں",
    trace: "ڈرم ٹریس ایبلٹی",
    logs: "پروڈکشن لاگ",
    timeline: "ایونٹ ٹائم لائن",
    child: "چائلڈ ایکٹیویٹیز",
    supervisorQueue: "سپروائزر اپروول قطار",
    noLogs: "ابھی کوئی لاگ لائن نہیں بنی۔",
    noEvents: "ابھی کوئی ایونٹ نہیں۔",
    noChild: "کوئی چائلڈ ایکٹیویٹی نہیں۔",
    noApproval: "کوئی اپروول پینڈنگ نہیں۔",
    waitingQc: "QC / سپروائزر کے رزلٹ کا انتظار ہے۔ آپریٹر رزلٹ داخل نہیں کرے گا۔",
    startSetting: "سیٹنگ وقت شروع کریں",
    startJob: "جاب شروع کریں",
    addProduction: "پروڈکشن شامل کریں",
    stopJob: "جاب روکیں",
    resumeJob: "جاب دوبارہ شروع کریں",
    qcHold: "QC ہولڈ درخواست",
    changeDrum: "ڈرم چینج",
    rewind: "ری وائنڈ درخواست",
    rework: "ری ورک درخواست",
    stripping: "اسٹرپنگ درخواست",
    completeJob: "جاب مکمل کریں",
    cancel: "کینسل",
    save: "محفوظ کریں",
    confirm: "کنفرم",
    close: "بند کریں",
    remarks: "ریمارکس",
    reason: "وجہ",
    selectReason: "وجہ منتخب کریں",
    startModalTitle: "جاب شروع کریں",
    startModalSub: "صرف اسٹارٹ میٹر اور ان پٹ ڈرم درج کریں۔ آؤٹ پٹ ڈرم اسٹاپ پر لیا جائے گا۔",
    addModalTitle: "پروڈکشن شامل کریں",
    addModalSub: "مکمل میٹرز شامل کریں۔",
    stopModalTitle: "جاب روکیں",
    stopModalSub: "پہلے وجہ منتخب کریں۔ جاب مکمل یا ڈرم چینج پر آؤٹ پٹ ڈرم اور اینڈ میٹر لازمی ہوں گے۔",
    resumeModalTitle: "جاب دوبارہ شروع کریں",
    resumeModalSub: "نئی لائن پچھلے اینڈ میٹر سے شروع ہوگی۔",
    qcModalTitle: "QC ہولڈ درخواست",
    activityModalTitle: "سپروائزر درخواست",
    required: "یہ فیلڈ لازمی ہے",
    ready: "تیار",
    setting: "سیٹنگ",
    running: "رننگ",
    stopped: "اسٹاپ",
    qcHoldStatus: "QC ہولڈ",
    waitingSupervisor: "سپروائزر کا انتظار",
    completedStatus: "مکمل",
    pending: "پینڈنگ",
    approved: "اپرووڈ",
    row: "لائن",
  },
  en: {
    pageTitle: "Operator Job Card",
    pageSub: "Live Batch Execution Workspace",
    english: "English",
    urdu: "Urdu",
    job: "Job",
    batch: "Batch",
    product: "Product",
    workOrder: "Work Order",
    machine: "Machine",
    process: "Process",
    shift: "Shift",
    operator: "Operator",
    supervisor: "Supervisor",
    status: "Status",
    settingTime: "Setting Start Time",
    target: "Target",
    completed: "Completed",
    remaining: "Remaining",
    progress: "Progress",
    inputDrum: "Input Drum",
    outputDrum: "Output Drum",
    startMeter: "Start Meter",
    endMeter: "End Meter",
    produced: "Produced",
    actions: "Actions",
    actionsHint: "All operator buttons are under one card",
    trace: "Drum Traceability",
    logs: "Production Log",
    timeline: "Event Timeline",
    child: "Child Activities",
    supervisorQueue: "Supervisor Approval Queue",
    noLogs: "No log line created yet.",
    noEvents: "No event yet.",
    noChild: "No child activity yet.",
    noApproval: "No approval pending.",
    waitingQc: "Waiting for QC / Supervisor result. Operator cannot enter QC result.",
    startSetting: "Start Setting Time",
    startJob: "Start Job",
    addProduction: "Add Production",
    stopJob: "Stop Job",
    resumeJob: "Resume Job",
    qcHold: "QC Hold Request",
    changeDrum: "Change Drum",
    rewind: "Rewind Request",
    rework: "Rework Request",
    stripping: "Stripping Request",
    completeJob: "Complete Job",
    cancel: "Cancel",
    save: "Save",
    confirm: "Confirm",
    close: "Close",
    remarks: "Remarks",
    reason: "Reason",
    selectReason: "Select Reason",
    startModalTitle: "Start Job",
    startModalSub: "Enter only start meter and input drum. Output drum will be captured at stop.",
    addModalTitle: "Add Production",
    addModalSub: "Add completed meters.",
    stopModalTitle: "Stop Job",
    stopModalSub: "Select reason first. Job complete or change drum requires output drum and end meter.",
    resumeModalTitle: "Resume Job",
    resumeModalSub: "The new line starts from the previous end meter.",
    qcModalTitle: "QC Hold Request",
    activityModalTitle: "Supervisor Request",
    required: "This field is required",
    ready: "Ready",
    setting: "Setting",
    running: "Running",
    stopped: "Stopped",
    qcHoldStatus: "QC Hold",
    waitingSupervisor: "Waiting Supervisor",
    completedStatus: "Completed",
    pending: "Pending",
    approved: "Approved",
    row: "Row",
  },
};

const stopReasonLabels: Record<Lang, Record<StopReason, string>> = {
  ur: {
    CHANGE_DRUM: "ڈرم چینج",
    JOB_COMPLETE: "جاب مکمل",
    MACHINE_BREAKDOWN: "مشین خرابی",
    MATERIAL_ISSUE: "مٹیریل مسئلہ",
    POWER_FAILURE: "بجلی مسئلہ",
    SETUP_ISSUE: "سیٹنگ مسئلہ",
    OTHER: "دیگر",
  },
  en: {
    CHANGE_DRUM: "Change Drum",
    JOB_COMPLETE: "Job Complete",
    MACHINE_BREAKDOWN: "Machine Breakdown",
    MATERIAL_ISSUE: "Material Issue",
    POWER_FAILURE: "Power Failure",
    SETUP_ISSUE: "Setup Issue",
    OTHER: "Other",
  },
};

const childLabels: Record<Lang, Record<ChildType, string>> = {
  ur: {
    REWIND: "ری وائنڈ",
    REWORK: "ری ورک",
    STRIPPING: "اسٹرپنگ",
    QC_HOLD: "QC ہولڈ",
    DRUM_CHANGE: "ڈرم چینج",
  },
  en: {
    REWIND: "Rewind",
    REWORK: "Rework",
    STRIPPING: "Stripping",
    QC_HOLD: "QC Hold",
    DRUM_CHANGE: "Drum Change",
  },
};

const statusLabel = (lang: Lang, status: JobStatus) => {
  const l = t[lang];
  const map: Record<JobStatus, string> = {
    READY: l.ready,
    SETTING: l.setting,
    RUNNING: l.running,
    STOPPED: l.stopped,
    QC_HOLD: l.qcHoldStatus,
    WAITING_SUPERVISOR: l.waitingSupervisor,
    COMPLETED: l.completedStatus,
  };
  return map[status];
};

const statusClass: Record<JobStatus, string> = {
  READY: "bg-slate-900 text-white",
  SETTING: "bg-blue-600 text-white",
  RUNNING: "bg-green-700 text-white",
  STOPPED: "bg-red-600 text-white",
  QC_HOLD: "bg-amber-500 text-white",
  WAITING_SUPERVISOR: "bg-orange-500 text-white",
  COMPLETED: "bg-emerald-700 text-white",
};

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function now() {
  return new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function num(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function ActionButton({
  icon: Icon,
  label,
  hint,
  color,
  disabled,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  hint: string;
  color: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`min-h-[74px] rounded-2xl border p-3 text-start shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35 ${color}`}
    >
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/90 shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-black uppercase tracking-wide">{label}</div>
          <div className="mt-1 line-clamp-2 text-xs font-bold opacity-70">{hint}</div>
        </div>
      </div>
    </button>
  );
}

function InfoTile({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-black uppercase tracking-wider text-slate-500">{label}</span>
        <Icon className="h-4 w-4 text-green-700" />
      </div>
      <div className="truncate text-base font-black text-slate-950">{value}</div>
      {sub && <div className="mt-1 truncate text-xs font-bold text-slate-500">{sub}</div>}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoFocus,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number";
  placeholder?: string;
  autoFocus?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">{label}</span>
      <input
        autoFocus={autoFocus}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-lg font-black outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
      />
    </label>
  );
}

function ModalShell({
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
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-3">
      <div className="max-h-[92vh] w-full max-w-xl overflow-auto rounded-[2rem] bg-white p-4 shadow-2xl md:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-slate-950">{title}</h2>
            <p className="mt-1 text-sm font-bold text-slate-500">{sub}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-2xl border border-slate-200 p-3">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function ProductionLog({ isUrdu = true }: { isUrdu?: boolean }) {
  const [lang, setLang] = useState<Lang>(isUrdu ? "ur" : "en");
  const [job, setJob] = useState<Job>(initialJob);
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [children, setChildren] = useState<ChildActivity[]>([]);
  const [modal, setModal] = useState<ModalState>({ type: null });

  const [startMeter, setStartMeter] = useState("");
  const [inputDrum, setInputDrum] = useState("");
  const [productionMeters, setProductionMeters] = useState("");
  const [stopReason, setStopReason] = useState<StopReason>("CHANGE_DRUM");
  const [endMeter, setEndMeter] = useState("");
  const [outputDrum, setOutputDrum] = useState("");
  const [remarks, setRemarks] = useState("");
  const [activityReason, setActivityReason] = useState("");

  const l = t[lang];
  const dir = lang === "ur" ? "rtl" : "ltr";
  const latestLog = logs[0];
  const currentRunningLog = logs.find((log) => log.status === "RUNNING");

  const percent = useMemo(() => {
    if (job.targetMeters <= 0) return 0;
    return Math.min(100, Math.round((job.completedMeters / job.targetMeters) * 100));
  }, [job.completedMeters, job.targetMeters]);

  const remaining = Math.max(job.targetMeters - job.completedMeters, 0);
  const requiresOutputAndEnd = stopReason === "CHANGE_DRUM" || stopReason === "JOB_COMPLETE";

  const pushEvent = (title: string, detail: string, tone: TimelineEvent["tone"] = "blue") => {
    setEvents((prev) => [{ id: makeId("evt"), time: now(), title, detail, tone }, ...prev]);
  };

  const resetModalFields = () => {
    setProductionMeters("");
    setEndMeter("");
    setOutputDrum("");
    setRemarks("");
    setActivityReason("");
    setStopReason("CHANGE_DRUM");
  };

  const closeModal = () => {
    setModal({ type: null });
    resetModalFields();
  };

  const startSettingTime = () => {
    const time = now();
    setJob((prev) => ({ ...prev, status: "SETTING", startSettingTime: time }));
    pushEvent(l.startSetting, `${l.settingTime}: ${time}`, "blue");
  };

  const openStartJob = () => {
    setStartMeter(latestLog?.endMeter !== undefined ? String(latestLog.endMeter) : "");
    setInputDrum(job.inputDrum || "");
    setModal({ type: "START_JOB" });
  };

  const startJob = () => {
    const meter = num(startMeter);
    if (!startMeter || !inputDrum.trim()) return;

    const newLog: LogRow = {
      id: makeId("log"),
      rowNo: logs.length + 1,
      startTime: now(),
      inputDrum: inputDrum.trim(),
      startMeter: meter,
      producedMeters: 0,
      status: "RUNNING",
    };

    setLogs((prev) => [newLog, ...prev.map((log) => log.status === "RUNNING" ? ({ ...log, status: "STOPPED" as const } as LogRow) : log)]);
    setJob((prev) => ({
      ...prev,
      inputDrum: inputDrum.trim(),
      currentStartMeter: meter,
      status: "RUNNING",
      qcPending: false,
      supervisorPending: false,
    }));
    pushEvent(l.startJob, `${l.inputDrum}: ${inputDrum.trim()} | ${l.startMeter}: ${meter}`, "green");
    closeModal();
  };

  const addProduction = () => {
    const value = num(productionMeters);
    if (value <= 0) return;

    setJob((prev) => ({ ...prev, completedMeters: Math.min(prev.completedMeters + value, prev.targetMeters) }));
    setLogs((prev) =>
      prev.map((log) => (log.status === "RUNNING" ? { ...log, producedMeters: log.producedMeters + value } : log))
    );
    pushEvent(l.addProduction, `${value} m`, "green");
    closeModal();
  };

  const stopJob = () => {
    const active = currentRunningLog;
    if (!active) return;

    if (requiresOutputAndEnd && (!outputDrum.trim() || !endMeter)) return;

    const end = endMeter ? num(endMeter) : active.startMeter + active.producedMeters;
    const produced = Math.max(end - active.startMeter, active.producedMeters, 0);
    const status: LogRow["status"] = stopReason === "JOB_COMPLETE" ? "COMPLETED" : "STOPPED";

    setLogs((prev) =>
      prev.map((log) =>
        log.id === active.id
          ? {
              ...log,
              endTime: now(),
              endMeter: end,
              outputDrum: outputDrum.trim() || undefined,
              producedMeters: produced,
              reason: stopReason,
              status,
              remarks: remarks.trim() || undefined,
            }
          : log
      )
    );

    setJob((prev) => ({
      ...prev,
      completedMeters: Math.min(
        prev.completedMeters - active.producedMeters + produced,
        prev.targetMeters
      ),
      status: stopReason === "JOB_COMPLETE" ? "COMPLETED" : "STOPPED",
      supervisorPending: stopReason !== "JOB_COMPLETE",
    }));

    if (stopReason === "CHANGE_DRUM") {
      setChildren((prev) => [
        {
          id: makeId("child"),
          type: "DRUM_CHANGE",
          status: "PENDING_SUPERVISOR",
          time: now(),
          reason: `${l.outputDrum}: ${outputDrum.trim()}`,
        },
        ...prev,
      ]);
    }

    pushEvent(
      stopReasonLabels[lang][stopReason],
      requiresOutputAndEnd
        ? `${l.endMeter}: ${end} | ${l.outputDrum}: ${outputDrum.trim()}`
        : remarks.trim() || stopReasonLabels[lang][stopReason],
      stopReason === "JOB_COMPLETE" ? "green" : stopReason === "CHANGE_DRUM" ? "purple" : "red"
    );

    closeModal();
  };

  const resumeJob = () => {
    const previousEnd = latestLog?.endMeter ?? job.currentStartMeter ?? 0;
    const newLog: LogRow = {
      id: makeId("log"),
      rowNo: logs.length + 1,
      startTime: now(),
      inputDrum: job.inputDrum,
      startMeter: previousEnd,
      producedMeters: 0,
      status: "RUNNING",
    };

    setLogs((prev) => [newLog, ...prev]);
    setJob((prev) => ({
      ...prev,
      status: "RUNNING",
      currentStartMeter: previousEnd,
      supervisorPending: false,
      qcPending: false,
    }));
    pushEvent(l.resumeJob, `${l.startMeter}: ${previousEnd} | ${l.inputDrum}: ${job.inputDrum}`, "green");
    closeModal();
  };

  const requestQcHold = () => {
    setJob((prev) => ({ ...prev, status: "QC_HOLD", qcPending: true, supervisorPending: true }));
    setChildren((prev) => [
      {
        id: makeId("child"),
        type: "QC_HOLD",
        status: "PENDING_SUPERVISOR",
        time: now(),
        reason: remarks.trim() || l.qcHold,
      },
      ...prev,
    ]);
    pushEvent(l.qcHold, remarks.trim() || l.waitingQc, "amber");
    closeModal();
  };

  const requestActivity = () => {
    if (!modal.activityType) return;
    const type = modal.activityType;
    setJob((prev) => ({ ...prev, status: "WAITING_SUPERVISOR", supervisorPending: true }));
    setChildren((prev) => [
      {
        id: makeId("child"),
        type,
        status: "PENDING_SUPERVISOR",
        time: now(),
        reason: activityReason.trim() || childLabels[lang][type],
      },
      ...prev,
    ]);
    pushEvent(childLabels[lang][type], activityReason.trim() || l.supervisorQueue, "purple");
    closeModal();
  };

  const canStartSetting = job.status === "READY";
  const canStartJob = job.status === "SETTING";
  const canRunActions = job.status === "RUNNING";
  const canResume = job.status === "STOPPED" && !!latestLog?.endMeter;

  return (
    <div className="min-h-screen bg-slate-100 p-2 text-slate-950 md:p-4" dir={dir}>
      <div className="mx-auto grid max-w-[1500px] gap-3">
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-sm md:p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.2em] text-green-700">{l.pageSub}</div>
              <h1 className="mt-1 text-xl font-black md:text-2xl">{l.pageTitle}</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider ${statusClass[job.status]}`}>
                {statusLabel(lang, job.status)}
              </span>
              <button
                type="button"
                onClick={() => setLang((prev) => (prev === "ur" ? "en" : "ur"))}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-black"
              >
                <Languages className="h-4 w-4" />
                {lang === "ur" ? l.english : l.urdu}
              </button>
            </div>
          </div>

          <div className="grid gap-3 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="rounded-[1.5rem] bg-slate-950 p-4 text-white">
              <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-300">{l.product}</div>
                  <div className="truncate text-lg font-black md:text-xl">{job.product}</div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold text-slate-300">
                    <span>{l.job}: {job.jobNo}</span>
                    <span>•</span>
                    <span>{l.batch}: {job.batchNo}</span>
                    <span>•</span>
                    <span>{l.workOrder}: {job.workOrder}</span>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white/10 p-3">
                      <div className="text-xs text-slate-300">{l.settingTime}</div>
                      <div className="font-black">{job.startSettingTime || "-"}</div>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-3">
                      <div className="text-xs text-slate-300">{l.inputDrum}</div>
                      <div className="font-black">{job.inputDrum || "-"}</div>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-3">
                      <div className="text-xs text-slate-300">{l.startMeter}</div>
                      <div className="font-black">{job.currentStartMeter ?? "-"}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-end justify-between">
                    <span className="text-sm font-bold text-slate-300">{l.progress}</span>
                    <span className="text-4xl font-black">{percent}%</span>
                  </div>
                  <div className="h-5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${percent}%` }} />
                  </div>
                  <div className="mt-2 flex justify-between text-xs font-bold text-slate-300">
                    <span>{job.completedMeters} m</span>
                    <span>{remaining} m</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InfoTile icon={Gauge} label={l.machine} value={job.machine} sub={job.process} />
              <InfoTile icon={Clock3} label={l.shift} value={job.shift} sub={now()} />
              <InfoTile icon={UserRound} label={l.operator} value={job.operator} sub={`${l.supervisor}: ${job.supervisor}`} />
              <InfoTile icon={ShieldCheck} label="QC" value={job.qcPending ? l.pending : "OK"} sub={job.qcPending ? l.waitingQc : l.approved} />
            </div>
          </div>
        </section>

        <section className="grid gap-3 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="grid gap-3">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-sm md:p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-black">{l.actions}</h2>
                  <p className="text-sm font-bold text-slate-500">{l.actionsHint}</p>
                </div>
                <ClipboardList className="h-5 w-5 text-slate-400" />
              </div>

              <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                <ActionButton icon={Clock3} label={l.startSetting} hint={l.settingTime} color="border-blue-200 bg-blue-50 text-blue-950" disabled={!canStartSetting} onClick={startSettingTime} />
                <ActionButton icon={Play} label={l.startJob} hint={`${l.startMeter} + ${l.inputDrum}`} color="border-green-200 bg-green-50 text-green-950" disabled={!canStartJob} onClick={openStartJob} />
                <ActionButton icon={PlusCircle} label={l.addProduction} hint={l.completed} color="border-emerald-200 bg-emerald-50 text-emerald-950" disabled={!canRunActions} onClick={() => setModal({ type: "ADD_PRODUCTION" })} />
                <ActionButton icon={Square} label={l.stopJob} hint={l.selectReason} color="border-red-200 bg-red-50 text-red-950" disabled={!canRunActions} onClick={() => setModal({ type: "STOP_JOB" })} />
                <ActionButton icon={RotateCcw} label={l.resumeJob} hint={l.startMeter} color="border-green-200 bg-green-50 text-green-950" disabled={!canResume} onClick={() => setModal({ type: "RESUME_JOB" })} />
                <ActionButton icon={ShieldCheck} label={l.qcHold} hint={l.waitingQc} color="border-amber-200 bg-amber-50 text-amber-950" disabled={!canRunActions} onClick={() => setModal({ type: "QC_HOLD" })} />
                <ActionButton icon={Wrench} label={l.changeDrum} hint={`${l.outputDrum} + ${l.endMeter}`} color="border-purple-200 bg-purple-50 text-purple-950" disabled={!canRunActions} onClick={() => { setStopReason("CHANGE_DRUM"); setModal({ type: "STOP_JOB" }); }} />
                <ActionButton icon={PauseCircle} label={l.rewind} hint={l.supervisorQueue} color="border-violet-200 bg-violet-50 text-violet-950" disabled={!canRunActions} onClick={() => setModal({ type: "REQUEST_ACTIVITY", activityType: "REWIND" })} />
                <ActionButton icon={AlertTriangle} label={l.rework} hint={l.supervisorQueue} color="border-orange-200 bg-orange-50 text-orange-950" disabled={!canRunActions} onClick={() => setModal({ type: "REQUEST_ACTIVITY", activityType: "REWORK" })} />
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-sm md:p-4">
              <h2 className="mb-3 text-lg font-black">{l.trace}</h2>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                <InfoTile icon={QrCode} label={l.inputDrum} value={job.inputDrum || "-"} sub={l.trace} />
                <InfoTile icon={Gauge} label={l.startMeter} value={job.currentStartMeter ?? "-"} sub={l.running} />
                <InfoTile icon={CheckCircle2} label={l.completed} value={`${job.completedMeters} m`} sub={l.produced} />
                <InfoTile icon={Clock3} label={l.remaining} value={`${remaining} m`} sub={`${l.target}: ${job.targetMeters} m`} />
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-sm md:p-4">
              <h2 className="mb-3 text-lg font-black">{l.child}</h2>
              <div className="grid gap-2">
                {children.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-center text-sm font-bold text-slate-400">{l.noChild}</div>}
                {children.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-black">{childLabels[lang][item.type]}</div>
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700">{item.status === "PENDING_SUPERVISOR" ? l.pending : l.approved}</span>
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-500">{item.time} • {item.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-sm md:p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-black">{l.logs}</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{logs.length}</span>
              </div>
              <div className="grid gap-2">
                {logs.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-center text-sm font-bold text-slate-400">{l.noLogs}</div>}
                {logs.map((log) => (
                  <div key={log.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-black">{l.row} {log.rowNo}</div>
                      <span className={`rounded-full px-3 py-1 text-xs font-black ${log.status === "RUNNING" ? "bg-green-100 text-green-700" : log.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{log.status}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
                      <div><b>{l.startMeter}</b><br />{log.startMeter}</div>
                      <div><b>{l.endMeter}</b><br />{log.endMeter ?? "-"}</div>
                      <div><b>{l.inputDrum}</b><br />{log.inputDrum}</div>
                      <div><b>{l.outputDrum}</b><br />{log.outputDrum ?? "-"}</div>
                      <div><b>{l.produced}</b><br />{log.producedMeters} m</div>
                      <div><b>{l.reason}</b><br />{log.reason ? stopReasonLabels[lang][log.reason] : "-"}</div>
                      <div><b>{l.startJob}</b><br />{log.startTime}</div>
                      <div><b>{l.stopJob}</b><br />{log.endTime ?? "-"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-sm md:p-4">
                <h2 className="mb-3 text-lg font-black">{l.timeline}</h2>
                <div className="grid gap-2">
                  {events.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-center text-sm font-bold text-slate-400">{l.noEvents}</div>}
                  {events.map((event) => (
                    <div key={event.id} className="grid grid-cols-[70px_1fr] gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <div className="text-xs font-black text-slate-500">{event.time}</div>
                      <div>
                        <div className="font-black">{event.title}</div>
                        <div className="text-sm font-bold text-slate-500">{event.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-sm md:p-4">
                <h2 className="mb-3 text-lg font-black">{l.supervisorQueue}</h2>
                {!job.supervisorPending && !job.qcPending && children.filter((c) => c.status === "PENDING_SUPERVISOR").length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-center text-sm font-bold text-slate-400">{l.noApproval}</div>
                )}
                <div className="grid gap-2">
                  {job.qcPending && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm font-bold text-amber-900">{l.waitingQc}</div>}
                  {job.supervisorPending && <div className="rounded-2xl border border-orange-200 bg-orange-50 p-3 text-sm font-bold text-orange-900">{l.supervisorQueue}: {statusLabel(lang, job.status)}</div>}
                  {children.filter((c) => c.status === "PENDING_SUPERVISOR").map((c) => (
                    <div key={c.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold">
                      {childLabels[lang][c.type]} • {c.reason}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {modal.type === "START_JOB" && (
        <ModalShell title={l.startModalTitle} sub={l.startModalSub} onClose={closeModal}>
          <div className="grid gap-4">
            <Field label={l.startMeter} value={startMeter} onChange={setStartMeter} type="number" autoFocus />
            <Field label={l.inputDrum} value={inputDrum} onChange={setInputDrum} placeholder="DR-0001" />
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={closeModal} className="rounded-2xl border border-slate-200 py-4 text-sm font-black">{l.cancel}</button>
              <button type="button" disabled={!startMeter || !inputDrum.trim()} onClick={startJob} className="rounded-2xl bg-green-700 py-4 text-sm font-black text-white disabled:opacity-40">{l.startJob}</button>
            </div>
          </div>
        </ModalShell>
      )}

      {modal.type === "ADD_PRODUCTION" && (
        <ModalShell title={l.addModalTitle} sub={l.addModalSub} onClose={closeModal}>
          <div className="grid gap-4">
            <Field label={l.produced} value={productionMeters} onChange={setProductionMeters} type="number" autoFocus />
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={closeModal} className="rounded-2xl border border-slate-200 py-4 text-sm font-black">{l.cancel}</button>
              <button type="button" disabled={num(productionMeters) <= 0} onClick={addProduction} className="rounded-2xl bg-emerald-700 py-4 text-sm font-black text-white disabled:opacity-40">{l.save}</button>
            </div>
          </div>
        </ModalShell>
      )}

      {modal.type === "STOP_JOB" && (
        <ModalShell title={l.stopModalTitle} sub={l.stopModalSub} onClose={closeModal}>
          <div className="grid gap-4">
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">{l.reason}</span>
              <select value={stopReason} onChange={(e) => setStopReason(e.target.value as StopReason)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-lg font-black outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100">
                {(Object.keys(stopReasonLabels[lang]) as StopReason[]).map((reason) => (
                  <option key={reason} value={reason}>{stopReasonLabels[lang][reason]}</option>
                ))}
              </select>
            </label>

            {requiresOutputAndEnd && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={l.endMeter} value={endMeter} onChange={setEndMeter} type="number" />
                <Field label={l.outputDrum} value={outputDrum} onChange={setOutputDrum} placeholder="OUT-0001" />
              </div>
            )}

            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">{l.remarks}</span>
              <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} className="min-h-[96px] w-full rounded-2xl border border-slate-200 p-4 text-sm font-bold outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100" />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={closeModal} className="rounded-2xl border border-slate-200 py-4 text-sm font-black">{l.cancel}</button>
              <button type="button" disabled={requiresOutputAndEnd && (!endMeter || !outputDrum.trim())} onClick={stopJob} className="rounded-2xl bg-red-700 py-4 text-sm font-black text-white disabled:opacity-40">{l.confirm}</button>
            </div>
          </div>
        </ModalShell>
      )}

      {modal.type === "RESUME_JOB" && (
        <ModalShell title={l.resumeModalTitle} sub={l.resumeModalSub} onClose={closeModal}>
          <div className="grid gap-3">
            <InfoTile icon={Gauge} label={l.startMeter} value={latestLog?.endMeter ?? "-"} sub={l.resumeJob} />
            <InfoTile icon={QrCode} label={l.inputDrum} value={job.inputDrum || "-"} sub={l.trace} />
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={closeModal} className="rounded-2xl border border-slate-200 py-4 text-sm font-black">{l.cancel}</button>
              <button type="button" onClick={resumeJob} className="rounded-2xl bg-green-700 py-4 text-sm font-black text-white">{l.resumeJob}</button>
            </div>
          </div>
        </ModalShell>
      )}

      {modal.type === "QC_HOLD" && (
        <ModalShell title={l.qcModalTitle} sub={l.waitingQc} onClose={closeModal}>
          <div className="grid gap-4">
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">{l.remarks}</span>
              <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} className="min-h-[96px] w-full rounded-2xl border border-slate-200 p-4 text-sm font-bold outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100" />
            </label>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm font-bold text-amber-900">{l.waitingQc}</div>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={closeModal} className="rounded-2xl border border-slate-200 py-4 text-sm font-black">{l.cancel}</button>
              <button type="button" onClick={requestQcHold} className="rounded-2xl bg-amber-600 py-4 text-sm font-black text-white">{l.confirm}</button>
            </div>
          </div>
        </ModalShell>
      )}

      {modal.type === "REQUEST_ACTIVITY" && modal.activityType && (
        <ModalShell title={`${l.activityModalTitle}: ${childLabels[lang][modal.activityType]}`} sub={l.supervisorQueue} onClose={closeModal}>
          <div className="grid gap-4">
            <Field label={l.reason} value={activityReason} onChange={setActivityReason} autoFocus />
            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-3 text-sm font-bold text-orange-900">{l.supervisorQueue}</div>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={closeModal} className="rounded-2xl border border-slate-200 py-4 text-sm font-black">{l.cancel}</button>
              <button type="button" onClick={requestActivity} className="rounded-2xl bg-purple-700 py-4 text-sm font-black text-white">{l.confirm}</button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
}
