const MeterStep = ({ meterReading, setMeterReading, onNext }: any) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Meter Reading</h3>

      <input
        type="number"
        value={meterReading}
        onChange={(e) => setMeterReading(Number(e.target.value))}
        className="w-full border p-4 text-2xl rounded-lg"
      />

      <button
        onClick={onNext}
        className="w-full bg-blue-600 text-white py-3 rounded-lg"
      >
        Next
      </button>
    </div>
  );
};

export default MeterStep;