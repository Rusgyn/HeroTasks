import React, {useState} from "react";
import '../styles/FormRegister.scss';

interface Props {
  onSubmit: (
    user: {
      first_name: string,
      last_name: string,
      email: string,
      password: string,
      code: string,
    }
  ) => Promise<void>;
}
const FormRegister: React.FC<Props> = ({ onSubmit }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [formErrorMessage, setFormErrorMessage] = useState('');

  // Reusable state reset function 
  const resetFormFields = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setCode('');
    setFormErrorMessage('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newFirstName = firstName.trim();
    const newLastName = lastName.trim();
    const newEmail = email.trim();


    // Guard Statement, ensure a valid email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(newEmail)) {
      setFormErrorMessage(`⛔️ Registration Error ⛔️` + `\n` +
        `The email: "${email}" is not valid. Please enter a valid email address. (e.g. sample@email.com)`);
      return;
    }

    //Guard Statement, ensure password requirements are meet.
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{7,}$/;
    if (!passwordPattern.test(password)) {
      setFormErrorMessage("⛔️ Registration Error ⛔️\n" + " Password requirements:\n" + 
        "• At least 7 characters\n" +
        "• At least 1 number\n" +
        "• At least 1 lowercase letter\n" +
        "• At least 1 uppercase letter\n" +
        "• At least 1 special character");
      return;
    }
    
    setFormErrorMessage('');

    //Process the registration
    await onSubmit({
      first_name: newFirstName,
      last_name: newLastName,
      email: newEmail,
      password: password,
      code: code,
    });

    resetFormFields();
  };

  const handleCancel =() => {
    resetFormFields();
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="user" className="form_register__header">Welcome to HeroTasks!</label>

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
        onChange={(event) => setFirstName(event.target.value)}
        placeholder="First Name"
        required
        autoFocus
      />
      <input
        id="last_name"
        type="text"
        name="last_name"
        value={lastName}
        onChange={(event) => setLastName(event.target.value)}
        placeholder="Last Name"
        required
      />
      <input
        id="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Valid email address"
        required
      />
      <input
        id="password"
        type="password"
        value={password}
        minLength={7}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Unique Password (min 7 chars)"
        title="Password must be at least 7 characters and include at least: 1 number, 1 lowercase letter, 1 uppercase letter, and 1 special character."
        required
      />
      {/* Code must be 4 digits (e.g., "0004") */}
      <input
        id="code"
        type="text"
        inputMode="numeric"
        //regex \d stands for digit.{4} enforces exactly 4 digits
        pattern="\d{4}"
        maxLength={4}
        placeholder="0000"
        value={code}
        onChange={(event) => {
          const newValue = event.target.value;
          //.test() is a method provided by regular expressions (RegExp) that checks if a string matches a pattern. {0,4} only 4 digits allowed
          if (/^\d{0,4}$/.test(newValue)) {
            setCode(newValue);
          }
        }}
        required
      />
      <div className='form_register__btn'>
        <button type="submit" >Add</button>
        <button type="submit" onClick={handleCancel} >Cancel</button>
      </div>

    </form>
  );
};

export default FormRegister;