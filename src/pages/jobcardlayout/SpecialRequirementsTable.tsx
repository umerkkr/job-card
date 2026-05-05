const SpecialRequirementsTable = ({ isUrdu }: any) => {
  return (
    <table className="w-full border text-[11px] mb-2">

      <tbody>

        <tr>
          <th className="border p-1 w-[180px] bg-gray-100">
            {isUrdu ? "خصوصی ضروریات" : "Special Requirements"}
          </th>
          <td colSpan={3} className="border p-1">
            <input className="w-full font-bold outline-none" />
          </td>
        </tr>

        <tr className="bg-gray-100">
          <th className="border p-1">
            {isUrdu ? "ان پٹ لاٹ (ڈرم) نمبر" : "Input Lot (Drum) No"}
          </th>
          <th className="border p-1">
            {isUrdu ? "لمبائی (میٹر)" : "Length (m)"}
          </th>
          <th className="border p-1">
            {isUrdu ? "رنگ" : "Color"}
          </th>
          <th className="border p-1">
            {isUrdu ? "پیکنگ لمبائی (میٹر)" : "Packing Length (m)"}
          </th>
        </tr>

        <tr className="text-center">
          <td className="border p-1">
            <input className="w-full font-bold outline-none text-center" />
          </td>

          <td className="border p-1">
            <input className="w-full font-bold outline-none text-center" />
          </td>

          <td className="border p-1 font-bold">
            {isUrdu ? "رنگ منتخب کریں" : "|"}
          </td>

          <td className="border p-1">
            <input
              defaultValue="19118.25, 9778.61, 6156.9"
              className="w-full font-bold outline-none text-center"
              readOnly
            />
          </td>
        </tr>

      </tbody>

    </table>
  );
};

export default SpecialRequirementsTable;