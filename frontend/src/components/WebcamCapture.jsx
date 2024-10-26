import React, { useRef, useEffect, useState } from "react";
import "../styles/tailwind.css";

const WebcamCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    const getVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreaming(true);
        }
      } catch (error) {
        console.error("Error accessing the camera: ", error);
        alert("Unable to access the camera. Please check your permissions.");
      }
    };

    getVideo();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);

      const image = canvas.toDataURL("image/jpeg");
      onCapture(image);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <video
        ref={videoRef}
        onLoadedMetadata={() => videoRef.current && videoRef.current.play()}
        style={{ width: "100%", height: "auto" }}
        className="rounded-lg"
      />

      <button
        onClick={handleCapture}
        disabled={!isStreaming}
        className={`mt-4 px-20 py-7 text-xl text-white bg-gradient-to-r from-teal-400 to-blue-500 rounded-full shadow-lg transition-all duration-300 
    hover:from-teal-500 hover:to-blue-600 ${
      !isStreaming ? "opacity-50 cursor-not-allowed" : "opacity-100"
    }`}
      >
        Capture Photo
      </button>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default WebcamCapture;
