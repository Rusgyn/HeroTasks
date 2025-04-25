import React from "react";

const Session = () => {

  return (
    <div>
      <h1>Session</h1>
      <p>This is the session component.</p>
      <p>It will be used to manage user sessions.</p>
      <form>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" />
        <br />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" />
        <br />
        <button type="submit">Login</button>
      </form>

      <p>Don't have an account? <a href="/register">Register here</a></p>
      <p>Forgot your password? <a href="/forgot-password">Reset it here</a></p>
      <p>Need help? <a href="/help">Contact us</a></p>
    </div>
  )
}
export default Session;