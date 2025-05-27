import api from "../../api";
import MainForm from "./MainForm";
import Modal from "../Modal";

export default function TrainPickerForm() {
  let errorModal = null;
  return (
    <MainForm
      title="Pick Train"
      fields={[
        { name: "trainId", type: "text", placeholder: "Enter Train ID" },
      ]}
      buttonLabel="Submit"
      redirectLink="/login"
      redirectText="Sign out"
      onSubmit={async (formData, setError, navigate, setLoading) => {
        if (formData.trainId) {
          try {
            const response = await api.get("/api/get_train_data/", {
              params: { train_id: formData.trainId },
            });
            const data = response.data;
            localStorage.setItem("trainData", JSON.stringify(data));
            navigate("/cabins");
          } catch (error) {
            if (error.response.status === 500) {
              errorModal = (
                <Modal
                  title="Apologies for the inconvenience"
                  message="Our server had a problem processing your request! Please come back again at a later time! We thank you for our patience, and we apologize for the inconvenience this has caused."
                  type="warning"
                  isVisible={true}
                ></Modal>
              );
              setError(
                "Sorry, we had a problem with our server processing your request. Please try again later.",
              );
            } else {
              setError("Invalid Train ID");
            }
          }
        } else {
          setError("Invalid Train ID");
        }
        setLoading(false);
      }}
    >
      {errorModal}
    </MainForm>
  );
}
