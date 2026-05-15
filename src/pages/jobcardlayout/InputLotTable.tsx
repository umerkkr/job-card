const InputLotTable = ({ isUrdu }: any) => {

  return (
    <div className="border mb-2">

      <div
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