const formatLabel = (key: string) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());

const ChangeDrumStep = ({ changeDrumData, setChangeDrumData, onSave }: any) => {
  return (
    <div className="space-y-5">
      <div className="border-b pb-3">
        <p className="text-lg text-black font-medium">
  Update Drum Details
</p>
      </div>

      <div className="grid grid-cols-2 gap-4">

        {Object.keys(changeDrumData).map((key) => (
          <div key={key} className="flex flex-col">
            
            <label className="text-xs text-gray-500 mb-1 font-semibold">
              {formatLabel(key)}
            </label>

            <input
              value={changeDrumData[key]}
              onChange={(e) =>
                setChangeDrumData({
                  ...changeDrumData,
                  [key]: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 
              focus:outline-none focus:ring-2 focus:ring-blue-400 
              text-sm font-medium"
            />
          </div>
        ))}

      </div>

      <button
  onClick={onSave}
  className="
    w-full
    py-4
    rounded-2xl
    text-xl
    font-bold
    text-white
    bg-green-700
    hover:bg-green-800
    shadow-md
    transition-all
    duration-200
    cursor-pointer
  "
>
  Save Drum Data
</button>
    </div>
  );
};

export default ChangeDrumStep;