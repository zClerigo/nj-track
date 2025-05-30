import { periodicRefresh } from "../NJ_Transit_DataService";
import { useState, useEffect, useRef } from "react";
import Cabin from "../components/Cabin";
import Navbar from "../components/NavBar";

function Cabins() {
  useEffect(() => {
    //Only exists speedup camera turn off
    console.log(localStorage.getItem("cabinPageVisited"));
    if (localStorage.getItem("cabinPageVisited")) {
      localStorage.removeItem("cabinPageVisited");
      console.log("reloaded");
      window.location.reload();
    }
  }, []);

  const trainData = useRef(JSON.parse(localStorage.getItem("trainData")));
  const conjoinCabins = (listOfSections) => {
    let arr = [];
    for (var section of listOfSections) {
      for (var cabin of section.CARS) {
        arr.push(cabin);
      }
    }
    return arr;
  };
  const [cabins, setCabins] = useState(
    trainData.current.CAPACITY && trainData.current.CAPACITY.length > 0
      ? conjoinCabins(trainData.current.CAPACITY[0].SECTIONS)
      : [],
  );
  useEffect(() => {
    let timer;
    trainData.current = JSON.parse(localStorage.getItem("trainData"));
    const callBackEnd = () => {
      setCabins([]);
    };
    const callBackContinue = (data) => {
      if (
        data.CAPACITY &&
        data.CAPACITY.length > 0 &&
        data.CAPACITY[0].SECTIONS.length > 0
      ) {
        var arrOfCabins = conjoinCabins(data.CAPACITY[0].SECTIONS);
        setCabins(arrOfCabins);
      }
    };

    if (trainData.current) {
      timer = setTimeout(() => {
        periodicRefresh(trainData.current, callBackEnd, callBackContinue);
      }, 60000);
    }
    //For debugging
    console.log(cabins);
    return () => {
      if (trainData.current) clearInterval(timer);
    };
  });

  return (
    <div className="min-h-screen bg-transit_black text-white">
      <Navbar route="/" />
      <div className="absolute flex flex-col gap-3 justify-content min-w-72 sm:w-4/5 bg-transit_white p-4 rounded-md top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] max-sm:mt-[-10%]">
        <h1 className="text-3xl text-highlight_text font-bold text-center">
          Cabins Displayed Here
        </h1>
        <div className="grid border-dashed border-slate-500 lg:max-h-[550px] sm:max-h-[500px] max-h-[450px]  border-4 md:p-2 sm:p-4 p-6 grid-cols-12 overflow-y-auto gap-4 w-full rounded-lg justify-center items-center content-start">
          {cabins.length > 0 ? (
            cabins.map((cabin) => <Cabin key={cabin.CAR_NO} cabinNumber={cabin.CAR_NO} />)
          ) : (
            <h3 className="col-span-12 text-4xl font-bold text-center text-transit_orange p-4">
              No cabins available
            </h3>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cabins;
