import PropTypes from "prop-types";

const CabinLayout = ({cabinNumber ,counts,  handleClick, getColor }) => {
  return (
    <div className="max-xs:flex-grow xs:w-1/2 w-full bg-transit_white p-4 rounded-md flex flex-col max-xs:justify-self-stretch items-center justify-start gap-4">
      <h1 className="lg:text-3xl text-xl md:text-2xl font-bold text-center text-highlight_text">
        Cabin {cabinNumber} Layout
      </h1>
      <div className="justify-self-stretch flex-1 grid grid-cols-4 gap-4 bg-gray-300 drop-shadow-elevation-low-light rounded-lg w-full">
        {Array.from({ length: counts.chair }).map((_, index) => (
          <div
            onClick={() => handleClick(index)}
            key={index}
            className={`w-20 h-20 rounded-lg flex items-center justify-center text-center ${getColor(index)}`}
          >
            {index + 1}
          </div>
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