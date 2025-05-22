import React, { useState } from 'react';
import '../styles/FormTask.scss'

interface Props {
  onSubmit: (
    task: { 
    superpower: string
    }
  ) => Promise<void>;
}

const FormTask: React.FC<Props> = ({ onSubmit }) => {
  const [task, setTask] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newTask = task.trim();

    await onSubmit({superpower: newTask});
    setTask('');
  };

  const handleCancel =() => {
    setTask('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="task">A new mission to save the day!</label>
      <input
        id="task"
        type="text"
        value={task}
        onChange={(event) => setTask(event.target.value)}
        placeholder="Type a new task"
        required
      />
      <div className='form_task__btn'>
        <button type="submit">Add</button>
        <button onClick={handleCancel} type="submit">Cancel</button>
      </div>

    </form>
  );
};

export default FormTask;
