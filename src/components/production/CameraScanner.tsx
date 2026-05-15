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
        onClick={() => {
          const randomCode = `DRM-${Math.floor(
            1000 + Math.random() * 9000
          )}`;

          onCapture(randomCode);
        }}
        className="w-full bg-green-700 text-white py-3 rounded-xl text-lg font-bold"
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