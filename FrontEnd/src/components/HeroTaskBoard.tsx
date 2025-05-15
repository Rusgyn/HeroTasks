import { useState, useEffect } from "react";
import axios from "axios";
import { Superhero } from '../types/Superhero';
import '../styles/HeroTaskBoard.scss';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form } from "react-bootstrap";


const HeroTaskBoard = () => {

  const navigate = useNavigate();
  const [superheroes, setSuperheroes] = useState<Superhero[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);

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

  const handleModalClose = () => setModalShow(false);
  const handleModalShow = () => setModalShow(true);

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

  const handleAddTaskNavigation = () => {
    navigate('/add-task'); 
  };

  if (loading) return <div className="loading"> Loading ... </div>;

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
        {/* <button 
          className="board_btn__new_task"
          type='button'
          value="Add Task"
          onClick={handleAddTaskNavigation}>Add Task
        </button> */}

        {/* ======= REACT BOOSTRAP ========== */}

        {/* <Button variant="primary" onClick={handleModalShow}>
          Add Task
        </Button>

        <Modal
          show={modalShow}
          onHide={handleModalClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Task Modal</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Superhero Name: </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="name"
                  autoFocus
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Task</Form.Label>
                <Form.Control as="textarea" rows={2} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleModalClose}>
              Save
            </Button>
          </Modal.Footer>
        </Modal> */}

          {/* <Modal.Body>
            I will not close if you click outside me. Do not even try to press
            escape key.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
            <Button variant="primary">Add</Button>
          </Modal.Footer>
        </Modal> */}


        {/* ======= */}

        <div className="board__hero_grid">
          {superheroes.length === 0 ? (
            <p>No superheroes or tasks found.</p>
          ) : (
            superheroes.map((hero) => (
              <div key={hero.id} className="board__hero_card">
                <h2>{hero.superhero_name}</h2>
                <p><strong>⭐ Strength:</strong> { hero.strength }</p>
                {hero.tasks.length > 0 ? (
                  <ul className="board__task_list">
                    {hero.tasks.map((task) => (
                      <li
                        key={task.id}
                        className={task.completed ? 'task-completed' : ''}
                        onClick={() => handleTaskToggle(hero.id, task.id)}
                      > {task.superpower}
                        {/* <label className="board__checkbox">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleTaskToggle(hero.id, task.id)}
                          />
                         {task.superpower}
                        </label> */}
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
      </div>
    </div>
  );
};

export default HeroTaskBoard;