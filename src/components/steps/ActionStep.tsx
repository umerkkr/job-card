const ActionStep = ({ onStartSetting, onStartMachine }: any) => {
  return (
    <div className="space-y-4">
      <div className="border-b pb-3 mb-4">
        <h3 className="text-xl font-bold text-gray-800">Select Action</h3>
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
          Production Phase Management
        </p>
      </div>

      <button
        onClick={onStartSetting}
        className="w-full flex items-center justify-between p-4 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors group"
      >
        <span className="font-semibold">Start Setting Time</span>
        <span className="bg-blue-500 text-white p-1 rounded-full group-hover:translate-x-1 transition-transform">
          →
        </span>
      </button>

      <button
        onClick={onStartMachine}
        className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors group"
      >
        <span className="font-semibold">Start Machine</span>
        <span className="bg-gray-400 text-white p-1 rounded-full group-hover:translate-x-1 transition-transform">
          →
        </span>
      </button>
    </div>
  );
};

export default ActionStep;