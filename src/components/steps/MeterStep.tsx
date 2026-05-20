const MeterStep = ({
  meterReading,
  setMeterReading,
  onNext,
  title = "Meter Reading",
  placeholder = "Enter meter reading",
  buttonLabel = "Next",
}: any) => {
  const hasReading =
    meterReading !== "" &&
    meterReading !== null &&
    meterReading !== undefined;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">{title}</h3>

      <input
        type="number"
        value={meterReading}
        onChange={(e) =>
          setMeterReading(e.target.value === "" ? "" : Number(e.target.value))
        }
        placeholder={placeholder}
        className="w-full border p-4 text-2xl rounded-lg"
      />

      <button
        onClick={onNext}
        disabled={!hasReading}
        className={`w-full text-xl font-bold py-3 rounded-lg ${
          hasReading
            ? "cursor-pointer bg-green-700 text-white"
            : "cursor-not-allowed bg-gray-300 text-gray-500"
        }`}
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default MeterStep;
