import { useState } from "react";
import CameraScanner from "../production/CameraScanner";

const DUMMY_DRUMS = [
  "DRM-1001",
  "DRM-1002",
  "DRM-1003",
  "DRM-1004",
  "DRM-1005",
  "DRM-1006",
  "DRM-1007",
  "DRM-1008",
];

const InputDrumStep = ({
  showCamera,
  webcamRef,
  setShowCamera,
  setScanTarget,
  handleDrumSelect,
}: any) => {

  const [scannedDrums, setScannedDrums] = useState<string[]>([]);
  const [selectedDrums, setSelectedDrums] = useState<string[]>([]);


  const toggleDrum = (drum: string) => {
    setSelectedDrums((prev) =>
      prev.includes(drum)
        ? prev.filter((d) => d !== drum)
        : [...prev, drum]
    );
  };

  const allDrums = DUMMY_DRUMS;

  return (
    <div className="space-y-6">

      {/* Heading */}
      <h3 className="text-3xl font-bold text-green-700">
        Select input drum
      </h3>

      {/* Camera */}
      {showCamera && (
  <CameraScanner
    webcamRef={webcamRef}
    onCapture={(value: string) => {

      if (
        value &&
        !scannedDrums.includes(value)
      ) {
        setScannedDrums((prev) => [...prev, value]);
      }

      setShowCamera(false);
    }}
    onClose={() => setShowCamera(false)}
  />
)}

      {/* Scan Button */}
      <button
        onClick={() => {
          setScanTarget("input");
          setShowCamera(true);
        }}
        className="w-full cursor-pointer bg-green-700 text-white py-4 rounded-2xl text-xl font-bold shadow-md"
      >
        Scan input drum
      </button>

      {/* Drum Selection */}
      <div>
        <div className="text-lg font-semibold text-gray-700 mb-4">
          Drums
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

          {allDrums.map((drum, index) => {

            const isSelected =
              selectedDrums.includes(drum);

            return (
              <button
                key={index}
                onClick={() => toggleDrum(drum)}
                className={`p-5 rounded-2xl cursor-pointer border-2 text-lg font-bold transition-all duration-200 ${
                  isSelected
                    ? "bg-green-700 text-white border-green-700 shadow-lg scale-[1.02]"
                    : "bg-white text-gray-700 border-gray-300 hover:border-green-700"
                }`}
              >
                {drum}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scanned Results */}
{scannedDrums.length > 0 && (
  <div className="space-y-4">

    <div className="text-xl font-bold text-gray-700">
      Scanned drums
    </div>

    <div className="grid grid-cols-3 gap-3">

      {scannedDrums.map((drum, index) => (

        <div
          key={index}
          onClick={() => toggleDrum(drum)}
          className={`p-4 rounded-2xl border-2 cursor-pointer text-center text-lg font-bold transition-all ${
            selectedDrums.includes(drum)
              ? "bg-green-700 text-white border-green-700 shadow-lg"
              : "bg-white text-gray-700 border-gray-300 hover:border-green-700"
          }`}
        >
          {drum}
        </div>

      ))}

    </div>
  </div>
)}
      {/* Confirm Button */}
      <button
        onClick={() => handleDrumSelect(selectedDrums)}
        disabled={selectedDrums.length === 0}
        className={`w-full py-4 rounded-2xl text-xl font-bold transition-all ${
          selectedDrums.length === 0
            ? "bg-gray-300 text-gray-500"
            : "bg-green-700 text-white shadow-md"
        }`}
      >
        Confirm selected drums
      </button>

    </div>
  );
};

export default InputDrumStep;