import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

function Cabin({ cabinNumber }) {
  const navigate = useNavigate();
  const handleButtonClick = (cabinNumber) => {
    navigate(`/cabin/${cabinNumber}`);
  };

  return (
    <button
      onClick={() => handleButtonClick(cabinNumber)}
      className="p-4 rounded-lg bg-transit_blue text-normal_text hover:bg-[#0778e3] text-center"
    >{cabinNumber}
    </button>
  );
}
export default Cabin;
