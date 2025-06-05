import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CabinLayout from "../components/CabinLayout/CabinLayout";
import VideoDataDisplay from "../components/VideoDataDisplay/VideoDataDisplay";
import Navbar from "../components/NavBar";
import api from "../api";

//delete this later after testing
import dev_image from "../assets/dev_image.jpeg"; // Temporary image for development

function CabinPage() {
  //How this is structured is absolutely terrible, but im afraid to touch it
  const devMode = import.meta.env.VITE_DEVMODE == "development"; //get rid of dev mode after testing
  const [trainData, setTrainData] = useState(
    JSON.parse(localStorage.getItem("trainData")),
  );
  const { cabinNumber } = useParams();
  const [capturedImage, setCapturedImage] = useState(null);
  const [counts, setCounts] = useState({
    person: 0,
    chair: 0,
    people_sitting: 0,
  });
  const [occupiedChairs, setOccupiedChairs] = useState([]);
  //Temporary variable to make seat color change to green
  const [clickedChairs, setClickedChairs] = useState({});

  const handleCapture = async (image) => {
    setCapturedImage(devMode ? dev_image : image);
    //This is all temprary code for development purposes
    let file;
    if (devMode) {
      const response = await fetch(dev_image);
      const blob = await response.blob();
      file = new File([blob], "captured_image.jpg", { type: blob.type });
    } else {
      file = dataURLtoFile(image, "captured_image.jpg");
    }

    const formData = new FormData();
    formData.append("image", file);

    api
      .post("/api/upload_image/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        const processedImageBase64 = response.data.image;
        setCapturedImage(`data:image/jpeg;base64,${processedImageBase64}`);
        console.log("Image uploaded successfully:", response.data);
        setCounts(response.data.counts);
        setOccupiedChairs(response.data.occupied_chairs); // Set occupied chairs
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };

  // test handler for image upload (only for testing purposes)
  /*const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      api
        .post("/api/upload_image/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          const processedImageBase64 = response.data.image;
          setCapturedImage(`data:image/jpeg;base64,${processedImageBase64}`);
          setCounts(response.data.counts);
          setOccupiedChairs(response.data.occupied_chairs); // Set occupied chairs
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    }
  };*/

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  //Temp functions to change chairs to green
  const handleClick = (index) => {
    if (occupiedChairs.includes(index)) {
      // Toggle clicked state for the specific chair
      setClickedChairs((prev) => ({
        ...prev,
        [index]: !prev[index], // Toggle the clicked state for this chair
      }));
    }
  };

  const getColor = (index) => {
    if (occupiedChairs.includes(index)) {
      // If the chair is occupied and clicked, it turns green
      return clickedChairs[index] ? "bg-green-500" : "bg-red-500";
    } else {
      // Default color is gray
      return "bg-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      <Navbar route={"/cabins"} />
      <div className="w-full p-6 lg:px-6 lg:py-0 gap-4 md:gap-8 flex flex-nowrap max-md:flex-col max-md:justify-start justify-center h-[85%] md:mt-[2.5%] max-sm:mt-[-5%] sm:items-stretch top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] absolute">
        <CabinLayout
          cabinNumber={cabinNumber}
          counts={counts}
          occupiedChairs={occupiedChairs}
          clickedChairs={clickedChairs}
          handleClick={handleClick}
          getColor={getColor}
        />
        {/* */}
        <VideoDataDisplay
          capturedImage={capturedImage}
          counts={counts}
          handleCapture={handleCapture}
        ></VideoDataDisplay>
      </div>
    </div>
  );
}

export default CabinPage;
