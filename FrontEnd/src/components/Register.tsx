//Register component. This is accessible at the footer part of the landing page.
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Register.scss";

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const resetFormFields = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setCode('');
    setFormErrorMessage('');
  };

  useEffect(() => {
    resetFormFields();
  }, []);

  const togglePasswordView = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newFirstName = firstName.trim();
    const newLastName = lastName.trim();
    const newEmail = email.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(newEmail)) {
      setFormErrorMessage(`⛔️ Registration Error ⛔️\nThe email: "${email}" is not valid.`);
      return;
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{7,}$/;
    if (!passwordPattern.test(password)) {
      setFormErrorMessage("⛔️ Registration Error ⛔️\nPassword must have:\n• At least 7 characters\n• 1 number\n• 1 lowercase\n• 1 uppercase\n• 1 special character");
      return;
    }

    setFormErrorMessage('');

    const newUser = {
      first_name: newFirstName,
      last_name: newLastName,
      email: newEmail,
      password: password,
      code: code,
    };

    try {
      const response = await axios.post('/HeroTasks/register/', newUser);
      console.log("Registration. Return new user is: ", response.data);

      if (response.status === 201) {
        navigate('/login');
      }
    } catch (error) {
      console.error("Registration. Error adding new user: ", error);
      setFormErrorMessage("An error occurred. Please try again.");
    }

    resetFormFields();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="user" className="form_register__header">Welcome to HeroTasks!</label>
      <p>
        Empower your little heroes to complete task, build habits, and grow stronger everyday
      </p>

      {formErrorMessage && (
        <div className="form_register__error">
          {formErrorMessage.split('\n').map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      )}

      <input
        id="first_name"
        type="text"
        name="first_name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First Name"
        required
      />
      <input
        id="last_name"
        type="text"
        name="last_name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
        required
      />
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Valid email address"
        required
      />
      <div className="password-input-wrapper">
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          minLength={7}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Unique Password (min 7 chars)"
          required
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

      <input
        id="code"
        type="text"
        inputMode="numeric"
        pattern="\d{4}"
        maxLength={4}
        placeholder="4-digit code"
        value={code}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d{0,4}$/.test(value)) setCode(value);
        }}
        required
      />

      <div className="register__btn">
        <button type="submit">Add</button>
        <button type="button" onClick={resetFormFields}>Cancel</button>
        <button type="button" onClick={()=>navigate('/login')}>HeroTasks</button>
      </div>
    </form>
  );
};

export default Register;