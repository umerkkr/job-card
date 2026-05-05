const ReasonStep = ({ stopReason, setStopReason, onConfirm }: any) => {
  const reasons = [
    "Lunch Break",
    "Machine Maintenance",
    "Job Complete",
    "Change Drum",
  ];

  return (
    <div className="space-y-4">
      <div className="border-b pb-3 mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          Why are you stopping?
        </h3>
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
          Select a reason
        </p>
      </div>
      <div className="space-y-2">
        {reasons.map((r) => (
          <label
            key={r}
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition
            ${
              stopReason === r
                ? "bg-red-50 border-red-300"
                : "hover:bg-gray-50 border-gray-200"
            }`}
          >
            <input
              type="radio"
              checked={stopReason === r}
              onChange={() => setStopReason(r)}
              className="accent-red-600"
            />

            <span className="font-medium text-gray-700">{r}</span>
          </label>
        ))}
      </div>
      <button
        disabled={!stopReason}
        onClick={onConfirm}
        className={`w-full py-3 rounded-xl font-bold text-white transition
        ${
          stopReason
            ? "bg-red-600 hover:bg-red-700"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        Confirm Stop
      </button>
    </div>
  );
};

export default ReasonStep;