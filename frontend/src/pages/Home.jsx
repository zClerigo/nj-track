import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from "axios" 
import Form from "../components/Form"

function Home() {
  return ( 
    <div className="min-h-screen bg-transit_black text-normal_text p-6 flex justify-center align-center">  
    <Form route="/" method="train_picker"/>
    </div>)
}

export default Home;
