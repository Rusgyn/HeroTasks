import { useState, useEffect } from "react";
import axios from "axios";
import { Superhero } from '../types/Superhero';
import '../styles/HeroTaskBoard.scss';


const HeroTaskBoard = () => {

  const [superheroes, setSuperheroes] = useState<Superhero[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="loading"> Loading ... </div>;

  return (
    <div className="board_page">
      <div className="board">
        <h1>Hero Task Board</h1>
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
                      >
                        <label>
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleTaskToggle(hero.id, task.id)}
                          />
                          {task.superpower}
                        </label>
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