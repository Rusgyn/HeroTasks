import { useState, useEffect } from "react";
import axios from "axios";
import { Superhero } from '../types/Superhero';
import '../styles/HeroTaskBoard.scss';
import { useNavigate } from "react-router-dom";
import Modal from './Modal';
import FormTask from "./FormTask";


const HeroTaskBoard = () => {

  const navigate = useNavigate();
  const [superheroes, setSuperheroes] = useState<Superhero[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalPurpose, setModalPurpose] = useState<'add-task' | 'delete-confirm' | null>(null);
  const [activeHeroId, setActiveHeroId] = useState<number | null>(null);

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
    }

    fetchHeroesData();
  }, []);

  const handleTaskToggle = async (heroId: number, taskId: number) => {
    try {
      setSuperheroes((prevHeroes) =>
        prevHeroes.map((hero) =>
          hero.id === heroId
            ? {
                ...hero,
                tasks: hero.tasks.map((task) =>
                  task.id === taskId
                    ? { ...task, completed: !task.completed }
                    : task
                ),
              }
            : hero
        )
      );
  
      // Send PUT request to update task status on server
      await axios.put(`/HeroTasks/tasks/${taskId}/toggle`);
      //To update heroes details after successful toggle. Send req to backend.
      const updatedHero = await axios.get(`/HeroTasks/superheroes/${heroId}`);

      //This update the affected hero in state.
      setSuperheroes((prevHeroes) => 
        prevHeroes.map((hero) => hero.id === heroId ? updatedHero.data : hero)
      )

    } catch (error) {
      console.error("Dashboard. Failed to toggle task completion:", error);
    }
  };

  const handleLogoutNavigation = async () => {
    try {
      console.log("Dashboard. Sending Logout Request");
      const response = await axios.post('/HeroTasks/logout', {}, {withCredentials: true});
      // {} the request body, which is empty in this case. Without "withCredentials: true", the browser will not include cookies, and the backend won’t recognize the session.

      console.log("Dashboard. Logout response: ", response);

      if (response.status === 200) {
        navigate('/')
      }

    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  if (loading) return <div className="loading"> Loading ... </div>;

  // Find the active hero object
  const activeHero = superheroes.find(hero => hero.id === activeHeroId);
  console.log("HeroTaskBoard. The activeHero is: => ", activeHero);

  //Add new task
  const handleAddTask = async (heroId: number, task: { superpower: string }) => {
    console.log(`HeroTaskBoard. The heroId is "${heroId}", and the new task is "${task.superpower}". ==== END`);

    try {
      const response = await axios.post(`/HeroTasks/superheroes/${heroId}/add-task`, task);

      const newTask = response.data;
      console.log("HeroTaskBoard. The newTask is: ", newTask);

      //Get the updated list of tasks as per superhero
      const updatedHero = await axios.get(`/HeroTasks/superheroes/${heroId}`);

      setSuperheroes((prevHeroes) => 
        prevHeroes.map((hero) => hero.id === heroId ? updatedHero.data : hero)
      );

    } catch (error) {
      console.error("HeroTaskBoard. Error Adding Task: ", error);
    }

  };

  //Delete Superhero Task
  const handleDeleteTask = async (taskId: number) => {
    console.log("HeroTaskBoard. the taskId is: ", taskId);
    try {
      const response = await axios.delete(`/HeroTasks/tasks/${taskId}`);
      console.log("Delete Task: ", response.data);

      const updatedTasks = await axios.get('/HeroTasks/superheroes-with-tasks');
      console.log("Hero DashBoard. The Superheroes Data: ", updatedTasks);
      setSuperheroes(updatedTasks.data);

    } catch (error) {
      console.error("HeroTaskBoard. Error Deleting Task Task: ", error);
    }
  };

  //Delete Superhero All Tasks
  const handleDeleteAllTask = async (heroId: number) => {
    
    try {
      const response = await axios.delete(`/HeroTasks/superheroes/${heroId}/delete-all-tasks`);
      console.log("Delete All Task: ", response.data)

      const updatedTasks = await axios.get('/HeroTasks/superheroes-with-tasks');
      console.log("Hero DashBoard. The Superheroes Data: ", updatedTasks);
      setSuperheroes(updatedTasks.data);

    } catch (error) {
      console.error("HeroTaskBoard. Error Deleting Task: ", error);
    }
  }

  return (
    <div className="board_page">
      <div className="board">
        <h1>Hero Task Board</h1>
        <button 
          className="board_btn__logout"
          type='button'
          value="logout"
          onClick={handleLogoutNavigation}>Logout
        </button>
        
        <div className="board__hero_grid">
          {superheroes.length === 0 ? (
            <p>No superheroes or tasks found.</p>
          ) : (
            superheroes.map((hero) => (
              
              <div key={hero.id} className="board__hero_card">
                <h2>{hero.superhero_name}</h2>
                <p><strong>⭐ Strength:</strong> { hero.strength }</p>

                <div className="task_add_delete_btn">
                  <button 
                  className="task_add_btn" 
                  onClick={() => {
                    setActiveHeroId(hero.id);
                    setModalPurpose('add-task');
                  }}>
                    ➕ Add Task
                  </button>
                  <button 
                  className="task_del_all_task_btn"
                  onClick={() => {
                    setActiveHeroId(hero.id);
                    setModalPurpose('delete-confirm');
                  }}>
                    ➖ Del All Tasks
                  </button>
                </div>

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
              </div>
            ))
          )}
        </div>

        {/* ===== MODAL HERE. Render one modal inside the loop ===== */}

        {activeHero && modalPurpose && (
          <Modal show={true} onClose={() => {
            setActiveHeroId(null);
            setModalPurpose(null);
          }}>
            <Modal.Header>
              <Modal.Title>
                {modalPurpose === 'add-task'
                  ? `Add Task for Superhero "${activeHero.superhero_name}"`
                  : `Delete All Tasks for "${activeHero.superhero_name}"`}
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              {modalPurpose === 'add-task' ? (
                <FormTask
                  onSubmit={async (task) => {
                    console.log('New Task for', activeHero.superhero_name, ':', task);
                    if (!activeHero) return;
                    await handleAddTask(activeHero.id, task);
                    setActiveHeroId(null);  //This will close the modal after the task is added

                    setModalPurpose(null);
                  }}
                />
              ) : (
                <p>{`Click the 'Delete' if you wish to proceed.`}</p>
              )}
            </Modal.Body>

            <Modal.Footer>
              <button onClick={() => {
                setActiveHeroId(null);
                setModalPurpose(null);
              }}>Close</button>

              {modalPurpose === 'delete-confirm' && (
                <button 
                onClick={async () => {
                  if (!activeHero) return;
                  await handleDeleteAllTask(activeHero.id);
                  setActiveHeroId(null);
                  setModalPurpose(null);
                }}>
                  Delete
                </button>
              )}
            </Modal.Footer>
          </Modal>
        )}

        {/* ================================ */}
      </div>
    </div>
  );
};

export default HeroTaskBoard;