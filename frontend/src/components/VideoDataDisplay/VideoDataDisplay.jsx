import {useState, useEffect, useRef} from "react";
import LiveVideoData from "./LiveVideoData";
import CapturedImageData from "./CapturedImageData";
import PropTypes from "prop-types";

function VideoDataDisplay({ capturedImage = null, counts, handleCapture }) { 
    const webcamRef = useRef(null); 
    const [webcamHeight, setWebcamHeight] = useState(0);  
    const [webcamWidth, setWebcamWidth] = useState(0);   

    const handleWebcamReady = ({ height, width }) => {
        setWebcamHeight(height);
        setWebcamWidth(width);
      };
      
    useEffect(() => {
        const handleResize = () => {
            if (webcamRef.current) { 
                setWebcamHeight(webcamRef.current.clientHeight);
                setWebcamWidth(webcamRef.current.clientWidth);
            }
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [webcamRef]);
  return (
    <div className="sm:w-4/6 w-full bg-transit_white p-4 rounded-md flex items-start justify-center flex-wrap">
      <LiveVideoData ref={webcamRef} handleCapture={handleCapture} onWebcamReady={handleWebcamReady} />
      <CapturedImageData
        counts={counts}
        capturedImage={capturedImage} 
        placeHolderWidth={webcamWidth} 
        placeholderHeight={webcamHeight} 
      ></CapturedImageData>
    </div>
  );
}
VideoDataDisplay.propTypes = {
  capturedImage: PropTypes.string,
  counts: PropTypes.shape({
    person: PropTypes.number.isRequired,
    chair: PropTypes.number.isRequired,
    people_sitting: PropTypes.number.isRequired,
  }).isRequired,
  handleCapture: PropTypes.func.isRequired,
}; 
export default VideoDataDisplay;
