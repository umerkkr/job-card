import { useState } from "react";

const InputLotTable = ({ isUrdu }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-2 py-1 bg-gray-100 text-xs font-semibold border-b"
      >
        <span>
          {isUrdu ? "ان پٹ لاٹ کی تفصیلات" : "Input Lot Details"}
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
          open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <table className="w-full border border-black border-collapse text-[11px] mb-2">
          <thead>
            <tr className="text-center bg-gray-100">
              <th className="border border-black">
                {isUrdu ? "ان پٹ لاٹ نمبر" : "Input Lot (Drum) No"}
              </th>

              <th className="border border-black">
                {isUrdu ? "لمبائی" : "Length (m)"}
              </th>

              <th className="border border-black">
                {isUrdu ? "رنگ" : "Color"}
              </th>

              <th className="border border-black">
                {isUrdu ? "پیکنگ لمبائی" : "Packing Length (m)"}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr className="text-center">
              <td className="border border-black"></td>

              <td className="border border-black"></td>

              <td className="border border-black">|</td>

              <td className="border border-black">148</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InputLotTable;