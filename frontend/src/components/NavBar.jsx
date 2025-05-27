import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  listOfLeftOverStops,
  periodicRefresh,
} from "../NJ_Transit_DataService";
import logo from "../assets/NJ_TRANSIT_LOGO_1.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
const Navbar = ({ route }) => {
  const navigate = useNavigate();
  const trainData = useRef(JSON.parse(localStorage.getItem("trainData")));
  let leftOverStops =
    trainData.current.STOPS && trainData.current.STOPS.length > 0
      ? listOfLeftOverStops(trainData.current.STOPS)
      : [];
  const [nextStop, setNextStop] = useState(
    leftOverStops.length > 0
      ? leftOverStops[0].STATIONNAME
      : "Train has reached its final destination",
  );
  //Initialize state with nextStop based on current trainData
  useEffect(() => {
    trainData.current = JSON.parse(localStorage.getItem("trainData"));
    // This will be the callback for when the train reaches its final destination
    const callBackEnd = () => {
      setNextStop("Train has reached its final destination");
    };
    // This will update the UI when a new stop is reached
    // This will update the UI when the train is first loaded
    const callBackContinue = (data) => {
      const leftOverStops = listOfLeftOverStops(data.STOPS);
      setNextStop(`Next Stop: ${leftOverStops[0].STATIONNAME}`);
    };
    let timer;
    // Set the ref to the latest trainData
    // Call refreshTrainData to start the cycle only if trainData exists
    if (
      trainData.current &&
      trainData.current.STOPS &&
      trainData.current.STOPS.length > 0
    ) {
      timer = setTimeout(() => {
        periodicRefresh(trainData.current, callBackEnd, callBackContinue);
      }, 60000);
    }
    return () => {
      if (
        trainData.current &&
        trainData.current.STOPS &&
        trainData.current.STOPS.length > 0
      )
        clearTimeout(timer);
    };
  });

  return (
    <div className="w-full sticky top-full sm:top-0 p-2 bg-white flex items-center shadow-elevation-high-dark justify-between">
      <div className="w-1/3 h-full">
        <div
          onClick={() => navigate(route)}
          className="text-transit_blue p-2 sm:p-3 hover:text-normal_text hover:bg-transit_blue transition-all flex gap-4 max-w-fit hover:cursor-pointer items-center border-2 border-solid border-transit_blue rounded-full"
        >
          <FontAwesomeIcon
            className="scale-x-[-1]"
            icon={faArrowRightFromBracket}
          />
          <span className="font-bold hidden sm:inline">Go Back</span>
        </div>
      </div>
      <div className="w-1/3 h-full flex items-center justify-center">
        <div className="w-10">
          <img src={logo} alt="NJ Transit Logo" className="object-scale-down" />
        </div>
      </div>
      <div className="w-1/3 h-full justify-end flex">
        {nextStop && (
          <div className="font-bold text-sm text-transit_black sm:text-lg text-right">
            {nextStop}
          </div>
        )}
      </div>
    </div>
  );
}; 
Navbar.propTypes = {
  route: PropTypes.string.isRequired,
};

export default Navbar;
