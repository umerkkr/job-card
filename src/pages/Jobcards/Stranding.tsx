import { useState } from "react";
import JobCardLayout from "../DigitalJobcard/JobCardLayout";
import ProductionLog from "../jobcardlayout/ProductionLog";

const Stranding = ({ onBack }: any) => {
  const [isUrdu, setIsUrdu] = useState(true);
  const [open, setOpen] = useState(false);

  const t = (u: string, e: string) => (isUrdu ? u : e);

  return (
    <div className="max-w-[1200px] mx-auto">
      <button
        onClick={onBack}
        className="mb-3 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
      >
        ← {t("پیچھے", "Back")}
      </button>

      <JobCardLayout
        // title={t("STRANDING")}
        title="STRANDING"
        isUrdu={isUrdu}
        setIsUrdu={setIsUrdu}
      >
        <div className="text-[11px] bg-white">
          {/* Header Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between bg-gray-100 border-b border-black px-3 py-2 font-bold text-[13px]"
          >
            <span>{t("جاب کارڈ کی تفصیلات", "JOB CARD DETAILS")}</span>
            <span className={`transition-transform ${open ? "rotate-180" : ""}`}>▼</span>
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[5000px]" : "max-h-0"}`}>

            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border border-black p-1 font-bold bg-gray-50">{t("ورک آرڈر نمبر", "Work Order No")}</td>
                  <td className="border border-black p-1">LX -00025/2526</td>
                  <td className="border border-black p-1 font-bold bg-gray-50 text-center">{t("ہفتہ", "Week")}</td>
                  <td className="border border-black p-1 text-center">2</td>
                  <td className="border border-black p-1 font-bold bg-gray-50 text-center">{t("مہینہ", "Month")}</td>
                  <td className="border border-black p-1 text-center">Jul</td>
                  <td className="border border-black p-1 font-bold bg-gray-50 text-center">{t("سال", "Year")}</td>
                  <td className="border border-black p-1 text-center">2025</td>
                </tr>
                <tr>
                  <td className="border border-black p-1 font-bold bg-gray-50">{t("تفصیل", "Description")}</td>
                  <td colSpan={7} className="border border-black p-1 font-medium">
                    CU/XLPE/SWA/PVC 3X150 MM² 6.35/11 KV (TRIPLE EXT.)
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Table 2: Machine Details */}
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 font-bold text-center">
                  <td className="border border-black p-1">{t("مشین", "Machine")}</td>
                  <td className="border border-black p-1">{t("آپریشن", "Operation")}</td>
                  <td className="border border-black p-1">{t("سائز", "Size (mm²)")}</td>
                  <td className="border border-black p-1">{t("آرڈر لمبائی", "Order length (m)")}</td>
                  <td className="border border-black p-1">C.Spec</td>
                  <td className="border border-black p-1">{t("بیچ نمبر", "Batch No")}</td>
                  <td className="border border-black p-1">{t("پلان شدہ گھنٹے", "Planned Hours")}</td>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td className="border border-black p-2 font-bold">37-BOBBIN</td>
                  <td className="border border-black p-2">STRANDING</td>
                  <td className="border border-black p-2">150</td>
                  <td className="border border-black p-2">500 m</td>
                  <td className="border border-black p-2">MVC-277</td>
                  <td className="border border-black p-2 text-[10px]">GCF-A-STR-37-BOBBING25-145004</td>
                  <td className="border border-black p-2">2.239</td>
                </tr>
              </tbody>
            </table>

            {/* Table 3: Assembly & Qty */}
            <table className="w-full border-collapse mt-1">
              <thead>
                <tr className="bg-gray-100 font-bold text-center">
                  <td className="border border-black p-1 w-[30%]">{t("سب اسمبلی کی تفصیل", "Sub Assembly Description")}</td>
                  <td className="border border-black p-1">{t("پچھلا بیچ", "Previous Batch")}</td>
                  <td className="border border-black p-1">{t("اگلا بیچ", "Next Batch")}</td>
                  <td className="border border-black p-1">{t("اصل مقدار", "Actual Qty")}</td>
                  <td className="border border-black p-1">{t("منصوبہ شدہ", "Planned Qty")}</td>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td className="border border-black p-2 text-left italic">150mm² Circular Compacted PAC (CL2) Conductor(36x2.33mm)</td>
                  <td className="border border-black p-2 text-[9px]">GCF-A-DRA-M-85G25-145005</td>
                  <td className="border border-black p-2 text-[9px]">PCF-INS-SIOPLASG25-145001...</td>
                  <td className="border border-black p-2 font-bold">1528 m</td>
                  <td className="border border-black p-2">1522.5 m</td>
                </tr>
              </tbody>
            </table>

            {/* NEW STRANDING TABLE: P/S Lay & Carriage Details */}
            {/* P/S Lay (mm) Section */}
            <div className="bg-gray-200 text-black p-1 px-3 font-bold mt-1">
              {t("پی/ایس لے (ملی میٹر)", "P/S Lay (mm)")}
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 font-bold text-center">
                  <td className="border border-black p-1">{t("سیکشن", "Section")}</td>
                  <td className="border border-black p-1">{t("تاروں کی تعداد", "No of wires")}</td>
                  <td className="border border-black p-1">{t("لے (ملی میٹر)", "Lay (mm)")}</td>
                  <td className="border border-black p-1">{t("سمت", "Direction")}</td>
                  <td className="border border-black p-1">{t("کل ڈایا", "Overall Dia (OD)")}</td>
                  <td className="border border-black p-1">{t("گیئر", "Gear")}</td>
                </tr>
              </thead>
              <tbody className="text-center">
                <tr>
                  <td className="border border-black p-1 font-bold bg-gray-50">{t("سینٹر", "CENTER")}</td>
                  <td className="border border-black p-1">1</td>
                  <td className="border border-black p-1">-</td>
                  <td className="border border-black p-1">-</td>
                  <td className="border border-black p-1">-</td>
                  <td className="border border-black p-1">-</td>
                </tr>
                <tr>
                  <td className="border border-black p-1 font-bold bg-gray-50">{t("پہلا کیریج", "1ST CARRIAGE")}</td>
                  <td className="border border-black p-1">6</td>
                  <td className="border border-black p-1">210</td>
                  <td className="border border-black p-1">RH</td>
                  <td className="border border-black p-1">6.55</td>
                  <td className="border border-black p-1"></td>
                </tr>
                <tr>
                  <td className="border border-black p-1 font-bold bg-gray-50">{t("دوسرا کیریج", "2ND CARRIAGE")}</td>
                  <td className="border border-black p-1">11</td>
                  <td className="border border-black p-1">210</td>
                  <td className="border border-black p-1">LH</td>
                  <td className="border border-black p-1">10.55</td>
                  <td className="border border-black p-1"></td>
                </tr>
                <tr>
                  <td className="border border-black p-1 font-bold bg-gray-50">{t("تیسرا کیریج", "3RD CARRIAGE")}</td>
                  <td className="border border-black p-1">18</td>
                  <td className="border border-black p-1">235</td>
                  <td className="border border-black p-1">RH</td>
                  <td className="border border-black p-1">14.4</td>
                  <td className="border border-black p-1"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Production Log starts here */}
          <ProductionLog isUrdu={isUrdu} />
        </div>
      </JobCardLayout>
    </div>
  );
};

export default Stranding;