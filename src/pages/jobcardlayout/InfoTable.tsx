const InfoTable = ({ rows }: any) => {
  return (
    <table className="w-full border text-[11px] table-fixed mb-2">
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
  );
};

export default InfoTable;