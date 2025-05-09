import db from '../db';
import { Task } from '../../types/taskTypes';
import { NewTaskInput } from '../../types/taskTypes';

const getAllTasks = async() : Promise<Task[]> => {
  try{
    const result = await db.query('SELECT * FROM tasks;');
    return result.rows as Task[];
  } catch(error) {
    console.error('Queries. Error fetching tasks: ', error);
    throw error;
  }
};

const getAllTasksBySuperhero = async (superhero: string): Promise<Task[]> => {
  try {
    const query = `
      SELECT tasks.*
      FROM tasks
      INNER JOIN superheroes ON tasks.superhero_id = superheroes.id
      WHERE superheroes.superhero_name = $1;
    `;

    const result = await db.query(query, [superhero]);

    if (result.rows.length === 0) {
      console.error(`Queries. Hero ${superhero} is not in our galaxy.`);
      return [];
    }

    return result.rows as Task[];

  } catch (error) {
    console.error('Queries. Error fetching our list of tasks by our hero: ', error);
    throw error;
  }
};


const addTaskBySuperhero = async (taskInput: NewTaskInput): Promise<Task> => {
  try {
    const { superhero_name, superpower } = taskInput;
    //Find the superhero id as per superhero name
    const heroIdResult = await db.query('SELECT id FROM superheroes WHERE superhero_name = $1;', [superhero_name.toLowerCase()]);

    if (heroIdResult.rows.length === 0) {
      throw new Error (`Superhero with name "${superhero_name}" not found.`);
    };

    const superhero_id = heroIdResult.rows[0].id;

    //Insert the new task linked to the superhero id.
    const taskResult = await db.query(
      `INSERT INTO tasks (superpower, superhero_id)
       VALUES ($1, $2)
       RETURNING *;`, [superpower, superhero_id]
    );

    return taskResult.rows[0] as Task;

  } catch (error) {
    console.error('Queries. Error adding a new task for superhero: ', error);
    throw error;
  }
};

const updateTaskCompleted = async (taskId: number) : Promise<Task> => {
  try {
    const result = await db.query(
      `UPDATE tasks
        SET completed = TRUE
        updated_at = CURRENT TIMESTAMP
        WHERE id = $1 RETURNING *;`, [taskId]);

    if (result.rows[0].length === 0) {
      throw new Error(`Task with id ${taskId} not found.`);
    };

    return result.rows[0] as Task;

  } catch (error) {
    console.error('Queries. Error updating task completion: ', error);
    throw error;
  }
};

export default {
  getAllTasks,
  getAllTasksBySuperhero,
  addTaskBySuperhero,
  updateTaskCompleted
}