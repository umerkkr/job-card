const InfoTable = ({ rows, }: any) => {

  return (
    <div className="border mb-2">
      <button
        className="w-full flex items-center justify-between px-2 py-1 bg-gray-100 text-xs font-semibold border-b"
      >
        <span>Info Table</span>
        
      </button>
      <div
        className={""}
      >
        <table className="w-full border text-[11px] table-fixed">
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
      </div>
    </div>
  );
};

export default InfoTable;