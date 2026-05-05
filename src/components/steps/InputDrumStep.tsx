import CameraScanner from "../production/CameraScanner";

const InputDrumStep = ({
  showCamera,
  webcamRef,
  capture,
  setShowCamera,
  setScanTarget,
  inputDrum,
  setInputDrum,
  handleDrumSelect,
}: any) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Select Input Drum</h3>

      {showCamera && (
        <CameraScanner
          webcamRef={webcamRef}
          onCapture={capture}
          onClose={() => setShowCamera(false)}
        />
      )}

      <button
        onClick={() => {
          setScanTarget("input");
          setShowCamera(true);
        }}
        className="w-full bg-blue-500 text-white py-2 rounded-lg"
      >
        Scan Input Drum
      </button>

      <input
        value={inputDrum}
        onChange={(e) => setInputDrum(e.target.value)}
        placeholder="Scanned Input Drum"
        className="w-full border p-3 rounded-lg"
      />

      <button
        onClick={() => handleDrumSelect(inputDrum)}
        disabled={!inputDrum}
        className="w-full bg-green-600 text-white py-3 rounded-lg"
      >
        Confirm Drum
      </button>
    </div>
  );
};

export default InputDrumStep;