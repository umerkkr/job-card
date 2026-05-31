import { useState } from "react";
import JobCardLayout from "../DigitalJobcard/JobCardLayout";
import MachineTable from "../jobcardlayout/MachineTable";
import SpecialRequirementsTable from "../jobcardlayout/SpecialRequirementsTable";
import ProductionLog from "../jobcardlayout/ProductionLog";
import InfoTable from "../jobcardlayout/InfoTable";
import InputLotTable from "../jobcardlayout/InputLotTable";
import ArmouringDetailsTable from "../jobcardlayout/ArmouringDetailsTable";

const Armouring = ({ onBack }: any) => {
  const [isUrdu, setIsUrdu] = useState(true);
  const [open, setOpen] = useState(true);

  const t = (ur: string, en: string) => (isUrdu ? ur : en);

  const rows = [
    [
      { content: t("ورک آرڈر نمبر", "Work Order No") },
      { content: "PC -05696/2526, PC -05721/2526, PC -05729/2526" },
      { content: t("ہفتہ", "Week") },
      { content: "5" },
      { content: t("مہینہ", "Month") },
      { content: "Mar" },
      { content: t("سال", "Year") },
      { content: "2026" },
    ],
    [
      { content: t("تفصیل", "Description") },
      { content: "CU/PVC 1X95MM² (FLEXIBLE) 450/750 V (GREEN/YELLOW), CU/PVC/PVC 1x185 MM²", colSpan: 7 },
    ],
  ];

  return (
    <div className="mx-auto max-w-[1200px]">
      <button
        onClick={onBack}
        className="mb-3 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm"
      >
        ← Back
      </button>

      <JobCardLayout title="ARMOURING" isUrdu={isUrdu} setIsUrdu={setIsUrdu}>
        <div className="grid gap-3">
          <section className="overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#0b6d2f_0%,#0f7a36_55%,#0a5c27_100%)] p-5 text-white shadow-lg">
            <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                  {t("جابی کارڈ", "Job Card")}
                </div>
                <div className="mt-1 text-2xl font-black tracking-tight">
                  {t("آرمورنگ", "Armouring")}
                </div>
                <div className="mt-2 max-w-3xl text-sm font-semibold text-white/90">
                  {t(
                    "یہ صفحہ HTML والے ڈیزائن کی طرح اوپر ہیرو، سٹیٹس کارڈز اور نیچے collapsible details رکھتا ہے۔",
                    "This screen mirrors the HTML style with a hero, status cards, and collapsible details."
                  )}
                </div>
              </div>

              <div className="rounded-[22px] bg-white/10 p-4 backdrop-blur">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white/80">{t("پیش رفت", "Progress")}</span>
                  <span className="text-4xl font-black">42%</span>
                </div>
                <div className="mt-3 h-5 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full w-[42%] rounded-full bg-lime-400" />
                </div>
                <div className="mt-3 flex justify-between text-sm font-bold text-white/80">
                  <span>84 m</span>
                  <span>116 m</span>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: t("مشین", "Machine"), value: "PORT-DRUM-TWSTR" },
              { label: t("عمل", "Operation"), value: "ARMOURING" },
              { label: t("سائز", "Size"), value: "95 / 185" },
              { label: t("حالت", "Status"), value: t("جاری", "Running") },
            ].map((card) => (
              <div key={card.label} className="rounded-[20px] border border-slate-200 bg-slate-50 p-4 shadow-sm">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{card.label}</div>
                <div className="mt-2 text-lg font-black text-slate-950">{card.value}</div>
              </div>
            ))}
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white shadow-sm">
            <button
              onClick={() => setOpen(!open)}
              className="flex w-full items-center justify-between border-b border-slate-200 px-4 py-3 text-left"
            >
              <div>
                <div className="text-lg font-black text-slate-950">
                  {t("جاب کارڈ کی تفصیلات", "Job Card Details")}
                </div>
                <div className="text-sm font-semibold text-slate-500">
                  {t("تفصیلی جدول اور پروڈکشن لاگ", "Detailed tables and production log")}
                </div>
              </div>
              <span className={`text-xl transition-transform ${open ? "rotate-180" : ""}`}>▼</span>
            </button>

            <div className={`grid gap-3 p-4 transition-all duration-300 ${open ? "opacity-100" : "max-h-0 overflow-hidden p-0 opacity-0"}`}>
              <InfoTable rows={rows} />
              <MachineTable isUrdu={isUrdu} />
              <SpecialRequirementsTable isUrdu={isUrdu} />
              <InputLotTable isUrdu={isUrdu} />
              <ArmouringDetailsTable isUrdu={isUrdu} />
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
            <ProductionLog isUrdu={isUrdu} />
          </section>
        </div>
      </JobCardLayout>
    </div>
  );
};

export default Armouring;
