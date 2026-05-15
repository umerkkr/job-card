
interface ArmouringDetailsTableProps {
  isUrdu?: boolean;
}

const ArmouringDetailsTable = ({ isUrdu = false }: ArmouringDetailsTableProps) => {
  const t = (u: string, e: string) => (isUrdu ? u : e);

  return (
    <div className="mb-2">
      <table className="w-full border border-black border-collapse text-[11px]">
        <thead>
          <tr className="bg-gray-100 text-center font-bold">
            <th className="border border-black p-1">
              {t("اسٹیل/المونیم/تانبا", "STEEL/ALM/CU")}
            </th>
            <th className="border border-black p-1">
              {t("تار کا سائز", "Size of wires")}
            </th>
            <th className="border border-black p-1">
              {t("تاروں کی تعداد", "No. of Wires")}
            </th>
            <th className="border border-black p-1">
              {t("لے کی لمبائی", "Lay Length (mm)")}
            </th>
            <th className="border border-black p-1">
              {t("لے کی سمت", "Lay Direction")}
            </th>
            <th className="border border-black p-1">
              {t("کل ڈایا", "Overall Dia (OD)")}
            </th>
            <th className="border border-black p-1">
              {t("لمبائی", "Length")}
            </th>
            <th className="border border-black p-1">A</th>
            <th className="border border-black p-1">B</th>
            <th className="border border-black p-1">C</th>
            <th className="border border-black p-1">D</th>
            <th className="border border-black p-1">
              {t("سلائڈنگ گیئر", "SLIDING GEAR")}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center h-8">
            <td className="border border-black px-1 font-bold">SWA</td>
            <td className="border border-black px-1">1.6</td>
            <td className="border border-black px-1">53</td>
            <td className="border border-black px-1">299</td>
            <td className="border border-black px-1">LH</td>
            <td className="border border-black px-1"></td>
            <td className="border border-black px-1"></td>
            <td className="border border-black px-1"></td>
            <td className="border border-black px-1"></td>
            <td className="border border-black px-1"></td>
            <td className="border border-black px-1"></td>
            <td className="border border-black px-1"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ArmouringDetailsTable;