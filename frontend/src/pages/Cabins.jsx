import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import Cabin from "../components/Cabin";
import NJT_LOGO_2 from "../assets/NJ_Transit_Logo_2.png"

function Cabins() {
  return (
    <div className="min-h-screen bg-transit_black text-white">
      <div className="w-full bg-white flex">
        <div className="w-60 mt-2 p-1">
          <img
            src={NJT_LOGO_2}
            className="object-contain"
            alt="NJ Transit Logo"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 mt-5">
        <h1 className="text-3xl highlight_text font-bold text-center">
          Welcome, Please Select a Cabin
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 bg-transit_white p-2 rounded-lg m-3">
        {Array.from({ length: 18 }).map((_, index) => (
          <Cabin cabinNumber={index + 1}></Cabin>
        ))}
      </div>
    </div>
  );
}

export default Cabins;
