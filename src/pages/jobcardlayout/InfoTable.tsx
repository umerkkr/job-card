import { useState } from "react";

const InfoTable = ({ rows, }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-2 py-1 bg-gray-100 text-xs font-semibold border-b"
      >
        <span>Info Table</span>
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
        <table className="w-full border text-[11px] table-fixed">
          <tbody>
            {rows.map((row: any, i: number) => (
              <tr key={i}>
                {row.map((cell: any, j: number) => (
                  <td
                    key={j}
                    colSpan={cell?.colSpan || 1}
                    rowSpan={cell?.rowSpan || 1}
                    className="border p-1 text-center"
                  >
                    {cell?.content || cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InfoTable;