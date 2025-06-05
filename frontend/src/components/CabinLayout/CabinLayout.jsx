import PropTypes from "prop-types";
import Seat from "./Seat";
const CabinLayout = ({ cabinNumber, counts, handleClick, getColor }) => { 
  return (
    <div className="max-md:flex-grow md:w-1/2 w-full bg-transit_white p-4 rounded-md flex flex-col max-md:justify-self-stretch items-center justify-start gap-4 overflow-hidden">
      <h1 className="lg:text-3xl text-xl md:text-2xl font-bold text-center text-highlight_text">
        Cabin {cabinNumber} Layout
      </h1>
      <div className="justify-self-stretch flex-1 grid grid-cols-4 gap-4 bg-gray-300 drop-shadow-elevation-low-light rounded-lg w-full p-2 md:p-6 max-h-[90%] overflow-y-auto">
        {Array.from({ length: counts.chair }).map((_, index) => (
          <Seat
            key={index}
            index={index}
            handleClick={handleClick}
            getColor={getColor}
          />
        ))}
      </div>
    </div>
  );
};
CabinLayout.propTypes = {
  cabinNumber: PropTypes.string.isRequired,
  counts: PropTypes.shape({
    chair: PropTypes.number.isRequired,
  }).isRequired,
  occupiedChairs: PropTypes.arrayOf(PropTypes.number).isRequired,
  clickedChairs: PropTypes.objectOf(PropTypes.bool).isRequired,
  handleClick: PropTypes.func.isRequired,
  getColor: PropTypes.func.isRequired,
};
export default CabinLayout;
