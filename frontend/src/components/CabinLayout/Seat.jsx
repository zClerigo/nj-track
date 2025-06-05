import PropTypes from "prop-types";
import seat from "../../assets/seat.png";
function Seat({ handleClick, index, getColor }) {
  return (
    <div
      className={`max-w-[100px] relative flex justify-center items-center w-full h-full cursor-pointer`}
      onClick={() => handleClick(index)}
    >
      <div className={`${getColor(index)} absolute rounded-lg inset-0 opacity-70`}></div>
      <img src={seat} alt="seat" className="w-full h-auto z-10 -rotate-90" />
      <span className="text-transit_white font-bold absolute text-center inset-x-0 z-20 sm:text-sm text-xs">
        {index + 1}
      </span>
    </div>
  );
}
Seat.propTypes = {
  handleClick: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  getColor: PropTypes.func.isRequired,
};
export default Seat;
