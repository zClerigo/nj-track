import WebcamCapture from "./WebcamCapture";
import propTypes from "prop-types";
import { forwardRef } from "react";
const LiveVideoData = forwardRef(
  function LiveVideoData({handleCapture, onWebcamReady}, ref) { 
    return (
      <div className="flex flex-col items-center justify-center gap-4 md:flex-1">
        <h2 className="self-start md:text-2xl text-xl font-bold text-highlight_text">
          Live Video
        </h2>
        <WebcamCapture
          onCapture={handleCapture}
          ref={ref} 
          onWebcamReady={onWebcamReady}
          className="w-60 h-auto"
        />
      </div>
    );
  },
);
LiveVideoData.propTypes = {
  handleCapture: propTypes.func.isRequired, 
  onWebcamReady: propTypes.func
};
export default LiveVideoData;
