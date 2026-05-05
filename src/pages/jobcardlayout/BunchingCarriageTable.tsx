const BunchingCarriageTable = ({ isUrdu }: { isUrdu: boolean }) => {
  const t = (u: string, e: string) => (isUrdu ? u : e);

  return (
    <table className="w-full border text-sm">
      <thead>
        <tr className="bg-gray-200">
          <th>{t("کیریج", "Carriage")}</th>
          <th>{t("وائرز", "No of wires")}</th>
          <th>{t("لے", "Lay")}</th>
          <th>{t("ڈائریکشن", "Direction")}</th>
        </tr>
      </thead>
      <tbody className="text-center">
        <tr><td>CENTER</td><td>27</td><td>-</td><td>-</td></tr>
        <tr><td>1st</td><td>0</td><td>30</td><td>LH</td></tr>
      </tbody>
    </table>
  );
};

export default BunchingCarriageTable;