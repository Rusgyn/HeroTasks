import { useNavigate } from "react-router-dom";
import '../styles/AddTask.scss';


const AddTask = () => {
  const navigate = useNavigate();

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