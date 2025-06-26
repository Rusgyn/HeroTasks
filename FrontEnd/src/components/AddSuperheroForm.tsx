import React, {useState, useEffect} from "react";

interface Props {
  onSubmit: (
    superhero: {
      superhero_name: string
    }
  ) => Promise<void>;
  errorMessage?: string;
}

const AddSuperheroForm: React.FC<Props> = ({ onSubmit, errorMessage }) => {
  const [heroName, setHeroName] = useState('');
  const [formErrorMessage, setFormErrorMessage] = useState('');

  const resetFormFields = () => {
    setHeroName('');
    setFormErrorMessage('');
  };

  useEffect(() => {
    // Reset the form every time the component mounts or remounts
    resetFormFields();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newHeroName = heroName.trim().toLocaleLowerCase(); 

    if (!newHeroName) {
      setFormErrorMessage(`Please type our new Superhero's name!`);
      return;
    }

    setFormErrorMessage('');
    await onSubmit({ superhero_name: newHeroName});
    resetFormFields();
  }

  const handleCancel = () => {
    resetFormFields();
  }

  return(
    <form onSubmit={handleSubmit}>
      <label htmlFor="superhero" className="form_add_superhero__header">Add New Superhero</label>

      {(formErrorMessage || errorMessage) && (
        <div className="form_add_superhero___error">
          {(formErrorMessage || errorMessage)?.split('\n').map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      )}


      <input
        id="superhero_name"
        type="text"
        name="superhero_name"
        value={heroName}
        onChange={(event) => setHeroName(event.target.value)}
        placeholder="Superhero Name"
        autoFocus
      />

      <div className='form_add_superhero__btn'>
        <button type="submit" >Add</button>
        <button type="button" onClick={handleCancel} >Cancel</button>
      </div>

    </form>
  );

}

export default AddSuperheroForm;