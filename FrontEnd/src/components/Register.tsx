//Register component
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Register.scss';
import useAuthSession from "../auth/useAuthSession";

const Register = () => {
  const navigate = useNavigate();
  const { isSessionActive, isLoading } = useAuthSession();

  //Check the session status
  useEffect(() => {
    if (!isLoading && isSessionActive) {
      navigate('/task-board'); // user loggedIn, redirect to hero task board
    }
  }, [isSessionActive, isLoading, navigate]);

  if (isLoading) {
    return null; //spinner component. Shows nothing when checking is session is active or inactive
  }

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