import { useState, useEffect, useRef } from "react";
import LiveVideoData from "./LiveVideoData";
import CapturedImageData from "./CapturedImageData";
import PropTypes from "prop-types";
import { Navigation, Pagination } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../styles/customSwiper.css";
function VideoDataDisplay({ capturedImage = null, counts, handleCapture }) {
  const webcamRef = useRef(null);
  const [webcamHeight, setWebcamHeight] = useState(0);
  const [webcamWidth, setWebcamWidth] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  const handleWebcamReady = ({ height, width }) => {
    setWebcamHeight(height);
    setWebcamWidth(width);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      {isDesktop ? (
        <div className="md:flex xs:w-1/2  gap-2 bg-transit_white p-4 rounded-md hidden items-center justify-start flex-col">
          <LiveVideoData
            ref={webcamRef}
            handleCapture={handleCapture}
            onWebcamReady={handleWebcamReady}
          />
          <CapturedImageData
            counts={counts}
            capturedImage={capturedImage}
            placeholderWidth={webcamWidth}
            placeholderHeight={webcamHeight}
          ></CapturedImageData>
        </div>
      ) : (
        <div className="flex justify-center max-md:justify-self-end md:hidden w-full md:w-3/6   bg-transit_white rounded-md">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={10}
            slidesPerView={1}
            pagination={{ clickable: true, el: ".swiper-pagination" }}
            navigation
            className="w-full h-full pb-[40px] md:pb-0"
          >
            <SwiperSlide className="flex items-center justify-start p-2">
              <LiveVideoData
                ref={webcamRef}
                handleCapture={handleCapture}
                onWebcamReady={handleWebcamReady}
              />
            </SwiperSlide>
            <SwiperSlide className="flex items-center justify-start p-2">
              <CapturedImageData
                counts={counts}
                capturedImage={capturedImage}
                placeholderWidth={webcamWidth}
                placeholderHeight={webcamHeight}
              ></CapturedImageData>
            </SwiperSlide>
            <div className="swiper-pagination"></div>
          </Swiper>
        </div>
      )}
    </>
  );
}
VideoDataDisplay.propTypes = {
  capturedImage: PropTypes.string,
  counts: PropTypes.shape({
    person: PropTypes.number.isRequired,
    chair: PropTypes.number.isRequired,
    people_sitting: PropTypes.number.isRequired,
  }).isRequired,
  handleCapture: PropTypes.func.isRequired,
};

export default VideoDataDisplay;
