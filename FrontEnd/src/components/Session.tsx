import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

const Session = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!username || !password) {
      alert('Please fill in your username and password');
      return;
    }

    alert('Login button clicked');
    console.log('The Login Request:', { u: username, p: password });
    setUsername('');
    setPassword('');
  };

  return (
    <div className="session">
      <h1>Session</h1>
      <p>This is the session component.</p>
      <p>It will be used to manage user sessions.</p>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username: </label>
        <input type="text"
          id="username"
          name="username"
          placeholder="username@example.com"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <br />
        <label htmlFor="password">Password: </label>
        <input type="password"
          id="password"
          name="password"
          placeholder="********"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <br />
        <button type="submit">Login</button>
      </form>

      <button 
        className="#"
        type='button'
        value="back"
        onClick={() => {navigate(-1)}}> Back {/* Go back to prev page */}
      </button>

      <p>Don't have an account? <a href="/register">Register here</a></p>
      <p>Forgot your password? <a href="/forgot-password">Reset it here</a></p>
      <p>Need help? <a href="/help">Contact us</a></p>
    </div>
  )
}
export default Session;