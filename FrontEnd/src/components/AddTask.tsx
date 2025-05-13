import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthSession from "../auth/useAuthSession";
import '../styles/AddTask.scss';


const AddTask = () => {
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
      <div className="addTask_notes">
        <h2>Add new Tasks</h2>
        <p> This page is under maintenance. Please come back later.</p>
      </div>
      <button className="addTask_btn__back"
        type='button'
        value="back"
        onClick={() => {navigate(-1)}}> Back {/* Go back to prev page */}
      </button>
    </>

  )
}

export default AddTask;