import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";

import ChangeDrumStep from "../../components/steps/ChangeDrumStep";
import MeterStep from "../../components/steps/MeterStep";
import MeterFinishStep from "../../components/steps/MeterFinishStep";
import ReasonStep from "../../components/steps/ReasonStep";
import OutputDrumStep from "../../components/steps/OutputDrumStep";
import InputDrumStep from "../../components/steps/InputDrumStep";

import {
  getTimeDifference,
  tableHeaders,
} from "../../utils/helper/helper";

const getActiveCrewNo = () => {
  try {
    const raw = window.localStorage.getItem("jobcard-auth");
    if (!raw) return "";
    return (JSON.parse(raw) as { crewNo?: string }).crewNo ?? "";
  } catch {
    return "";
  }
};

const ProductionLog = ({}: any) => {
  const [showModal, setShowModal] =
    useState(false);

  const [modalStep, setModalStep] =
    useState<
      | "action"
      | "drum"
      | "outputDrum"
      | "reason"
      | "changeDrum"
      | "meterStart"
      | "meterFinish"
    >("action");

  const webcamRef =
    useRef<Webcam | null>(null);

  const [showCamera, setShowCamera] =
    useState(false);

  const [scanTarget, setScanTarget] =
    useState<
      "input" | "output" | null
    >(null);

  const [isSettingRunning, setIsSettingRunning] =
    useState(false);

  const [isRunning, setIsRunning] =
    useState(false);

  const [isResumeJob, setIsResumeJob] =
    useState(false);

  const [rows, setRows] = useState<any[]>(
    []
  );

  const [currentRow, setCurrentRow] =
    useState(0);

  const [inputDrums, setInputDrums] =
    useState<string[]>([]);

  const [outputDrums, setoutputDrums] =
    useState<string[]>([]);

  const [stopReason, setStopReason] =
    useState("");

  const [meterFinish, setMeterFinish] =
    useState(0);

  const [meterReading, setMeterReading] =
    useState<number | "">("");

  const [liveTime, setLiveTime] =
    useState(
      new Date().toLocaleTimeString("en-GB", {
        hour12: false,
      })
    );
  const [activeCrewNo, setActiveCrewNo] =
    useState(getActiveCrewNo());

  useEffect(() => {
    const handleAuthChange = () => {
      setActiveCrewNo(getActiveCrewNo());
    };

    window.addEventListener(
      "jobcard-auth-change",
      handleAuthChange
    );

    return () => {
      window.removeEventListener(
        "jobcard-auth-change",
        handleAuthChange
      );
    };
  }, []);

  useEffect(() => {
    if (!activeCrewNo || rows.length === 0) return;

    const lastRow = rows[rows.length - 1];
    if (lastRow.crewNo === activeCrewNo) return;

    setRows((prev) => [
      ...prev,
      {
        dateShift: new Date().toLocaleDateString("en-GB"),
        crewNo: activeCrewNo,
        settingStart: "",
        settingFinish: "",
        runningStart: "",
        runningFinish: "",
        totalOutput: "",
        meter: "",
        meterFinish: "",
        reason: "",
        outputDrums: [],
        inputDrums: [],
      },
    ]);
  }, [activeCrewNo, rows]);

  useEffect(() => {
    if (!isSettingRunning) return;

    const timer = window.setInterval(() => {
      setLiveTime(
        new Date().toLocaleTimeString("en-GB", {
        hour12: false,
      })
      );
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isSettingRunning]);

  const [changeDrumData, setChangeDrumData] =
    useState({
      drumType: "",
      drumNumber: "",
      drumSize: "",
      lengthPerUnit: "",
      destDept: "",
      advisedQty: "",
      packingLength: "",
      noOfPacking: "",
      shortExcess: "",
      shortReason: "",
    });

  const calculateTotalOutput = (
    startMeter: number | string,
    finishMeter: number | string
  ) => {
    if (
      startMeter === "" ||
      finishMeter === ""
    ) {
      return "";
    }

    const total =
      Number(finishMeter) -
      Number(startMeter);

    return Number.isFinite(total)
      ? total
      : "";
  };

  // START SETTING
  const handleStartSetting = (
    startMeterReading: number
  ) => {
    setIsResumeJob(false);

    const time =
      new Date().toLocaleTimeString("en-GB", {
        hour12: false,
      });

    setLiveTime(time);

    const newRow = {
      dateShift: new Date().toLocaleDateString("en-GB"),
      crewNo: activeCrewNo,
      settingStart: time,
      settingFinish: "",
      runningStart: "",
      runningFinish: "",
      totalOutput: "",

      meter: startMeterReading,

      meterFinish: "",

      reason: "",

      outputDrums: [],

      inputDrums: [],
    };

    setRows((prev) => {
      const updated = [...prev];

      updated.push(newRow);

      setCurrentRow(
        updated.length - 1
      );

      return updated;
    });

    setIsSettingRunning(true);
  };

  // OCR CAPTURE
  const capture = async () => {
    if (!webcamRef.current) return;

    const imageSrc =
      webcamRef.current.getScreenshot();

    if (!imageSrc) return;

    try {
      const result =
        await Tesseract.recognize(
          imageSrc,
          "eng"
        );

      let text = result.data.text;

      const cleaned = text
        .replace(/\s/g, "")
        .replace(
          /[^A-Z0-9-]/gi,
          ""
        );

      if (scanTarget === "input") {
        setInputDrums((prev) => {
          if (prev.includes(cleaned)) {
            return prev;
          }

          return [...prev, cleaned];
        });
      } else if (
        scanTarget === "output"
      ) {
        setoutputDrums((prev) => {
          if (prev.includes(cleaned)) {
            return prev;
          }

          return [...prev, cleaned];
        });
      }
    } catch (err) {
      console.error(
        "OCR Error:",
        err
      );
    }

    setShowCamera(false);
  };

  // STOP SETTING
  const handleStopSetting = () => {
    const finishTime =
      new Date().toLocaleTimeString("en-GB", {
        hour12: false,
      });

    setRows((prev) => {
      const updated = [...prev];

      updated[
        currentRow
      ].settingFinish = finishTime;

      return updated;
    });

    setIsSettingRunning(false);

    // OPEN INPUT DRUM
    setModalStep("drum");

    setShowModal(true);
  };

  // RESUME JOB
  const handleResumeJob = () => {
    setIsResumeJob(true);

    const previousRow =
      rows[rows.length - 1];

    const startTime =
      new Date().toLocaleTimeString("en-GB", {
        hour12: false,
      });

    const newRow = {
      dateShift: new Date().toLocaleDateString("en-GB"),
      crewNo: activeCrewNo,
      // NO SETTING TIME
      settingStart: "",
      settingFinish: "",
      runningStart: startTime,
      runningFinish: "",
      totalOutput: "",
      // PREVIOUS FINISH = NEW START
      meter:
        previousRow?.meterFinish || 0,

      meterFinish: "",

      reason: "",

      // AUTO USE PREVIOUS DRUMS
      outputDrums:
        previousRow?.outputDrums ||
        [],

      inputDrums:
        previousRow?.inputDrums ||
        [],
    };

    setRows((prev) => {
      const updated = [...prev];

      updated.push(newRow);

      setCurrentRow(
        updated.length - 1
      );

      return updated;
    });

    setIsRunning(true);
  };

  // INPUT DRUM SELECT
  const handleDrumSelect = (
    drums: string[]
  ) => {
    const runTime =
      new Date().toLocaleTimeString("en-GB", {
        hour12: false,
      });

    setRows((prev) => {
      const updated = [...prev];

      updated[
        currentRow
      ].inputDrums = drums;

      updated[
        currentRow
      ].runningStart = runTime;

      return updated;
    });

    setIsRunning(true);

    setShowModal(false);

    setModalStep("action");
  };
  console.log(outputDrums)

  return (
    <div className="p-2 ">
      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              {/* INPUT DRUM */}
              {modalStep === "drum" && (
                <InputDrumStep
                  showCamera={showCamera}
                  webcamRef={webcamRef}
                  capture={capture}
                  setShowCamera={
                    setShowCamera
                  }
                  setScanTarget={
                    setScanTarget
                  }
                  inputDrums={
                    inputDrums
                  }
                  setInputDrums={
                    setInputDrums
                  }
                  handleDrumSelect={
                    handleDrumSelect
                  }
                />
              )}

              {/* START METER */}
              {modalStep ===
                "meterStart" && (
                <MeterStep
                  meterReading={
                    meterReading
                  }
                  setMeterReading={
                    setMeterReading
                  }
                  title="Meter Reading (Start)"
                  placeholder="Enter start meter reading"
                  buttonLabel="Start Setup Time"
                  onNext={() => {
                    if (
                      meterReading === ""
                    ) {
                      return;
                    }

                    handleStartSetting(
                      Number(
                        meterReading
                      )
                    );

                    setMeterReading(
                      ""
                    );

                    setShowModal(
                      false
                    );

                    setModalStep(
                      "action"
                    );
                  }}
                />
              )}

              {/* OUTPUT DRUM */}
              {modalStep ===
                "outputDrum" && (
                <OutputDrumStep
                  showCamera={showCamera}
                  webcamRef={webcamRef}
                  setShowCamera={
                    setShowCamera
                  }
                  setScanTarget={
                    setScanTarget
                  }
                  handleOutputDrumSelect={(
                    drums: string[]
                  ) => {
                    setRows((prev) => {
                      const updated = [
                        ...prev,
                      ];

                      updated[
                        currentRow
                      ].outputDrums =
                        drums;

                      return updated;
                    });

                    // OPEN FINISH METER
                    setModalStep(
                      "meterFinish"
                    );
                  }}
                />
              )}

              {/* REASON */}
              {modalStep ===
                "reason" && (
                <ReasonStep
                  stopReason={
                    stopReason
                  }
                  setStopReason={
                    setStopReason
                  }
                  onConfirm={() => {
                    const finishTime =
                      new Date().toLocaleTimeString("en-GB", {
        hour12: false,
      });

                    setRows((prev) => {
                      const updated = [
                        ...prev,
                      ];

                      updated[
                        currentRow
                      ].runningFinish =
                        finishTime;

                      updated[
                        currentRow
                      ].reason =
                        stopReason;

                      return updated;
                    });

                    // RESUME JOB
                    // SKIP OUTPUT DRUM
                    if (
                      isResumeJob
                    ) {
                      setModalStep(
                        "meterFinish"
                      );
                    } else {
                      setModalStep(
                        "outputDrum"
                      );
                    }
                  }}
                />
              )}

              {/* FINISH METER */}
              {modalStep ===
                "meterFinish" && (
                <MeterFinishStep
                  meterFinish={
                    meterFinish
                  }
                  setMeterFinish={
                    setMeterFinish
                  }
                  onSave={() => {
                    setRows((prev) => {
                      const updated = [
                        ...prev,
                      ];

                      updated[
                        currentRow
                      ].meterFinish =
                        meterFinish;

                      updated[
                        currentRow
                      ].totalOutput =
                        calculateTotalOutput(
                          updated[
                            currentRow
                          ].meter,
                          meterFinish
                        );

                      return updated;
                    });

                    // RESET
                    setInputDrums([]);

                    setoutputDrums([]);

                    setStopReason("");

                    setMeterFinish(0);

                    setIsRunning(false);

                    setShowModal(false);

                    setModalStep(
                      "action"
                    );
                  }}
                />
              )}

              {/* CHANGE DRUM */}
              {modalStep ===
                "changeDrum" && (
                <ChangeDrumStep
                  changeDrumData={
                    changeDrumData
                  }
                  setChangeDrumData={
                    setChangeDrumData
                  }
                  onSave={() => {
                    const finishTime =
                      new Date().toLocaleTimeString("en-GB", {
        hour12: false,
      });

                    setRows((prev) => {
                      const updated = [
                        ...prev,
                      ];

                      updated[
                        currentRow
                      ].runningFinish =
                        finishTime;

                      updated[
                        currentRow
                      ].reason =
                        "Change Drum";

                      return updated;
                    });

                    setShowModal(false);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-green-700 font-bold text-lg tracking-tight">
          PRODUCTION LOG
        </h4>

        <button
          onClick={() => {
            // STOP SETTING
            if (
              isSettingRunning
            ) {
              return handleStopSetting();
            }

            // STOP JOB
            if (isRunning) {
              setModalStep(
                "reason"
              );

              setShowModal(true);

              return;
            }

            // FIRST JOB
            if (
              rows.length === 0
            ) {
              setMeterReading("");

              setModalStep(
                "meterStart"
              );

              setShowModal(true);

              return;
            }

            handleResumeJob();
          }}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all transform active:scale-95 shadow-md ${
            isSettingRunning
              ? "bg-red-500 hover:bg-red-600 text-white"
              : isRunning
              ? "bg-amber-500 hover:bg-amber-600 text-white"
              : "bg-green-700 hover:bg-green-700 text-white"
          }`}
        >
          {isSettingRunning
            ? "Stop Setting Time"
            : isRunning
            ? "Stop Job"
            : rows.length === 0
            ? "Setup Time"
            : "Resume Job"}
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto shadow-sm bg-white">
        <table className="w-full text-[12px] border-collapse">
          <thead className="bg-green-700 text-white ">
            <tr>
              {tableHeaders.map(
                (header, i) => (
                  <th
                    key={i}
                    rowSpan={
                      header.rowSpan
                    }
                    colSpan={
                      header.colSpan
                    }
                    className="p-2 border border-slate-700"
                  >
                    {header.label}
                  </th>
                )
              )}
            </tr>

            <tr>
              {tableHeaders
                .filter(
                  (h) => h.children
                )
                .flatMap((h) =>
                  h.children!.map(
                    (
                      child,
                      i
                    ) => (
                      <th
                        key={`${h.label}-${i}`}
                        className="p-2 border border-slate-700 bg-green-700"
                      >
                        {child}
                      </th>
                    )
                  )
                )}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="hover:bg-gray-50 transition-colors"
              >
                {[...Array(17)].map(
                  (_, j) => {
                    const commonTd =
                      "px-3 py-2 border border-gray-300 text-center align-middle text-sm font-medium text-gray-800 bg-white";

                    if (j === 0)
                      return (
                        <td
                          key={j}
                          className={commonTd}
                        >
                          {row.dateShift}
                        </td>
                      );

                    if (j === 1)
                      return (
                        <td
                          key={j}
                          className={commonTd}
                        >
                          {row.crewNo}
                        </td>
                      );

                    // INPUT DRUM
                    if (j === 2)
                      return (
                        <td
                          key={j}
                          className={`${commonTd} align-top min-w-[140px]`}
                        >
                          <div className="space-y-1 text-left">
                            {row.inputDrums
                              ?.slice(
                                0,
                                row.showAllDrums
                                  ? row
                                      .inputDrums
                                      .length
                                  : 2
                              )
                              .map(
                                (
                                  drum: string,
                                  idx: number
                                ) => (
                                  <div
                                    key={
                                      idx
                                    }
                                  >
                                    {
                                      drum
                                    }
                                  </div>
                                )
                              )}

                            {row
                              .inputDrums
                              ?.length >
                              2 && (
                              <button
                                onClick={() => {
                                  setRows(
                                    (
                                      prev
                                    ) =>
                                      prev.map(
                                        (
                                          r,
                                          index
                                        ) =>
                                          index ===
                                          i
                                            ? {
                                                ...r,
                                                showAllDrums:
                                                  !r.showAllDrums,
                                              }
                                            : r
                                      )
                                  );
                                }}
                                className="text-green-700 text-sm font-semibold hover:underline"
                              >
                                {row.showAllDrums
                                  ? "Show less"
                                  : `+${
                                      row
                                        .inputDrums
                                        .length -
                                      2
                                    } more`}
                              </button>
                            )}
                          </div>
                        </td>
                      );

                    // OUTPUT DRUM
                    if (j === 3)
                      return (
                        <td
                          key={j}
                          className={`${commonTd} align-top min-w-[140px]`}
                        >
                          <div className="space-y-1 text-left">
                            {row.outputDrums
                              ?.slice(
                                0,
                                row.showAllOutputDrums
                                  ? row
                                      .outputDrums
                                      .length
                                  : 2
                              )
                              .map(
                                (
                                  drum: string,
                                  idx: number
                                ) => (
                                  <div
                                    key={
                                      idx
                                    }
                                  >
                                    {
                                      drum
                                    }
                                  </div>
                                )
                              )}

                            {row
                              .outputDrums
                              ?.length >
                              2 && (
                              <button
                                onClick={() => {
                                  setRows(
                                    (
                                      prev
                                    ) =>
                                      prev.map(
                                        (
                                          r,
                                          index
                                        ) =>
                                          index ===
                                          i
                                            ? {
                                                ...r,
                                                showAllOutputDrums:
                                                  !r.showAllOutputDrums,
                                              }
                                            : r
                                      )
                                  );
                                }}
                                className="text-green-700 text-sm font-semibold hover:underline"
                              >
                                {row.showAllOutputDrums
                                  ? "Show less"
                                  : `+${
                                      row
                                        .outputDrums
                                        .length -
                                      2
                                    } more`}
                              </button>
                            )}
                          </div>
                        </td>
                      );

                    // METER START
                    if (j === 4)
                      return (
                        <td
                          key={j}
                          className={
                            commonTd
                          }
                        >
                          {row.meter}
                        </td>
                      );

                    // METER FINISH
                    if (j === 5)
                      return (
                        <td
                          key={j}
                          className={
                            commonTd
                          }
                        >
                          {
                            row.meterFinish
                          }
                        </td>
                      );

                    // TOTAL OUTPUT
                    if (j === 6)
                      return (
                        <td
                          key={j}
                          className={
                            commonTd
                          }
                        >
                          {
                            row.totalOutput
                          }
                        </td>
                      );

                    // SETTING START
                    if (j === 7)
                      return (
                        <td
                          key={j}
                          className={
                            commonTd
                          }
                        >
                          {
                            row.settingStart
                          }
                        </td>
                      );

                    // SETTING FINISH
                    if (j === 8)
                      return (
                        <td
                          key={j}
                          className={
                            commonTd
                          }
                        >
                          {
                            row.settingFinish
                          }
                        </td>
                      );

                    // SETTING TOTAL
                    if (j === 9)
                      return (
                        <td
                          key={j}
                          className={
                            commonTd
                          }
                        >
                          {getTimeDifference(
                            row.settingStart,
                            row.settingFinish ||
                              (isSettingRunning &&
                              i ===
                                currentRow
                                ? liveTime
                                : "")
                          )}
                        </td>
                      );

                    // RUNNING START
                    if (j === 10)
                      return (
                        <td
                          key={j}
                          className={
                            commonTd
                          }
                        >
                          {
                            row.runningStart
                          }
                        </td>
                      );

                    // RUNNING FINISH
                    if (j === 11)
                      return (
                        <td
                          key={j}
                          className={
                            commonTd
                          }
                        >
                          {
                            row.runningFinish
                          }
                        </td>
                      );

                    // RUNNING TOTAL
                    if (j === 12)
                      return (
                        <td
                          key={j}
                          className={
                            commonTd
                          }
                        >
                          {getTimeDifference(
                            row.runningStart,
                            row.runningFinish
                          )}
                        </td>
                      );

                    // REASON
                    if (j === 13)
                      return (
                        <td
                          key={j}
                          className={
                            commonTd
                          }
                        >
                          {row.reason}
                        </td>
                      );

                    return (
                      <td
                        key={j}
                        className={
                          commonTd
                        }
                      ></td>
                    );
                  }
                )}
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={17}
                  className="py-10 text-center text-gray-400 italic border border-gray-200"
                >
                  No logs recorded yet.
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
