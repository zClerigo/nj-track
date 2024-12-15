import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import NJ_Transit_Logo from "../assets/NJ_Transit_Logo.jpeg";
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method }) {
  const [loading, setLoading] = useState(false);
  if (method === "login" || method === "register") {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
      setLoading(true);
      e.preventDefault();

      try {
        const res = await api.post(route, { username, password });
        if (method === "login") {
          localStorage.setItem(ACCESS_TOKEN, res.data.access);
          localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
          navigate("/");
        } else {
          navigate("/login");
        }
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <form
        onSubmit={handleSubmit}
        className="form-container absolute w-1/2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 m-auto bg-transit_white text-transit_black shadow-[0px_6px_10px_0px_gray-900] rounded-lg"
      >
        <img
          src={NJ_Transit_Logo}
          className="mt-4 object-contain p-2 bg-gray-900 rounded-full h-20 w-20 relative top-[-20px]"
          alt="NJ Transit Logo"
        />
        <h1 className="font-bold text-2xl text-highlight_text">{name}</h1>
        <input
          className="my-[10px] w-4/6 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-400 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-700 hover:border-slate-300 shadow-sm focus:shadow"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          className="my-[10px] w-4/6 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-400 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-700 hover:border-slate-300 shadow-sm focus:shadow"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {loading && <LoadingIndicator />}
        <button
          className="bg-transit_blue text-normal_text my-[10px] p-3 w-5/6 hover:bg-[#0778e3]"
          type="submit"
        >
          {name}
        </button>
        <span className="text-sm text_transit_black m-2">
          {method === "login" ? (
            <>
              Don't have an account? Register&nbsp;
              <a
                className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600 cursor-pointer"
                onClick={() => navigate("/register")}
              >
                here
              </a>
            </>
          ) : (
            <>
              Already have an account? Login&nbsp;
              <a
                className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                here
              </a>
            </>
          )}
        </span>
      </form>
    );
  } else if (method == "train_picker") {
    const [trainId, setTrainId] = useState(""); // State to hold input value
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Hook to navigate programmatically

    //Handle token logic
    const getToken = async () => {
      var response = await api.get("api/get_token/");
      var data = response.data;
      setToken(data["token"]);
    };

    const validateToken = async () => {
      var response = await api.post("api/validate_token/");
      var data = response.data; 
      console.log(data)
      return data["isValid"];
    };

    const [token, setToken] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const checkAndFreshToken = async () => {
      if (isRefreshing) {
        return;
      }
      setIsRefreshing(true);
      var isValid = await validateToken(); 
      console.log(isValid)
      if (!isValid) {
        try {
          const response = await api.post("api/refresh_token/");
          const data = response.data;
          setToken(data["token"]);
        } catch (error) {
          console.error("Error refreshing token:", error);
        } finally {
          setIsRefreshing(false);
        }
      }
    };

    useEffect(() => {
      getToken();
    }, []);

    useEffect(() => {
      if (token) {
        checkAndFreshToken();
      }
    }, [token, isRefreshing]);

    const validateTrainId = async () => {};
    const handleSubmit = (e) => {
      e.preventDefault(); // Prevent default form submission
      setLoading(true);
      if (trainId) {
        navigate(`/${trainId}`); // Navigate to the user detail page with the input ID
      } else {
        setError("Not Valid Train ID");
        setLoading(false);
      }
    };

    return (
      <form
        onSubmit={handleSubmit}
        className="form-container absolute w-1/2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 m-auto bg-transit_white text-transit_black shadow-[0px_6px_10px_0px_gray-900] rounded-lg"
      >
        <img
          src={NJ_Transit_Logo}
          className="mt-4 object-contain p-2 bg-gray-900 rounded-full h-20 w-20 relative top-[-20px]"
          alt="NJ Transit Logo"
        />
        <h1 className="font-bold text-2xl text-highlight_text">Pick Train</h1>
        <input
          type="text"
          value={trainId}
          onChange={(e) => {
            setTrainId(e.target.value);
            if (error) {
              setError("");
            }
          }}
          className="w-5/6 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-400 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-700 hover:border-slate-300 shadow-sm focus:shadow"
          placeholder="Enter Train ID"
        />
        {error && (
          <p className="text-sm" style={{ color: "red" }}>
            {error}
          </p>
        )}
        {loading && <LoadingIndicator />}
        <button
          className="bg-transit_blue text-normal_text my-[10px] p-3 w-5/6 hover:bg-[#0778e3]"
          type="submit"
        >
          Submit
        </button>
        <a
          className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Sign out
        </a>
      </form>
    );
  }
}

export default Form;
