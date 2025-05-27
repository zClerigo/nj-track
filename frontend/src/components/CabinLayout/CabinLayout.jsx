import PropTypes from "prop-types";

const CabinLayout = ({cabinNumber ,counts,  handleClick, getColor }) => {
  return (
    <div className="sm:w-2/6 w-full bg-transit_white p-4 rounded-md flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-center text-highlight_text">
        Cabin {cabinNumber} Layout
      </h1>
      <div className="grid grid-cols-4 gap-4 mt-6 mb-6">
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