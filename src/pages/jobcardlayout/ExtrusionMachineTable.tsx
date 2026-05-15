const ExtrusionMachineTable = ({ isUrdu }: any) => {
  return (
    <table className="w-full border border-black border-collapse text-[11px] mb-2">
      <thead>
        <tr className="bg-gray-100 text-center">
          <th className="border border-black">
            {isUrdu ? "مشین" : "Machine"}
          </th>
          <th className="border border-black">
            {isUrdu ? "عمل" : "Operation"}
          </th>
          <th className="border border-black">
            {isUrdu ? "کیبل سائز" : "Cable Size (mm²)"}
          </th>
          <th className="border border-black">
            {isUrdu ? "سائز" : "Size (mm²)"}
          </th>
          <th className="border border-black">
            {isUrdu ? "آرڈر کی لمبائی" : "Order Length (m)"}
          </th>
          <th className="border border-black">
            {isUrdu ? "سیکوینس مارکنگ" : "Seq. Marking"}
          </th>
          <th className="border border-black">
            {isUrdu ? "منصوبہ بند گھنٹے" : "Planned Hours"}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr className="text-center font-bold">
          <td className="border border-black">SIOPLAS</td>
          <td className="border border-black">
             INSULATING_MV
            {/* {isUrdu ? "انسولیٹنگ" : "INSULATING"} */}
          </td>
          <td className="border border-black"> 150</td>
          <td className="border border-black"> 150</td>
          <td className="border border-black">500 m</td>
          <td className="border border-black">—</td>
          <td className="border border-black"> 1.6917</td>
        </tr>
      </tbody>
    </table>
  );
};

export default ExtrusionMachineTable;