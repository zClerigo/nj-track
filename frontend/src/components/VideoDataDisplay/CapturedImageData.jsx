import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

function CapturedImageData({ capturedImage = null, counts, placeholderHeight, placeHolderWidth }) {
  return (
    <div className="flex flex-col items-center justify-center mt-4 gap-4 md:flex-1">
      <h2 className="self-start md:text-2xl sm:text-xl text-lg font-bold text-highlight_text">
        Captured Image
      </h2>
      {capturedImage ? (
        <img
          src={capturedImage}
          alt="Captured"
          className="w-[85%] h-auto rounded-lg"
        />
      ) : (
        <div style = {{height: `${placeholderHeight}px`, width: `${placeHolderWidth}px`}} className="overflow-hidden bg-transit_black rounded-md p-2 flex justify-center items-center">
          <span className="fa-stack h-full w-full text-center">
            <FontAwesomeIcon
              className="fa-stack-1x text-transit_blue md:text-6xl sm:text-2xl text-lg"
              icon={faImage}
            />
            <FontAwesomeIcon
              className="fa-stack-2x text-red-600 md:text-6xl sm:text-2xl text-lg"
              icon={faBan}
            />
          </span>
        </div>
      )}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-highlight_text">
          Data From Captured Image
        </h2>
        {capturedImage ? (
          <div className="sm:mt-4 mt-2 text-sm md:text-lg">
            <p>Number of People: {counts.person}</p>
            <p>Number of Chairs: {counts.chair}</p>
            <p>People Sitting: {counts.people_sitting}</p>
          </div>
        ) : (
          <p>No image captured yet.</p>
        )}
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
