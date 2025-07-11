import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthSession from "../auth/useAuthSession";
import Modal from './Modal';
import FormRegister from "./FormRegister";
import ContactUsFooter from "./ContactUsFooter";
import '../styles/Session.scss';
const backendUrl = import.meta.env.VITE_BACKEND_URL || '';

console.log("🔧 BACKEND URL:", backendUrl);
console.log("🌐 All ENV Vars:", import.meta.env);

const Session = () => {
  const navigate = useNavigate();
  const { isSessionActive, isLoading } = useAuthSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalPurpose, setModalPurpose] = useState<'register' | 'forgot-password' | 'help' | null>(null);


  //Check the session status
  useEffect(() => {
    if (!isLoading && isSessionActive) {
      navigate('/task-board'); // user loggedIn, redirect to hero task board
    }
  }, [isSessionActive, isLoading, navigate]);

  if (isLoading) {
    return null; //spinner component. Shows nothing when checking is session is active or inactive
  }

  const togglePasswordView = () => {
    setShowPassword(!showPassword);
  };


  // Handles the login functionality
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
  
    try {
      const response = await axios.post(`${backendUrl}/HeroTasks/login`, 
        { username, password }, { withCredentials: true }
      );

      if (response.status === 200) {
        navigate('/task-board'); //Heroes Dashboard
      }

    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('An error occurred. Please try again.');
      } 
    }
    
    setUsername('');
    setPassword('');
  };

  //Handles new user registration
  const handleRegistration = async( user: {
      first_name: string,
      last_name: string,
      email: string,
      password: string,
      code: string, 
    } ) => {

    try {
      const response = await axios.post(`${backendUrl}/HeroTasks/register/`, user);

      const newUser = response.data;
      console.log("Registration. New user data: ", newUser);

      if (response.status === 201) {
        navigate('/login');
      }
      
    } catch (error) {
      console.error("Registration. Error adding new user: ", error);
      setErrorMessage('An error occurred. Please try again.');
    }

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
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                {password && (
                  <span
                    className="toggle-password"
                    onClick={togglePasswordView}
                    role="button"
                    tabIndex={0}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </span>
                )}
              </div>
              
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
            {/* For Future. WIP
            * Forgot your password? <a href="#" 
            onClick={(e) => {
              e.preventDefault();
              setModalPurpose('forgot-password');
            }}>Reset it here</a>
            <br/> */}
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
                  <FormRegister
                  onSubmit={async(user) => {
                    console.log('New User');
                    await handleRegistration(user)
                    setModalPurpose(null);
                  }}/>
                
                )}
                {/* {modalPurpose === 'forgot-password' && (<PasswordReset />)} ** For Future. WIP */}
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
          <a className="session_footer_a_1" href="/register" target="_blank">Sign-up </a> |
          <a className="session_footer_a_2" href="/login"> login </a> | 
          <a className="session_footer_a_1" href="/help" target="_blank"> Contact Us </a> | 
          <a className="session_footer_a_2" href="https://facebook.com" target="_blank"> Facebook </a> | 
          <a className="session_footer_a_1" href="https://google.com" target="_blank"> Google</a>
        </span>
      </footer>
      
    </div>
  )
  
};

export default Session;