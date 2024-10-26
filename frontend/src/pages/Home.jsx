import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleButtonClick = (cabinNumber) => {
    navigate(`/cabin/${cabinNumber}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="grid grid-cols-1 gap-6">
        <h1 className="text-3xl font-bold text-center">
          Welcome, Please Select a Cabin
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        {Array.from({ length: 18 }).map((_, index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(index + 1)}
            className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 text-center"
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Home;
