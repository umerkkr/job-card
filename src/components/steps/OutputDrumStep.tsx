import { useState } from "react";
import CameraScanner from "../production/CameraScanner";

const DUMMY_OUTPUT_DRUMS = [
  "OUT-1001",
  "OUT-1002",
  "OUT-1003",
  "OUT-1004",
];

const OutputDrumStep = ({
  showCamera,
  webcamRef,
  setShowCamera,
  setScanTarget,
  handleOutputDrumSelect,
}: any) => {

  const [scannedDrums, setScannedDrums] =
    useState<string[]>([]);

  const [selectedDrums, setSelectedDrums] =
    useState<string[]>([]);

  const toggleDrum = (drum: string) => {
    setSelectedDrums((prev) =>
      prev.includes(drum)
        ? prev.filter((d) => d !== drum)
        : [...prev, drum]
    );
  };

  const allDrums = [
    ...new Set([
      ...DUMMY_OUTPUT_DRUMS,
      ...scannedDrums,
    ]),
  ];

  return (
    <div className="space-y-6">

      {/* Heading */}
      <h3 className="text-3xl font-bold text-green-700">
        Select Output Drum
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
              setScannedDrums((prev) => [
                ...prev,
                value,
              ]);
            }

            setShowCamera(false);
          }}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Scan Button */}
      <button
        onClick={() => {
          setScanTarget("output");
          setShowCamera(true);
        }}
        className="
          w-full
          cursor-pointer
          bg-green-700
          text-white
          py-4
          rounded-2xl
          text-xl
          font-bold
          shadow-md
        "
      >
        Scan output drum
      </button>

      {/* Drum Selection */}
      <div>

        <div className="text-lg font-semibold text-gray-700 mb-4">
          Output Drums
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

          {allDrums.map((drum, index) => {

            const isSelected =
              selectedDrums.includes(drum);

            return (
              <button
                key={index}
                onClick={() => toggleDrum(drum)}
                className={`
                  p-5
                  rounded-2xl
                  cursor-pointer
                  border-2
                  text-lg
                  font-bold
                  transition-all
                  duration-200
                  ${
                    isSelected
                      ? "bg-green-700 text-white border-green-700 shadow-lg scale-[1.02]"
                      : "bg-white text-gray-700 border-gray-300 hover:border-green-700"
                  }
                `}
              >
                {drum}
              </button>
            );
          })}

        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={() =>
          handleOutputDrumSelect(selectedDrums)
        }
        disabled={selectedDrums.length === 0}
        className={`
          w-full
          py-4
          rounded-2xl
          text-xl
          font-bold
          transition-all
          ${
            selectedDrums.length === 0
              ? "bg-gray-300 text-gray-500"
              : "bg-green-700 text-white shadow-md"
          }
        `}
      >
        Confirm selected drums
      </button>
    </div>
  );
};

export default OutputDrumStep;