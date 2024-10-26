import React from 'react';
import { useParams } from 'react-router-dom';
import WebcamCapture from "../components/WebcamCapture";

function CabinPage() {
  const { cabinNumber } = useParams();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center justify-center">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Cabin {cabinNumber} Layout</h1>
      </div>
      <WebcamCapture className="w-80 h-auto" />
    </div>
  );
}

export default CabinPage;
