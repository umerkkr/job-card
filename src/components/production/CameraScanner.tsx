import Webcam from "react-webcam";

const CameraScanner = ({ webcamRef, onCapture, onClose }: any) => {
  return (
    <div className="space-y-2">
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "environment" }}
        className="rounded-xl"
      />

      <button
        onClick={onCapture}
        className="w-full bg-green-600 text-white py-2 rounded-lg"
      >
        Capture
      </button>

      <button
        onClick={onClose}
        className="w-full bg-gray-400 text-white py-2 rounded-lg"
      >
        Cancel
      </button>
    </div>
  );
};

export default CameraScanner;