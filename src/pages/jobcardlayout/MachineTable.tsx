const MachineTable = ({ isUrdu }: any) => {

  return (
    <div className="border mb-2">
      <button
        className="w-full flex items-center justify-between px-2 py-1 bg-gray-100 text-xs font-semibold border-b"
      >
        <span>
          Machine Table
        </span>
      </button>

      <div
        // className={`overflow-hidden transition-all duration-300 ${
        //   open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        // }`}
      >
        <table className="w-full  text-[11px] mb-2">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="border border-black">
                {isUrdu ? "مشین" : "Machine"}
              </th>

              <th className="border border-black">
                {isUrdu ? "عمل" : "Operation"}
              </th>

              <th className="border border-black">
                {isUrdu ? "سائز" : "Size (mm²)"}
              </th>

              <th className="border border-black">
                {isUrdu ? "آرڈر کی لمبائی" : "Order Length (m)"}
              </th>

              <th className="border border-black">
                {isUrdu ? "منصوبہ بند گھنٹے" : "Planned Hours"}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr className="text-center">
              <td className="border border-black">
                QUIENS-ARMORING
              </td>

              <td className="border border-black">
                ARMOURING
              </td>
              <td className="border border-black">50</td>
              <td className="border border-black">145 m</td>
              <td className="border border-black">1.0357</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MachineTable;