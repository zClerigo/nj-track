import { useRef, useEffect, useState } from "react";
import "../../styles/tailwind.css";
import PropTypes from "prop-types"; 
import { forwardRef } from "react"; 
import {faCamera} from "@fortawesome/free-solid-svg-icons"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    <div className="flex flex-col items-center sm:w-[70%] lg:w-[60%]  w-2/5 min-w-[200px] xs:w-2/3 max-w-[300px]">
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
        style={{ height: "auto" }} //play around this width 
        className="rounded-t-lg w-full"
      />

      <button
        onClick={handleCapture}
        disabled={!isStreaming}
        className={`w-full px-6 py-2 lg:px-14  text-white bg-gradient-to-r from-highlight_text via-transit_blue to-blue-600 rounded-b-lg shadow-lg transition-all duration-500 
    hover:bg-right bg-[40%_100%] bg-[length:200%_100%] text-center ${
      !isStreaming ? "opacity-50 cursor-not-allowed" : "opacity-100"
    }`}
      >
        <FontAwesomeIcon icon={faCamera} className="text-center fa-lg md:fa-xl lg:fa-2xl lg:text-2xl" />
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
