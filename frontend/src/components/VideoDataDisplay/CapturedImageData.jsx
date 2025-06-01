import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import PropTypes from "prop-types";

function CapturedImageData({
  capturedImage = null,
  counts,
  placeholderHeight,
  placeHolderWidth,
}) { 
  const tabHeight = 48; //height of the tab to show/hide data
  const [open, setOpen] = useState(false);
  const toggleOpen = () => {
    if (!capturedImage) return; // Prevent toggling if no image is captured
    setOpen(!open);
  };
  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 md:flex-1">
      <h2 className="self-start md:text-2xl text-xl font-bold text-highlight_text">
        Captured Image
      </h2>
      <div className="relative flex-col flex items-center w-full" 
      style = {{
         width: placeHolderWidth,
        minHeight: placeholderHeight + tabHeight,
      }}
      >
        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured"
            className={`${open ? "rounded-lg" : "rounded-t-lg"} w-full h-auto`}
          />
        ) : (
          <div
            style={{
              height: `${placeholderHeight}px`,
              width: `${placeHolderWidth}px`,
            }}
            className="overflow-hidden bg-transit_black rounded-t-lg p-2 flex justify-center items-center"
          >
            <span className="fa-stack h-full w-full text-center">
              <FontAwesomeIcon
                className="fa-stack-1x text-transit_blue md:text-6xl sm:text-4xl text-2xl"
                icon={faImage}
              />
              <FontAwesomeIcon
                className="fa-stack-2x text-red-600 md:text-6xl sm:text-4xl text-2xl"
                icon={faBan}
              />
            </span>
          </div>
        )}
        <div
          className={`absolute w-full z-10
            transition-all duration-500 ease-in-out`}
          style={{  
           top: open ? 0 : `${placeholderHeight}px`,
            height: open ? `${placeholderHeight + tabHeight}px` : `${tabHeight}px`,
            maxWidth: `${placeHolderWidth}px`, 
          }}
        >
          <button
            className={`bg-gray-800 duration-600 ease-in-out transition-all w-full flex items-center justify-between ${!open ? "px-4 py-2 rounded-b-lg" : "px-4 py-4 rounded-t-lg"}`}
            onClick={toggleOpen}
            disabled={!capturedImage}
          >
            <span className="text-sm font-bold text-left text-highlight_text">
              {capturedImage
                ? open
                  ? "Hide Data"
                  : "Show Data"
                : "No Image Captured"}
            </span>
            <FontAwesomeIcon
              icon={faAngleUp}
              className={`transition-transform duration-500 ${!open ? "rotate-0" : "rotate-180"}`}
            />
          </button>
          <div
            className={`bg-gray-800 px-4 pb-4 rounded-b-lg text-transit_white overflow-hidden transition-all duration-900 ease-in-out 
            ${open ? "opacity-100" : "opacity-0 pointer-events-none"}
            `} 
             style={{
              height: open ? `${placeholderHeight}px` : 0,
              paddingTop: open ? "1rem" : 0,
            }}
          >
            {capturedImage && (
              <div className="sm:mt-4 text-xs xs:text-sm rounded-b-lg  md:text-lg">
                <p>Number of People: {counts.person}</p>
                <p>Number of Chairs: {counts.chair}</p>
                <p>People Sitting: {counts.people_sitting}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

CapturedImageData.propTypes = {
  capturedImage: PropTypes.string, // Base64 string or image URL
  counts: PropTypes.shape({
    person: PropTypes.number.isRequired,
    chair: PropTypes.number.isRequired,
    people_sitting: PropTypes.number.isRequired,
  }).isRequired,
  placeholderHeight: PropTypes.number,
  placeHolderWidth: PropTypes.number,
};

export default CapturedImageData;
