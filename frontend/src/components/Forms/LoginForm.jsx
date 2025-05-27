import MainForm from "./MainForm";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import api from "../../api";

export default function LoginForm() {
  return (
    <MainForm
      title="Login"
      fields={[
        { name: "username", type: "text", placeholder: "Username" },
        { name: "password", type: "password", placeholder: "Password" },
      ]}
      buttonLabel="Login"
      redirectLink="/register"
      redirectText="Don't have an account? Register"
      onSubmit={async (formData, setError, navigate) => {
        try {
          const res = await api.post("/api/token/", formData);
          localStorage.setItem(ACCESS_TOKEN, res.data.access);
          localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
          navigate("/");
        } catch  { 
          setError("Invalid credentials. Please try again.");
        }
      }}
    />
  );
}
