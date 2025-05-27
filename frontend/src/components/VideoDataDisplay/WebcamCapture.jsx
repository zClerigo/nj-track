import { useRef, useEffect, useState } from "react";
import "../../styles/tailwind.css";
import PropTypes from "prop-types"; 
import { forwardRef } from "react";
const WebcamCapture = forwardRef( function WebcamCapture({ onCapture, onWebcamReady }, ref)  { 
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);



  useEffect(() => {
    if (ref) {
      ref.current = videoRef.current;
    }
  }, [ref]); 

  useEffect(() => {
    const getVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreaming(true);
          console.log("video stream started");
        }
      } catch (error) {
        console.error("Error accessing the camera: ", error);
        alert("Unable to access the camera. Please check your permissions.");
      }
    };

    getVideo();
    let videoElement = videoRef.current;
    return () => {
      console.log("clean up start");
      if (videoElement && videoElement.srcObject) {
        const tracks = videoElement.srcObject.getTracks();
        console.log("tracks:", tracks);
        tracks.forEach((track) => track.stop());
        videoElement.srcObject = null;
        console.log("camera stopped");
        localStorage.setItem("cabinPageVisited", "true");
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
        onLoadedMetadata={() => {
          if (videoRef.current) {
            videoRef.current.play();
            // Notify parent that webcam is ready 
            onWebcamReady({
              height: videoRef.current.clientHeight,
              width: videoRef.current.clientWidth,
            });
          }
        }}
        style={{ width: "85%", height: "auto" }}
        className="rounded-lg"
      />

      <button
        onClick={handleCapture}
        disabled={!isStreaming}
        className={`mt-4 px-14 py-4 text-lg text-white bg-gradient-to-r from-highlight_text via-transit_blue to-blue-600 rounded-lg shadow-lg transition-all duration-500 
    hover:bg-right bg-[40%_100%] bg-[length:200%_100%] ${
      !isStreaming ? "opacity-50 cursor-not-allowed" : "opacity-100"
    }`}
      >
        Capture Photo
      </button>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
});

WebcamCapture.propTypes = {
  onCapture: PropTypes.func, 
  onWebcamReady: PropTypes.func,
};
export default WebcamCapture;
