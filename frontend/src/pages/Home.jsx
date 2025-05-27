import TrainPickerForm from "../components/Forms/TrainPickerForm";
function Home() {  
  localStorage.removeItem("trainData")
  return (
    <div className="min-h-screen bg-transit_black text-normal_text p-6 flex justify-center align-center">
     <TrainPickerForm></TrainPickerForm>
    </div>
  );
}

export default Home;
