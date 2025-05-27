import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import CabinPage from "./pages/CabinPage";
import Cabins from "./pages/Cabins";
import "./styles/tailwind.css";
import {
  interval,
  listOfLeftOverStops,
  fetchNewTrainData,
} from "./NJ_Transit_DataService";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}
function CabinWrapper() {

  const params = useParams();
  const trainData = localStorage.getItem("trainData");
  const [parsedTrainData, setParsedTrainData] = React.useState(
    trainData ? JSON.parse(trainData) : null,
  );
  React.useEffect(() => {
    let timedRefresh;
    //Check times between now and next station
    let listOfStops = parsedTrainData.STOPS;
    if (
      parsedTrainData &&
      parsedTrainData.STOPS != null &&
      parsedTrainData != undefined
    ) {
      let leftOverStops = listOfLeftOverStops(listOfStops);
      console.log(leftOverStops);
      console.log(parsedTrainData.STOPS);
      if (leftOverStops.length > 0) {
        let timeBtwnStations = interval(
          new Date(),
          new Date(leftOverStops[0].TIME),
        );
        let time = timeBtwnStations > 0 ? timeBtwnStations + 60000 : 60000;
        console.log(time);
        timedRefresh = setTimeout(async () => {
          await fetchNewTrainData(parsedTrainData);
          setParsedTrainData(JSON.parse(localStorage.getItem("trainData")));
        }, time);
      }
    }
    return () => {
      if (
        parsedTrainData &&
        parsedTrainData.STOPS != null &&
        parsedTrainData != undefined
      ) {
        let leftOverStops = listOfLeftOverStops(listOfStops);
        if (leftOverStops > 0) clearTimeout(timedRefresh);
      }
    };
  });

  return params.cabinNumber ? <CabinPage /> : <Cabins />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/cabins" element={<CabinWrapper />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/cabins/:cabinNumber" element={<CabinWrapper />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
