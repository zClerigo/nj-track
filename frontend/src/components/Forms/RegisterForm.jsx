import MainForm from "./MainForm";
import api from "../../api";
export default function RegisterForm() {
  return (
    <MainForm
      title="Register"
      fields={[
        { name: "username", type: "text", placeholder: "Username" },
        { name: "password", type: "password", placeholder: "Password" },
      ]}
      buttonLabel="Register"
      redirectLink="/login"
      redirectText="Already have an account? Login"
      onSubmit={async (formData, setError, navigate) => {
        try {
          await api.post("/api/user/register/", formData);
          navigate("/login");
        } catch  { 
          setError("Registration failed. Please try again.");
        }
      }}
    ></MainForm>
  );
}
