import { RefreshCw } from "lucide-react";

type TopCard = {
  label: string;
  value: string;
  sub: string;
};

type InfoItem = {
  label: string;
  value: string;
};

type Props = {
  title: string;
  subtitle: string;
  onBack: () => void;
  onToggleLanguage?: () => void;
  languageLabel?: string;
  topLeft: React.ReactNode;
  topRightCards: TopCard[];
  infoItems: InfoItem[];
  actionPanel: React.ReactNode;
  lowerLeft?: React.ReactNode;
  lowerCenter?: React.ReactNode;
  lowerRight?: React.ReactNode;
  statusText: string;
  timerLabel: string;
  onRefresh: () => void;
  footerLabel?: string;
};

function SmallCard({ label, value, sub }: TopCard) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-2 py-2 shadow-sm">
      <div className="text-[9px] font-black uppercase text-slate-500">{label}</div>
      <div className="truncate text-[12px] font-black">{value}</div>
      <div className="truncate text-[10px] text-slate-500">{sub}</div>
    </div>
  );
}

function InfoBox({ label, value }: InfoItem) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5">
      <div className="truncate text-[9px] font-black text-slate-500">{label}</div>
      <div className="truncate text-[12px] font-black">{value}</div>
    </div>
  );
}

export default function JobCardPageShell({
  title,
  subtitle,
  onBack,
  onToggleLanguage,
  languageLabel,
  topLeft,
  topRightCards,
  infoItems,
  actionPanel,
  lowerLeft,
  lowerCenter,
  lowerRight,
  statusText,
  timerLabel,
  onRefresh,
  footerLabel = "JOB TIMER",
}: Props) {
  return (
    <div className="min-h-screen bg-[#f4f6f8] p-2 text-slate-950" style={{ fontFamily: "Ubuntu, sans-serif" }}>
      <div className="mx-auto flex max-w-[1400px] flex-col gap-2">
        <header className="sticky top-1 z-30 rounded-2xl border border-slate-200 bg-white/95 px-2 py-1.5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <button onClick={onBack} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black">{"<-"} Back</button>
            <div className="text-center">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-green-700">{title}</div>
              <div className="text-lg font-black">{subtitle}</div>
            </div>
            {onToggleLanguage ? (
              <button onClick={onToggleLanguage} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black">
                {languageLabel}
              </button>
            ) : (
              <div className="h-10 w-[116px]" />
            )}
          </div>
        </header>

        <section className="grid gap-2 xl:grid-cols-[1.55fr_1fr]">
          {topLeft}
          <div className="grid grid-cols-2 gap-2">
            {topRightCards.map((card) => <SmallCard key={`${card.label}-${card.value}`} {...card} />)}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex w-full items-center justify-between rounded-2xl px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="text-[13px] font-black">Job Card Information</div>
            </div>
          </div>
          <div className="border-t border-slate-200 p-2 pt-1.5">
            <div className="grid grid-cols-4 gap-1.5 md:grid-cols-8">
              {infoItems.map((item) => <InfoBox key={item.label} {...item} />)}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          {actionPanel}
        </section>

        {lowerLeft || lowerCenter || lowerRight ? (
          <section className="grid gap-2 lg:grid-cols-[1fr_1fr_1.15fr]">
            {lowerLeft}
            {lowerCenter}
            {lowerRight}
          </section>
        ) : null}

        <footer className="sticky bottom-1 z-20 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <div className="grid grid-cols-3 items-center gap-2 text-[11px] font-bold text-slate-700">
            <div>
              MACHINE STATUS: <span className="font-black text-amber-700">{statusText}</span>
            </div>
            <div className="text-center">
              {footerLabel}: <b>{timerLabel}</b>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button onClick={onRefresh} className="grid h-7 w-7 place-items-center rounded-full border border-slate-200">
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
