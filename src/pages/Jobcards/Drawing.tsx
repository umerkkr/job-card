import { useState } from "react";
import JobCardLayout from "../DigitalJobcard/JobCardLayout";
import ProductionLog from "../jobcardlayout/ProductionLog";

const WireDrawing = ({ onBack }: any) => {
  const [isUrdu, setIsUrdu] = useState(false);

  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-[1200px] mx-auto">
      <button
        onClick={onBack}
        className="mb-3 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
      >
        ← Back
      </button>

      <JobCardLayout
        title={isUrdu ? "وائر ڈرائنگ" : "WIRE DRAWING"}
        isUrdu={isUrdu}
        setIsUrdu={setIsUrdu}
      >
        <div className="border border-black text-[11px]">

          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between bg-gray-100 border-b border-black px-3 py-2 font-bold text-[13px]"
          >
            <span>
              {isUrdu
                ? "جاب کارڈ کی تفصیلات"
                : "JOB CARD DETAILS"}
            </span>

            <span
              className={`transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              open
                ? "max-h-[5000px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >

            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border border-black p-1 font-bold w-[140px]">
                    {isUrdu ? "ورک آرڈر نمبر" : "Work Order No"}
                  </td>

                  <td className="border border-black p-1 w-[220px]">
                    LX-05967/2526
                  </td>

                  <td className="border border-black p-1 font-bold w-[70px] text-center">
                    {isUrdu ? "ہفتہ" : "Week"}
                  </td>

                  <td className="border border-black p-1 text-center w-[50px]">
                    3
                  </td>

                  <td className="border border-black p-1 font-bold w-[70px] text-center">
                    {isUrdu ? "مہینہ" : "Month"}
                  </td>

                  <td className="border border-black p-1 text-center w-[60px]">
                    Apr
                  </td>

                  <td className="border border-black p-1 font-bold w-[70px] text-center">
                    {isUrdu ? "سال" : "Year"}
                  </td>

                  <td className="border border-black p-1 text-center">
                    2026
                  </td>
                </tr>
              </tbody>
            </table>

            {/* MACHINE TABLE */}
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black p-1">
                    {isUrdu ? "مشین" : "Machine"}
                  </th>

                  <th className="border border-black p-1">
                    {isUrdu ? "آپریشن" : "Operation"}
                  </th>

                  <th className="border border-black p-1">
                    {isUrdu ? "سائز" : "Size (mm²)"}
                  </th>

                  <th className="border border-black p-1">
                    {isUrdu ? "آرڈر لمبائی" : "Order length (m)"}
                  </th>

                  <th className="border border-black p-1">
                    C.Spec
                  </th>

                  <th className="border border-black p-1">
                    {isUrdu ? "بیچ نمبر" : "Batch No"}
                  </th>

                  <th className="border border-black p-1">
                    {isUrdu ? "پلان شدہ گھنٹے" : "Planned Hours"}
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="border border-black p-2 text-center">
                    M-85
                  </td>

                  <td className="border border-black p-2 text-center">
                    WIRE_DRAWING
                  </td>

                  <td className="border border-black p-2 text-center">
                    150
                  </td>

                  <td className="border border-black p-2 text-center">
                    2000 m
                  </td>

                  <td className="border border-black p-2 text-center">
                    LVC-821
                  </td>

                  <td className="border border-black p-2 text-center">
                    GCF-A-DRA-M-85D26-178024
                  </td>

                  <td className="border border-black p-2 text-center">
                    9.5584
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="w-full border-collapse mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black p-1">
                    {isUrdu ? "اصل مقدار" : "Actual Qty"}
                  </th>

                  <th className="border border-black p-1">
                    {isUrdu ? "منصوبہ شدہ مقدار" : "Planned Qty"}
                  </th>

                  <th className="border border-black p-1">
                    {isUrdu ? "باقی مقدار" : "Remaining Qty"}
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="border border-black p-2 text-center">
                    25878.0584 m
                  </td>

                  <td className="border border-black p-2 text-center">
                    277376.06 m
                  </td>

                  <td className="border border-black p-2 text-center">
                    1998.58575
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="w-full border-collapse mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black p-1 text-left">
                    {isUrdu
                      ? "خصوصی ضروریات"
                      : "Special Requirements"}
                  </th>

                  <th className="border border-black p-1">
                    {isUrdu
                      ? "ان پٹ لاٹ"
                      : "Input Lot (Drum) No"}
                  </th>

                  <th className="border border-black p-1">
                    {isUrdu ? "لمبائی" : "Length (m)"}
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="border border-black p-2">
                    Plain Annealed CU of dia 2.33 mm
                  </td>

                  <td className="border border-black p-2 text-center">
                    2265, 1087, 4238
                  </td>

                  <td className="border border-black p-2 text-center">
                    677.5125, 1518.8827
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="w-full border-collapse mt-2">
              <thead>
                <tr className="bg-gray-100">

                  <th className="border border-black p-1">
                    {isUrdu ? "ان لیٹ سائز" : "Inlet Size"}
                  </th>

                  <th className="border border-black p-1">
                    {isUrdu ? "فنش سائز" : "Finish Size"}
                  </th>

                  <th className="border border-black p-1">
                    {isUrdu ? "پیکنگ اسٹینڈرڈ" : "Packing Standards"}
                  </th>

                  <th className="border border-black p-1">
                    {isUrdu
                      ? "کل اسپول مقدار"
                      : "Total Spool Quantity"}
                  </th>

                  <th className="border border-black p-1">
                    {isUrdu
                      ? "فلیکسیبل اسپول"
                      : "Flexible Spools"}
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>

                  <td className="border border-black p-2 text-center">
                    8
                  </td>

                  <td className="border border-black p-2 text-center">
                    2.33
                  </td>

                  <td className="border border-black p-2 text-center">
                    630mm (H/ Blue)
                  </td>

                  <td className="border border-black p-2 text-center">
                    1 × 36 × 7704.9056
                  </td>

                  <td className="border border-black p-2 text-center">
                    (W × S × L × Set)
                  </td>
                </tr>
              </tbody>
            </table>

          </div>

          <ProductionLog isUrdu={isUrdu} />

        </div>
      </JobCardLayout>
    </div>
  );
};

export default WireDrawing;