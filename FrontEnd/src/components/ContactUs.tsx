import { useNavigate } from "react-router-dom";
import '../styles/ContactUs.scss';

const ContactUs = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="contact_notes">
        <h2>Registration</h2>
        <p> This page is under maintenance. Please come back later.</p>
      </div>
      <button className="contact_btn__back"
        type='button'
        value="back"
        onClick={() => {navigate(-1)}}> Back {/* Go back to prev page */}
      </button>
    </>
  )
}

export default ContactUs;