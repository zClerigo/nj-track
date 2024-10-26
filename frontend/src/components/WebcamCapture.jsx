// src/components/WebcamCapture.js
import React, { useRef, useEffect, useState } from "react";
import "../styles/tailwind.css";

const WebcamCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    const getVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsStreaming(true);
      } catch (error) {
        console.error("Error accessing the camera: ", error);
        alert("Unable to access the camera. Please check your permissions.");
      }
    };

    getVideo();

    return () => {
      if (videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <video
        ref={videoRef}
        style={{ width: "100%", height: "auto" }}
        className="rounded-lg"
      />
    </div>
  );
};

export default WebcamCapture;
