import CameraScanner from "../production/CameraScanner";

const OutputDrumStep = ({
  showCamera,
  webcamRef,
  capture,
  setShowCamera,
  setScanTarget,
  outputDrum,
  setOutputDrum,
  onConfirm,
}: any) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Select Output Drum</h3>

      {showCamera && (
        <CameraScanner
          webcamRef={webcamRef}
          onCapture={capture}
          onClose={() => setShowCamera(false)}
        />
      )}

      <button
        onClick={() => {
          setScanTarget("output");
          setShowCamera(true);
        }}
        className="w-full bg-blue-500 text-white py-2 rounded-lg"
      >
        Scan Output Drum
      </button>

      <input
        value={outputDrum}
        onChange={(e) => setOutputDrum(e.target.value)}
        placeholder="Scanned Output Drum"
        className="w-full border p-3 rounded-lg"
      />

      <button
        disabled={!outputDrum}
        onClick={onConfirm}
        className="w-full bg-blue-600 text-white py-3 rounded-lg"
      >
        Confirm & Start Running
      </button>
    </div>
  );
};

export default OutputDrumStep;