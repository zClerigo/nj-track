import api from "./api";

export const interval = (date1, date2) => {  
  const time1InMilliseconds = date1.getTime();
  const time2InMilliseconds = date2.getTime();
  return time2InMilliseconds - time1InMilliseconds;
};

export const listOfLeftOverStops = (listOfStops) => {
  let arr = listOfStops;
  for (let i = listOfStops.length - 1; i >= 0; i--) {  
    let time = interval(new Date(), new Date(listOfStops[i].TIME))
    if (listOfStops[i].DEPARTED === "YES" || time < -60000) { //One minute after scheduled arrival time
      arr = listOfStops.slice(i + 1, listOfStops.length);
      break;
    }
  }
  return arr;
};

//Handle Refreshing the Train Data
export const fetchNewTrainData = async (train_data) => {
  try {
    const response = await api.get("/api/get_train_data/", {
      params: { train_id: train_data.TRAIN_ID },
    });
    const data = response.data;
    localStorage.setItem("trainData", JSON.stringify(data)); //For use later
  } catch (Error) {
    console.error("Error Refreshing Train Data: ", Error);
  }
};


export const periodicRefresh = (data, callBackEnd, callBackContinue) => {  
  let listOfStops = data.STOPS;
  let leftOverStops = listOfLeftOverStops(listOfStops);   
  if (leftOverStops.length > 0) {  
    callBackContinue(data)
  } 
  else {   
    callBackEnd()
  }
}