import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import WebcamCapture from "../components/WebcamCapture";
import api from "../api";

function CabinPage() {
  const { cabinNumber } = useParams();
  const [capturedImage, setCapturedImage] = useState(null);
  const [counts, setCounts] = useState({ person: 0, chair: 0 });

  const handleCapture = (image) => {
    setCapturedImage(image);

    const file = dataURLtoFile(image, 'captured_image.jpg');
    const formData = new FormData();
    formData.append('image', file);

    api
      .post('/api/upload_image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        const processedImageBase64 = response.data.image;
        setCapturedImage(`data:image/jpeg;base64,${processedImageBase64}`);
        setCounts(response.data.counts);
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
      });
  };

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center justify-center">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Cabin {cabinNumber} Layout</h1>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-6 mb-6">
        {Array.from({ length: counts.chair }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-700 w-20 h-20 rounded-lg flex items-center justify-center text-center"
          >
            {index + 1}
          </div>
        ))}
      </div>
      <h2 className="text-3xl font-bold mb-6">Live Video</h2>
      <WebcamCapture onCapture={handleCapture} className="w-80 h-auto" />
      <div className="bg-gray-800 p-4 rounded-lg mt-6">
        <h2 className="text-2xl font-bold mb-4">Captured Image</h2>
        {capturedImage ? (
          <>
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full h-auto rounded-lg mb-4" 
            />
            <div className="mt-4 text-lg">
              <p>Number of People: {counts.person}</p>
              <p>Number of Chairs: {counts.chair}</p>
            </div>
          </>
        ) : (
          <p>No image captured yet.</p>
        )}
      </div>
    </div>
  );
}

export default CabinPage;
