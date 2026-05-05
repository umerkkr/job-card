const TapeDetailsTable = ({ isUrdu }: any) => {
  return (
    <table className="w-full border border-black border-collapse text-[11px] mb-2">
      <thead>
        <tr className="bg-gray-100 text-center">
          <th className="border border-black">
            {isUrdu ? "مواد کی قسم" : "Material Type"}
          </th>
          <th className="border border-black">
            {isUrdu ? "موٹائی" : "Tape Thickness"}
          </th>
          <th className="border border-black">
            {isUrdu ? "چوڑائی" : "Tape Width"}
          </th>
          <th className="border border-black">
            {isUrdu ? "اوورلیپ" : "Overlap (mm)"}
          </th>
          <th className="border border-black">
            {isUrdu ? "اوورلیپنگ" : "Overlapping"}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr className="text-center">
          <td className="border border-black">CU</td>
          <td className="border border-black">0.075</td>
          <td className="border border-black">30</td>
          <td className="border border-black">15</td>
          <td className="border border-black">50</td>
        </tr>
      </tbody>
    </table>
  );
};

export default TapeDetailsTable;