const ExtrusionDetailsTable = ({ isUrdu }: { isUrdu: boolean }) => {
  const t = (ur: string, en: string) => (isUrdu ? ur : en);

  return (
    <table className="w-full border border-black border-collapse text-[11px] mb-2">
      
      <thead>
        <tr className="bg-gray-200 text-center">
          <th colSpan={2} className="border border-black">
            {t("ریڈیل موٹائی", "Radial Thickness (mm)")}
          </th>
          <th colSpan={2} className="border border-black">
            {t("قطر", "Diameter/Depth (mm)")}
          </th>
          <th className="border border-black">
            {t("ایمبوسنگ", "Special Embossing / Printing")}
          </th>
          <th className="border border-black">{t("اونچائی", "Height")}</th>
          <th className="border border-black">{t("چوڑائی", "Width")}</th>
          <th className="border border-black">{t("پی وی سی", "PVC (Kg)")}</th>
          <th className="border border-black">{t("رنگ", "Color")}</th>
          <th className="border border-black">{t("موصل", "Conductor Screen")}</th>
          <th className="border border-black">{t("XLPE", "XLPE (Kg)")}</th>
          <th className="border border-black">Catalyst (Kg)</th>
          <th className="border border-black">Insulation Screen (Kg)</th>
          <th className="border border-black">XLPO (Kg)</th>
          <th className="border border-black">HFFR / LSZH (Kg)</th>
          <th className="border border-black">XLHFFR (Kg)</th>
          <th className="border border-black">Master Batch 1 (Kg)</th>
          <th className="border border-black">Master Batch 2 (Kg)</th>
        </tr>

        <tr className="bg-gray-100 text-center">
          <th className="border border-black">{t("نامی", "Nominal")}</th>
          <th className="border border-black">{t("کم-زیادہ", "Min - Max")}</th>
          <th className="border border-black">{t("نامی", "Nominal")}</th>
          <th className="border border-black">{t("زیادہ", "Max")}</th>
          <th colSpan={14} className="border border-black"></th>
        </tr>
      </thead>

      <tbody>
        <tr className="text-center">
          <td className="border border-black">1.4</td>
          <td className="border border-black">1.16 - 1.54</td>
          <td className="border border-black">12.04</td>
          <td className="border border-black">10.63</td>
          <td className="border border-black">-</td>
          <td className="border border-black">10.35</td>
          <td className="border border-black">13.2</td>
          <td className="border border-black">11</td>
          <td className="border border-black">YELLOW</td>
          <td className="border border-black"></td>
          <td className="border border-black"></td>
          <td className="border border-black"></td>
          <td className="border border-black"></td>
          <td className="border border-black"></td>
          <td className="border border-black"></td>
          <td className="border border-black"></td>
          <td className="border border-black">.2216</td>
          <td className="border border-black"></td>
        </tr>

        <tr>
          <td colSpan={18} className="border border-black p-1">
            <strong>{t("ایمبوسنگ", "Embossing")}:</strong>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default ExtrusionDetailsTable;