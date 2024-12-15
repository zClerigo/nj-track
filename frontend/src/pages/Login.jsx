import Form from "../components/Form"

function Login() {
    return ( 
    <div className="min-h-screen bg-transit_black text-normal_text p-6 flex justify-center align-center">  
    <Form route="/api/token/" method="login"/>
    </div>)
}

export default Login