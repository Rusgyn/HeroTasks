import { useState, useEffect } from "react";
import axios from "axios";
import { Superhero } from '../types/Superhero';
import '../styles/HeroTaskBoard.scss';
import { useNavigate } from "react-router-dom";
import Modal from './Modal';
import FormTask from "./FormTask";
import AddSuperheroForm from "./AddSuperheroForm";
import DeleteSuperheroForm from "./DeleteSuperheroForm";
import ConfirmWithCode from "./ConfirmWithCode";

const HeroTaskBoard = () => {

  const navigate = useNavigate();
  const [superheroes, setSuperheroes] = useState<Superhero[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalPurpose, setModalPurpose] = useState<'confirm-code' | 'add-task' | 'delete-confirm' | 'add-superhero' | 'del-superhero' | null>(null);
  const [activeHeroId, setActiveHeroId] = useState<number | null>(null);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [codePromptLabel, setCodePromptLabel] = useState('');

  useEffect(() => {
    const fetchHeroesData = async() => {
      try {
        const response = await axios.get('/HeroTasks/superheroes-with-tasks');
        console.log("Hero DashBoard. The Superheroes Data: ", response);
        setSuperheroes(response.data);
      } catch (error) {
        console.error("Hero Dashboard. Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroesData();
  }, []);

  const handleTaskToggle = async (heroId: number, taskId: number) => {
    try {
      // Optimistically toggle the task's completed state in local state
      setSuperheroes((prevHeroes) =>
        prevHeroes.map((hero) => {
          if (hero.id !== heroId) return hero;

          const updatedTasks = hero.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          );

          // Sort tasks: incomplete first, completed last
          const sortedTasks = [
            ...updatedTasks.filter((taskList) => !taskList.completed),
            ...updatedTasks.filter((taskList) => taskList.completed),
          ];

          return { ...hero, tasks: sortedTasks };
        })
      );

      // Sync with backend. Send PUT request to update task status on server
      await axios.put(`/HeroTasks/tasks/${taskId}/toggle`);

      // Re-fetch the full data of the hero.
      const updatedHero = await axios.get(`/HeroTasks/superheroes/${heroId}`);

      // Re-apply sorted tasks to updatedHero before setting in state
      const sortedTasks = [
        ...updatedHero.data.tasks.filter((t: any) => !t.completed),
        ...updatedHero.data.tasks.filter((t: any) => t.completed),
      ];

      const sortedHero = { ...updatedHero.data, tasks: sortedTasks };

      setSuperheroes((prevHeroes) =>
        prevHeroes.map((hero) => (hero.id === heroId ? sortedHero : hero))
      );
    } catch (error) {
      console.error("Dashboard. Failed to toggle task completion:", error);
    }
  };

  // Updated to open 'confirm-code' modal first, then run action and open real modal
  const requestCodeConfirmation = (
      label: string,
      action: () => void,
      nextModal: Exclude<typeof modalPurpose, 'confirm-code'> | null
    ) => {
      setCodePromptLabel(label);
      setPendingAction(() => () => {
        if (nextModal !== null) setModalPurpose(nextModal);
        action();
      });
      setModalPurpose('confirm-code');
    };

  const handleLogoutNavigation = () => {
    requestCodeConfirmation("Enter your 4-digit code to logout.", async () => {
      try {
        console.log("Dashboard. Sending Logout Request");
        const response = await axios.post('/HeroTasks/logout', {}, { withCredentials: true });
        // {} the request body, which is empty in this case. Without "withCredentials: true", the browser will not include cookies, and the backend won’t recognize the session.
        
        if (response.status === 200) navigate('/');

      } catch (error) {
        console.error('Error logging out: ', error);
      }
    },
      null // No next modal after logout
    );
  };

  //Find the active hero object
  const activeHero = superheroes.find(hero => hero.id === activeHeroId);

  //Add new task
  const handleAddTask = async (heroId: number, task: { superpower: string }) => {
    console.log(`HeroTaskBoard. The heroId is "${heroId}", and the new task is "${task.superpower}". ==== END`);

    try {
      await axios.post(`/HeroTasks/superheroes/${heroId}/add-task`, task);

      //Get the updated list of tasks as per superhero
      const updatedHero = await axios.get(`/HeroTasks/superheroes/${heroId}`);

      setSuperheroes((prevHeroes) =>
        prevHeroes.map((hero) => (hero.id === heroId ? updatedHero.data : hero))
      );

    } catch (error) {
      console.error("HeroTaskBoard. Error Adding Task: ", error);
    }
  };

  //Delete Superhero Task.Delete a single task and update only the affected superhero's tasks
  const handleDeleteTask = async (taskId: number) => {
    requestCodeConfirmation("Enter your 4-digit code to delete this task.",
      async () => {
        try {
          // Identify which hero owns this task
          const heroId = superheroes.find((hero) =>
            hero.tasks.some((task) => task.id === taskId)
          )?.id;

          if (!heroId) {
            console.error("HeroTaskBoard. Could not find hero for this task.");
            return;
          }

          // Delete the task
          await axios.delete(`/HeroTasks/tasks/${taskId}`);

          // Fetch updated data for this specific hero
          const updatedHero = await axios.get(`/HeroTasks/superheroes/${heroId}`);

          // Sort: incomplete tasks first
          const sortedTasks = [
            ...updatedHero.data.tasks.filter((t: any) => !t.completed),
            ...updatedHero.data.tasks.filter((t: any) => t.completed),
          ];

          const sortedHero = { ...updatedHero.data, tasks: sortedTasks };

          // Replace only the updated hero in state
          setSuperheroes((prevHeroes) =>
            prevHeroes.map((hero) => (hero.id === heroId ? sortedHero : hero))
          );

          //Clean up modal state to close ConfirmWithCode.
          setPendingAction(null);
          setModalPurpose(null);
          setActiveHeroId(null);

        } catch (error) {
          console.error("HeroTaskBoard. Error Deleting Task: ", error);
        }
      },
      null // No additional modal after
    );
  };

  //Delete Superhero All Tasks
  const handleDeleteAllTask = async (heroId: number) => {

    try {
      await axios.delete(`/HeroTasks/superheroes/${heroId}/delete-all-tasks`);

      // Fetch updated data for this specific hero
      const updatedHero = await axios.get(`/HeroTasks/superheroes/${heroId}`);
      console.log(" The updatedHero data is : => ", updatedHero.data.task)

      const sortedHero = { ...updatedHero.data };

      // Replace only the updated hero in state
      setSuperheroes((prevHeroes) =>
        prevHeroes.map((hero) => (hero.id === heroId ? sortedHero : hero))
      );
    } catch (error) {
      console.error("HeroTaskBoard. Error Deleting All Tasks: ", error);
    }
  };

  //Add New Superhero
  const handleAddSuperhero = async (superhero: { superhero_name: string }) => {
    console.log("handleAddSuperhero is clicked. Sending to backend ....", superhero);
    try {
      await axios.post('/HeroTasks/superheroes', superhero);
      const updatedHeroes = await axios.get('/HeroTasks/superheroes-with-tasks');
      setSuperheroes(updatedHeroes.data);
      setErrorMessage('');
      return true;
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
      return false;
    }
  };

  const handleDelSuperhero = async (heroId: number) => {
    try {
      await axios.delete(`/HeroTasks/superheroes/${heroId}`);
      const updatedTasks = await axios.get('/HeroTasks/superheroes-with-tasks');
      setSuperheroes(updatedTasks.data);
      return true;
    } catch (error) {
      console.error("HeroTaskBoard. Error Deleting Superhero: ", error);
      return false;
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="board_page">
      <div className="board">
        <div className="top_nav">
          <p className="top_naw__logo">HeroTasks</p>
          <div className="board_btn">
            <button
              className="board_btn__add_superhero"
              type="button"
              onClick={() =>
                requestCodeConfirmation(
                  "Enter your 4-digit code to enlist a new superhero.",
                  () => {},
                  'add-superhero'
                )
              }
            >
              Add Superhero
            </button>
            <button
              className="board_btn__del_superhero"
              type="button"
              onClick={() =>
                requestCodeConfirmation(
                  "Enter your 4-digit code to eliminate a superhero.",
                  () => {},
                  'del-superhero'
                )
              }
            >
              Eliminate Superhero
            </button>

            <button className="board_btn__logout" type="button" onClick={handleLogoutNavigation}>
              LOG ME OUT 🦸‍♀️ 🦸
            </button>
          </div>
        </div>

        <div className="board__hero_grid">
          {superheroes.length === 0 ? (
            <p>No superheroes or tasks found.</p>
          ) : (
            superheroes.map((hero) => (

              <div key={hero.id} className="board__hero_card">
                <h2>✨ {hero.superhero_name}</h2>
                <p><strong>⭐ Strength:</strong> {hero.strength} ⭐</p>

                {hero.tasks.length > 0 ? (
                  <ul className="board__task_list">
                    {hero.tasks.map((task) => (
                      <li
                        key={task.id}
                        className={`board__task_item ${task.completed ? 'task-completed' : ''}`}
                      >
                        <span onClick={() => handleTaskToggle(hero.id, task.id)}>
                          {task.superpower}
                        </span>

                        <button
                          className="task_delete_btn"
                          onClick={() => handleDeleteTask(task.id)}
                          title="Delete task"
                        >
                          ⓧ
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="board__no_task">No tasks assigned.</p>
                )}

                <div className="task_add_delete_btn">
                  <button
                    className="task_add_btn"
                    onClick={() =>
                      requestCodeConfirmation(
                        "Enter your 4-digit code to add a task for this superhero.",
                        () => {
                          setActiveHeroId(hero.id);
                          setModalPurpose('add-task');
                        },
                        'add-task'
                      )
                    }
                  >
                    ➕ Add Task
                  </button>
                  <button
                    className="task_del_all_task_btn"
                    disabled={hero.tasks.length === 0}
                    onClick={() =>
                      requestCodeConfirmation(
                        "Enter your 4-digit code to delete all tasks for this superhero.",
                        async () => {
                          await handleDeleteAllTask(hero.id);
                          setModalPurpose(null);
                          setActiveHeroId(null);
                        },
                        null
                      )
                    }
                  >
                    ➖ Del All Tasks
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Like a footer */}



          {/* == */}


        </div>

                          <div className="board__footer">
          <span className="session_footer_a">
            <a className="session_footer_a_1" href="/register" target="_blank">New Account</a> |
            {/* <a className="session_footer_a_2" href="/login"> login </a> |  */}
            <a className="session_footer_a_2" href="/help" target="_blank"> Contact Us </a> | 
            <a className="session_footer_a_1" href="https://facebook.com" target="_blank"> Facebook </a> | 
            <a className="session_footer_a_2" href="https://google.com" target="_blank"> Google</a>
          </span>
        </div>

        {/* ===== MODAL HERE ===== */}

        {modalPurpose && (
          <Modal
            show={true}
            onClose={() => {
              setActiveHeroId(null);
              setModalPurpose(null);
              setPendingAction(null);
            }}
          >
            <Modal.Header>
              <Modal.Title>
                {{
                  'confirm-code': codePromptLabel,
                  'add-task': `Add Task for Superhero "${activeHero?.superhero_name}"`,
                  'delete-confirm': `Delete All Tasks for "${activeHero?.superhero_name}"`,
                  'add-superhero': 'Add New Superhero',
                  'del-superhero': 'Eliminate Superhero',
                }[modalPurpose]}
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              {modalPurpose === 'confirm-code' ? (
                <ConfirmWithCode
                  actionLabel={codePromptLabel}
                  onSuccess={() => {
                    if (pendingAction) pendingAction();
                    setPendingAction(null);
                  }}
                  
                  // onCancel={() => {
                  //   setModalPurpose(null);
                  //   setPendingAction(null);
                  // }}
                />
              ) : modalPurpose === 'add-task' && activeHero ? (
                <FormTask
                  onSubmit={async (task) => {
                    await handleAddTask(activeHero.id, task);
                    //NOTE: Disable below to ensure we can continue adding more task without re-confirming
                    // setModalPurpose(null);
                    // setActiveHeroId(null);
                  }}
                />
              ) : modalPurpose === 'delete-confirm' && activeHero ? (
                <p>Click the 'Delete' if you wish to proceed.</p>
              ) : modalPurpose === 'add-superhero' ? (
                <AddSuperheroForm
                  onSubmit={async (superhero) => {
                    const success = await handleAddSuperhero(superhero);
                    if (success) setModalPurpose(null);
                  }}
                  errorMessage={errorMessage}
                />
              ) : modalPurpose === 'del-superhero' ? (
                <DeleteSuperheroForm
                  key={modalPurpose}
                  refresh={modalPurpose} //re-run the useEffect
                  onSubmit={async (heroId) => {
                    const success = await handleDelSuperhero(heroId);
                    if (success) setModalPurpose(null);
                    }
                  }
                  errorMessage={errorMessage}
                />
              ) : null}
            </Modal.Body>

            <Modal.Footer>
              <button
                onClick={() => {
                  setActiveHeroId(null);
                  setModalPurpose(null);
                  setPendingAction(null);
                }}
              >
                Close
              </button>

              {modalPurpose === 'delete-confirm' && activeHero && (
                <button
                  onClick={async () => {
                    await handleDeleteAllTask(activeHero.id);
                    setModalPurpose(null);
                    setActiveHeroId(null);
                  }}
                >
                  Delete
                </button>
              )}
            </Modal.Footer>
          </Modal>
        )}

      </div>
    </div>
  );
};

export default HeroTaskBoard;
