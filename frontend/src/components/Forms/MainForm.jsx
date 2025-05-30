import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Form.css";
import logo from "../../assets/Alt_NJ_Transit_Logo_1.jpeg";
import LoadingIndicator from "../LoadingIndicator"; 
import PropTypes from "prop-types";

function MainForm({ title, fields, onSubmit, buttonLabel, redirectLink, redirectText }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData, setError, navigate, setLoading);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="form-container absolute w-72 flex-grow sm:w-1/2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 m-auto bg-transit_white text-transit_black shadow-elevation-high-dark rounded-lg"
    >
      <img
        src={logo}
        className="mt-4 object-contain p-2 bg-gray-900 rounded-full h-20 w-20 relative top-[-20px]"
        alt="NJ Transit Logo"
      />
      <h1 className="font-bold text-2xl text-highlight_text">{title}</h1>
      {fields.map((field) => (
        <input
          key={field.name}
          className="my-2.5 w-full sm:w-4/6 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-400 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-700 hover:border-slate-300 shadow-sm focus:shadow"
          type={field.type}
          name={field.name}
          value={formData[field.name]}
          onChange={handleChange}
          placeholder={field.placeholder}
        />
      ))}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {loading && <LoadingIndicator />}
      <button
        className="bg-transit_blue text-normal_text my-2.5 p-3 w-full sm:w-5/6 hover:bg-[#0778e3]"
        type="submit"
      >
        {buttonLabel}
      </button>
      <span className="text-sm text_transit_black m-2">
        {redirectText}&nbsp;
        <a
          className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600 cursor-pointer"
          onClick={() => navigate(redirectLink)}
        >
          here
        </a>
      </span>
    </form>
  );
} 
MainForm.propTypes = {
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      placeholder: PropTypes.string
    })
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  redirectLink: PropTypes.string.isRequired,
  redirectText: PropTypes.string.isRequired,
};

export default MainForm;