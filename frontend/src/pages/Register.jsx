import Form from "../components/Form"

function Register() {
    return ( 
    <div className="min-h-screen bg-transit_black text-normal_text p-6 flex justify-center align-center">
    <Form route="/api/user/register/" method="register"/> 
    </div>)
}

export default Register