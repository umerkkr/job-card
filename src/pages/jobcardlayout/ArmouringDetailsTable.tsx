import { useState } from "react";

const ArmouringDetailsTable = ({}: any) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-2 py-1 bg-gray-100 text-xs font-semibold border-b"
      >
        <span>Armouring Details</span>

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
            <tr className="bg-gray-100 text-center">
              <th className="border border-black">STEEL/ALM/CU</th>

              <th className="border border-black">
                Size of wires
              </th>

              <th className="border border-black">
                No. of Wires
              </th>

              <th className="border border-black">
                Lay Length (mm)
              </th>

              <th className="border border-black">
                Lay Direction
              </th>

              <th className="border border-black">
                Overall Dia (OD)
              </th>

              <th className="border border-black">Length</th>

              <th className="border border-black">A</th>

              <th className="border border-black">B</th>

              <th className="border border-black">C</th>

              <th className="border border-black">D</th>

              <th className="border border-black">
                SLIDING GEAR
              </th>
            </tr>
          </thead>

          <tbody>
            <tr className="text-center">
              <td className="border border-black">SWA</td>

              <td className="border border-black">1.6</td>

              <td className="border border-black">53</td>

              <td className="border border-black">299</td>

              <td className="border border-black">LH</td>

              <td className="border border-black"></td>

              <td className="border border-black"></td>

              <td className="border border-black"></td>

              <td className="border border-black"></td>

              <td className="border border-black"></td>

              <td className="border border-black"></td>

              <td className="border border-black"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArmouringDetailsTable;