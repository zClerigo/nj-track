import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTicket } from "@fortawesome/free-solid-svg-icons"; 
import PropTypes from 'prop-types'
const Cabin = ({ cabinNumber }) => {
  const navigate = useNavigate();
  const handleButtonClick = (cabinNumber) => {
    navigate(`/cabins/${cabinNumber}`);
  };

  return (
    <div
      onClick={() => handleButtonClick(cabinNumber)}
      className="relative z-10 my-[-15px] sm:my-[-5px] md:my-0 lg:col-span-3 md:col-span-4 sm:col-span-6 col-span-12 mx-auto transition-all duration-300 ease-out hover:cursor-pointer hover:scale-105 focus:outline-none focus:ring-2 focus:ring-transit_blue focus:ring-offset-2"
    >
      <FontAwesomeIcon
        icon={faTicket}
        className="w-full h-full text-transit_blue drop-shadow-elevation-high-light"
      ></FontAwesomeIcon>
      <div className="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center flex-col sm:p-3">
        <h2 className="text-lg text-center sm:text-xl font-bold text-normal_text">
          Cabin {cabinNumber}
        </h2>
        <p className="text-xs text-center sm:text-sm text-normal_text">
          Tap to see seating
        </p>
      </div>
      <div className="absolute border-transit_black border rounded-lg z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-transit_blue w-3/4 h-3/5"></div>
    </div>
  );
};  

Cabin.propTypes = { 
  cabinNumber: PropTypes.string.isRequired,
} 

export default Cabin;
