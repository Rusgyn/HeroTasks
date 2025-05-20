import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthSession from "../auth/useAuthSession";
import Modal from './Modal';
import Register from "./Register";
import PasswordReset from "./PasswordReset";
import ContactUs from "./ContactUs";
import ContactUsFooter from "./ContactUsFooter";
import '../styles/Session.scss';

const Session = () => {
  const navigate = useNavigate();
  const { isSessionActive, isLoading } = useAuthSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [modalPurpose, setModalPurpose] = useState<'register' | 'forgot-password' | 'help' | null>(null);


  //Check the session status
  useEffect(() => {
    if (!isLoading && isSessionActive) {
      navigate('/task-board'); // user loggedIn, redirect to hero task board
    }
  }, [isSessionActive, isLoading, navigate]);

  if (isLoading) {
    return null; //spinner component. Shows nothing when cheking is session is active or inactive
  }

  // Handles the login functionality
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
  
    try {
      const response = await axios.post('/HeroTasks/login', 
        { username, password }, { withCredentials: true }
      );
      console.log("Session Response is: ", response);

      if (response.status === 200) {
        navigate('/task-board'); //Heroes Dashboard
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        setErrorMessage(error.response.data.error);;
      } else {
        setErrorMessage('An error occurred. Please try again.');
      } 
    }
    
    setUsername('');
    setPassword('');
  };

  return (
    <div className="session_page">

      <div className="session">
        <div className="session_notes">
          <h1>HeroTasks</h1>
          Empower your little heroes to complete task, build habits, and grow stronger everyday
        </div>
        <div className="session_login">
          <form onSubmit={handleLogin} className="session_login__form">
            <h2>Superhero</h2>
            <label htmlFor="username">      
              <input type="text"
                id="username"
                name="username"
                placeholder="Email address"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </label>
            <label htmlFor="password">   
              <input type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>

            {errorMessage && <p className="session_login_error">{ errorMessage }</p>}

            <div className="session_btn">
              <button className="session_btn__login" type="submit">Login</button>
              <button className="session_btn__back"
                type='button'
                value="back"
                onClick={() => {navigate(-1)}}> Back {/* Go back to prev page */}
              </button>
            </div>
          </form>
          <div className="session_login__footer">
            <span>
            Don't have an account? <a href="#" 
            onClick={(e) => {
              e.preventDefault();
              setModalPurpose('register');
            }}> Register here </a>
            <br/>
            Forgot your password? <a href="#" 
            onClick={(e) => {
              e.preventDefault();
              setModalPurpose('forgot-password');
            }}>Reset it here</a>
            <br/>
            Need help? <a href="#" 
            onClick={(e) => {
              e.preventDefault();
              setModalPurpose('help');
            }}>Contact us</a>
            </span>    
          </div>

          {/* ======== MODAL HERE =========== */}
          {modalPurpose && (
            <Modal show={true} onClose={() => {
              setModalPurpose(null);
            }}>
              <Modal.Header>
                <Modal.Title>
                  {modalPurpose === 'register' && 'Register a new account'}
                  {modalPurpose === 'forgot-password' && 'Reset Password'}
                  {modalPurpose === 'help' && 'Need Help?'}
                </Modal.Title>
              </Modal.Header>

              <Modal.Body>
                {modalPurpose === 'register' && (
                  <Register />
                )}
                {modalPurpose === 'forgot-password' && (<PasswordReset />)}
                {modalPurpose === 'help' && (<ContactUsFooter />)}

              </Modal.Body>

              <Modal.Footer>
                <button onClick={() => { setModalPurpose(null); }}>Close</button>
              </Modal.Footer>

            </Modal>
          )}
          
          {/* ==================== */}
        </div>
      </div>

      <footer>
        <span className="session_footer_a">
          <a className="session_footer_a_1" href="/register">Sign-up </a> |
          <a className="session_footer_a_2" href="/login"> login </a> | 
          <a className="session_footer_a_1" href="/forgot-password"> Reset Password </a> | 
          <a className="session_footer_a_2" href="/help"> Contact us </a> | 
          <a className="session_footer_a_1" href="http://google.com"> Google</a>
        </span>
      </footer>
      
    </div>
  )
  
};

export default Session;