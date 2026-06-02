import {
  Bell,
  BookOpenText,
  CheckCircle2,
  Clock3,
  LayoutGrid,
  Plus,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Siren,
} from "lucide-react";

export type ActionKey =
  | "start"
  | "startJob"
  | "stop"
  | "qcHold"
  | "resume"
  | "complete"
  | "changeDrum"
  | "tooling"
  | "rewind"
  | "rework"
  | "breakdown"
  | "materialIssue"
  | "decisionPending";

export type ActionCardData = {
  key: ActionKey;
  title: string;
  urdu: string;
  subtitle: string;
  tone: string;
  icon: React.ComponentType<{ className?: string }>;
};

export const STANDARD_ACTION_CARDS: readonly ActionCardData[] = [
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

type Props = {
  cards: readonly ActionCardData[];
  onAction: (key: ActionKey) => void;
  disabledKeys?: Partial<Record<ActionKey, boolean>>;
  title?: string;
  subtitle?: string;
  showClock?: boolean;
};

const toneMap: Record<string, string> = {
  green: "border-emerald-300 bg-emerald-50 text-emerald-950",
  red: "border-red-300 bg-red-50 text-red-950",
  amber: "border-amber-300 bg-amber-50 text-amber-950",
  emerald: "border-green-300 bg-green-50 text-green-950",
  green2: "border-emerald-300 bg-emerald-50 text-emerald-950",
  slate: "border-slate-300 bg-slate-50 text-slate-950",
  violet: "border-violet-300 bg-violet-50 text-violet-950",
  orange: "border-orange-300 bg-orange-50 text-orange-950",
  red2: "border-red-300 bg-red-50 text-red-950",
  amber2: "border-amber-300 bg-amber-50 text-amber-950",
  brown: "border-orange-300 bg-orange-50 text-orange-950",
};

function ActionCard({ item, onClick, disabled }: { item: ActionCardData; onClick: () => void; disabled?: boolean }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex min-h-[66px] min-w-[116px] items-center gap-2 rounded-xl border px-2.5 py-2 text-left shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${toneMap[item.tone]}`}
    >
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/90 shadow-sm">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="truncate text-[12px] font-black uppercase leading-tight tracking-wide">{item.title}</div>
        <div className="truncate text-[10px] font-bold leading-tight opacity-80">{item.urdu}</div>
        <div className="mt-0.5 truncate text-[10px] font-bold leading-tight opacity-70">{item.subtitle}</div>
      </div>
    </button>
  );
}

export default function LayingUpActionPanel({
  cards,
  onAction,
  disabledKeys = {},
  title = "Live Execution Action Panel",
  subtitle = "All operator buttons are in one easy row. Swipe left/right if the tablet is narrow.",
  showClock = true,
}: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[14px] font-black">{title}</div>
          <div className="truncate text-[10px] text-slate-500">{subtitle}</div>
        </div>
        {showClock && (
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-slate-200">
            <Clock3 className="h-4 w-4 text-slate-400" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {cards.map((item) => (
          <ActionCard
            key={item.key}
            item={item}
            onClick={() => onAction(item.key)}
            disabled={!!disabledKeys[item.key]}
          />
        ))}
      </div>
    </section>
  );
}
