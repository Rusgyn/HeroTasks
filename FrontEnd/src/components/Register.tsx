//Register component
import { useNavigate } from "react-router-dom";
import '../styles/Register.scss';

const Register = () => {
  const navigate = useNavigate();

  return(
    <>
      <div className="register_notes">
        <h2>Registration</h2>
        <p> This page is under maintenance. Please come back later.</p>
      </div>
      <button className="register_btn__back"
        type='button'
        value="back"
        onClick={() => {navigate(-1)}}> Back {/* Go back to prev page */}
      </button>
    </>

  )
}

export default Register;