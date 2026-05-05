const MeterFinishStep = ({ meterFinish, setMeterFinish, onSave }: any) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-6">
      
      <h3 className="text-2xl font-semibold text-gray-800">
        Finish Meter Reading
      </h3>

      <input
        type="number"
        value={meterFinish || ""}
        onChange={(e) => setMeterFinish(Number(e.target.value))}
        placeholder="Enter meter reading"
        className="w-full max-w-sm px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-600 shadow-sm"
      />

      <button
        onClick={onSave}
        className="w-full max-w-sm bg-green-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition"
      >
        Save & Continue
      </button>

    </div>
  );
};

export default MeterFinishStep;