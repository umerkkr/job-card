import { useRef, useState } from "react";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";
import ChangeDrumStep from "../../components/steps/ChangeDrumStep";
import MeterFinishStep from "../../components/steps/MeterFinishStep";
import ReasonStep from "../../components/steps/ReasonStep";
import OutputDrumStep from "../../components/steps/OutputDrumStep";
import InputDrumStep from "../../components/steps/InputDrumStep";
import MeterStep from "../../components/steps/MeterStep";
import ActionStep from "../../components/steps/ActionStep";
import { getTimeDifference, tableHeaders } from "../../utils/helper/helper";

const ProductionLog = ({  }: any) => {
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState<
    "action" | "meter" | "drum" | "outputDrum" | "reason" | "changeDrum" | "meterFinish"
  >("action");

  const webcamRef = useRef<Webcam | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [scanTarget, setScanTarget] = useState<"input" | "output" | null>(null);

  const [isSettingRunning, setIsSettingRunning] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [meterFinish, setMeterFinish] = useState(0);
  const [outputDrum, setOutputDrum] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [meterReading, setMeterReading] = useState(0);
  const [inputDrum, setInputDrum] = useState("");
  const [stopReason, setStopReason] = useState("");

  const [changeDrumData, setChangeDrumData] = useState({
    contextVal: "",
    unitType: "",
    drumType: "",
    drumNumber: "",
    drumSize: "",
    lengthPerUnit: "",
    destOrg: "",
    destDept: "",
    advisedQty: "",
    offerToQC: "",
    packingLength: "",
    noOfPacking: "",
    shortExcess: "",
    shortReason: "",
  });

  const handleStartSetting = () => {
    const time = new Date().toLocaleTimeString();
    const newRow = {
      settingStart: time,
      settingFinish: "",
      runningStart: "",
      runningFinish: "",
      totalOutput: 0,
      meterFinish: "",
      reason: "",
      meter: 0,
      outputDrum: "",
      inputDrum: "",
    };
    setRows((prev) => {
      const updated = [...prev, newRow];
      setCurrentRow(updated.length - 1);
      return updated;
    });
    setIsSettingRunning(true);
    setShowModal(false);
  };
  const capture = async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    try {
      const result = await Tesseract.recognize(imageSrc, "eng");

      let text = result.data.text;

      console.log("RAW OCR:", text);

      const cleaned = text
        .replace(/\s/g, "")
        .replace(/[^A-Z0-9-]/gi, "");

      console.log("CLEANED OCR:", cleaned);

      if (scanTarget === "input") {
        setInputDrum(cleaned);
      } else if (scanTarget === "output") {
        setOutputDrum(cleaned);
      }

    } catch (err) {
      console.error("OCR Error:", err);
    }

    setShowCamera(false);
  };

  const handleStopSetting = () => {
    const finishTime = new Date().toLocaleTimeString();
    setRows((prev) => {
      const updated = [...prev];
      updated[currentRow].settingFinish = finishTime;
      return updated;
    });
    setIsSettingRunning(false);
    setMeterReading(0);
    setModalStep("meter");
    setShowModal(true);
  };

  const handleNext = () => {
    setRows((prev) => {
      const updated = [...prev];
      updated[currentRow].meter = meterReading;
      return updated;
    });
    setModalStep("drum");
  };

  const handleDrumSelect = (drum: string) => {
    const runTime = new Date().toLocaleTimeString();
    setRows((prev) => {
      const updated = [...prev];
      updated[currentRow].inputDrum = drum;
      updated[currentRow].runningStart = runTime;
      return updated;
    });
    setModalStep("outputDrum");
  };

  return (
    <div className="p-4 ">
      <div className="flex justify-between items-center mb-6 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
        <h4 className="text-green-700 font-bold text-lg tracking-tight">
          PRODUCTION LOG
        </h4>

        <button
          onClick={() => {
            if (isSettingRunning) return handleStopSetting();
            if (isRunning) {
              setModalStep("reason");
              setShowModal(true);
              return;
            }
            setShowModal(true);
          }}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all transform active:scale-95 shadow-md ${isSettingRunning
            ? "bg-red-500 hover:bg-red-600 text-white"
            : isRunning
              ? "bg-amber-500 hover:bg-amber-600 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
            }`}
        >
          {isSettingRunning ? "Stop Setting Time" : isRunning ? "Stop Job" : "Start New Entry"}
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              {modalStep === "action" && (
                <ActionStep
                  onStartSetting={handleStartSetting}
                  onStartMachine={() => setShowModal(false)}
                />
              )}

              {modalStep === "meter" && (
                <MeterStep
                  meterReading={meterReading}
                  setMeterReading={setMeterReading}
                  onNext={handleNext}
                />
              )}

              {modalStep === "drum" && (
                <InputDrumStep
                  showCamera={showCamera}
                  webcamRef={webcamRef}
                  capture={capture}
                  setShowCamera={setShowCamera}
                  setScanTarget={setScanTarget}
                  inputDrum={inputDrum}
                  setInputDrum={setInputDrum}
                  handleDrumSelect={handleDrumSelect}
                />
              )}

              {modalStep === "outputDrum" && (
                <OutputDrumStep
                  showCamera={showCamera}
                  webcamRef={webcamRef}
                  capture={capture}
                  setShowCamera={setShowCamera}
                  setScanTarget={setScanTarget}
                  outputDrum={outputDrum}
                  setOutputDrum={setOutputDrum}
                  onConfirm={() => {
                    setRows((prev) => {
                      const updated = [...prev];
                      updated[currentRow].outputDrum = outputDrum;
                      return updated;
                    });
                    setIsRunning(true);
                    setShowModal(false);
                    setModalStep("action");
                  }}
                />
              )}

              {modalStep === "reason" && (
                <ReasonStep
                  stopReason={stopReason}
                  setStopReason={setStopReason}
                  onConfirm={() => {
                    if (stopReason === "Change Drum") {
                      setModalStep("changeDrum");
                    } else {
                      const finishTime = new Date().toLocaleTimeString();
                      setRows((prev) => {
                        const updated = [...prev];
                        updated[currentRow].runningFinish = finishTime;
                        updated[currentRow].reason = stopReason;
                        return updated;
                      });
                      setModalStep("meterFinish");
                    }
                  }}
                />
              )}

              {modalStep === "meterFinish" && (
                <MeterFinishStep
                  meterFinish={meterFinish}
                  setMeterFinish={setMeterFinish}
                  onSave={() => {
                    setRows((prev) => {
                      const updated = [...prev];
                      updated[currentRow].meterFinish = meterFinish;
                      return updated;
                    });
                    setIsRunning(false);
                    setShowModal(false);
                    setModalStep("action");
                  }}
                />
              )}

              {modalStep === "changeDrum" && (
                <ChangeDrumStep
                  changeDrumData={changeDrumData}
                  setChangeDrumData={setChangeDrumData}
                  onSave={() => {
                    const finishTime = new Date().toLocaleTimeString();
                    setRows((prev) => {
                      const updated = [...prev];
                      updated[currentRow].runningFinish = finishTime;
                      updated[currentRow].reason = "Change Drum";
                      return updated;
                    });
                    setModalStep("meterFinish");
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
        <table className="w-full text-[11px] border-collapse">
          <thead className="bg-green-800 text-white uppercase tracking-tighter">
            <tr>
              {tableHeaders.map((header, i) => (
                <th
                  key={i}
                  rowSpan={header.rowSpan}
                  colSpan={header.colSpan}
                  className="p-2 border border-slate-700"
                >
                  {header.label}
                </th>
              ))}
            </tr>
            <tr>
              {tableHeaders
                .filter((h) => h.children)
                .flatMap((h) =>
                  h.children!.map((child, i) => (
                    <th
                      key={`${h.label}-${i}`}
                      className="p-2 border border-slate-700 bg-green-900"
                    >
                      {child}
                    </th>
                  ))
                )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                {[...Array(19)].map((_, j) => {
                  if (j === 2) return <td key={j} className="p-2 border font-semibold text-gray-700 text-center bg-white">{row.inputDrum}</td>;
                  if (j === 3) return <td key={j} className="p-2 border font-semibold text-gray-700 text-center bg-white">{row.outputDrum}</td>;
                  if (j === 5) return <td key={j} className="p-2 border text-center font-medium">{row.meter}</td>;
                  if (j === 6) return <td key={j} className="p-2 border text-center text-black-600 font-bold bg-purple-50/30">{row.meterFinish}</td>;
                  if (j === 9) return <td key={j} className="p-2 border text-center text-black-600 font-medium">{row.settingStart}</td>;
                  if (j === 10) return <td key={j} className="p-2 border text-center text-black-600 font-medium">{row.settingFinish}</td>;
                  if (j === 11)
                    return (
                      <td className="p-2 border text-center font-semibold text-green-700">
                        {getTimeDifference(row.settingStart, row.settingFinish)}
                      </td>
                    );
                  if (j === 12) return <td key={j} className="p-2 border text-center text-black-600 font-medium">{row.runningStart}</td>;
                  if (j === 13) return <td key={j} className="p-2 border text-center text-black-600 font-medium">{row.runningFinish}</td>;
                  if (j === 14)
                    return (
                      <td className="p-2 border text-center font-semibold text-blue-700">
                        {getTimeDifference(row.runningStart, row.runningFinish)}
                      </td>
                    );
                  if (j === 15) return <td key={j} className="p-2 border text-center font-bold text-red-600 bg-red-50/20">{row.reason}</td>;
                  return <td key={j} className="p-2 border bg-white"></td>;
                })}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={19} className="p-10 text-center text-gray-400 italic">
                  No logs recorded yet. Click "Start New Entry" to begin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductionLog;