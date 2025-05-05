import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/Session.scss';

const Session = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [_error, setError] = useState('');

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
  
    try {
      const response = await axios.post('/HeroTasks/login', 
        { username, password }
      );
      console.log("Session Response is: ", response);

      if (response.status === 200) {
        navigate('/user-home');
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('An error occurred. Please try again.');
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
          <h2>Empower your little heroes to complete task, build habits, and grow stronger everyday</h2>
        </div>
      
        <div className="session_login">
          
          <form onSubmit={handleLogin} className="session_login__form">
            <h2>Superhero</h2>
            <div>
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

              <div className="session_btn">
                <button className="session_btn__login" type="submit">Login</button>
                <button className="session_btn__back"
                  type='button'
                  value="back"
                  onClick={() => {navigate(-1)}}> Back {/* Go back to prev page */}
                </button>
              </div>

            </div>
          </form>

          <footer>
            <span>
            Don't have an account? <a href="/register">Register here</a>
            <br/>
            Forgot your password? <a href="/forgot-password">Reset it here</a>
            <br/>
            Need help? <a href="/help">Contact us</a>
            </span>    
          </footer>
        </div>
      </div>


      <div className="session_footer">
        <span className="session_footer_a">
          <a className="session_footer_a_1" href="/register">Sign-up </a> |
          <a className="session_footer_a_2" href="/login"> login </a> | 
          <a className="session_footer_a_1" href="/forgot-password"> Reset Password </a> | 
          <a className="session_footer_a_2" href="/help"> Contact us </a> | 
          <a className="session_footer_a_1" href="http://google.com"> Google</a>
        </span>

      </div>
      
    </div>


    
  )
}
export default Session;