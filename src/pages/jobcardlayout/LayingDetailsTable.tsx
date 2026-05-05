const LayingDetailsTable = ({ isUrdu }: any) => {
  return (
    <table className="w-full border border-black border-collapse text-[11px] mb-2">
      <thead>
        <tr className="bg-gray-100 text-center">
          <th className="border border-black">
            {isUrdu ? "لے لمبائی" : "Lay Length (mm)"}
          </th>
          <th className="border border-black">
            {isUrdu ? "ٹیپ سائز" : "P/P tape size (mm)"}
          </th>
          <th className="border border-black">
            {isUrdu ? "اوورلیپ" : "Overlap (mm)"}
          </th>
          <th className="border border-black">
            {isUrdu ? "سمت" : "Lay direction (RH/LH)"}
          </th>
          <th className="border border-black">
            {isUrdu ? "بیرونی قطر" : "OD (mm)"}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr className="text-center">
          <td className="border border-black">679</td>
          <td className="border border-black">40</td>
          <td className="border border-black">4</td>
          <td className="border border-black">RH</td>
          <td className="border border-black">24.25</td>
        </tr>
      </tbody>
    </table>
  );
};

export default LayingDetailsTable;