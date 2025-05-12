import { useNavigate } from "react-router-dom";
import '../styles/PasswordReset.scss';

const PasswordReset = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="password_reset_notes">
        <h2>Password Reset</h2>
        <p>This page in under maintenance. Please come back later.</p>
      </div>
      <button className="password_reset_notes__back"
        type='button'
        value="back"
        onClick={() => {navigate(-1)}}> Back {/* Go back to prev page */}
      </button>
    </>
  )

}

export default PasswordReset;