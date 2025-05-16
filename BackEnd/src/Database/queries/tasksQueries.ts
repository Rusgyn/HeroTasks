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

const addTaskBySuperhero = async (taskInput: Task): Promise<Task[]> => {
  try {
    const { superhero_id, superpower } = taskInput;

    //Insert the new task
    const taskResult = await db.query(
      `INSERT INTO tasks (superpower, superhero_id)
       VALUES ($1, $2)
       RETURNING *;`, [superpower, superhero_id]
    );

    //Get all tasks
    const allTasks = await db.query(
      `SELECT * FROM tasks WHERE superhero_id = $1 ORDER BY created_at ASC;`,
      [superhero_id]
    );

    return allTasks.rows as Task[];

  } catch (error) {
    console.error('Queries. Error adding a new task for superhero: ', error);
    throw error;
  }
};

// Get task by ID
const getTaskById = async (id: number): Promise<Task | null> => {
  const result = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
  return result.rows[0] || null;
};

const updateTaskCompletion = async (taskId: number, completed: boolean): Promise<void> => { 
  // 1. Toggle completion
  await db.query('UPDATE tasks SET completed = $1 WHERE id = $2', [completed, taskId]);

  // 2. Get superhero_id of the updated task
  const task = await db.query('SELECT superhero_id FROM tasks WHERE id = $1', [taskId]);
  const superheroId = task.rows[0].superhero_id;

  // 3. Get total tasks for the superhero
  const totalTasksRes = await db.query(
    'SELECT COUNT(*) FROM tasks WHERE superhero_id = $1',
    [superheroId]
  );
  const totalTasks = parseInt(totalTasksRes.rows[0].count, 10);

  // 4. Get completed tasks for the superhero
  const completedTasksRes = await db.query(
    'SELECT COUNT(*) FROM tasks WHERE superhero_id = $1 AND completed = TRUE',
    [superheroId]
  );
  const completedTasks = parseInt(completedTasksRes.rows[0].count, 10);

  // 5. Calculate strength
  const strength = totalTasks > 0 ? completedTasks / totalTasks : 0;

  // 6. Update superhero's strength
  await db.query(
    'UPDATE superheroes SET strength = $1 WHERE id = $2',
    [strength, superheroId]
  );

  console.log(`Task Query. Updated superhero ${superheroId} strength to ${strength}`);
};

const deleteTaskById = async (task: Task) : Promise< { message: string }> => {

  try {
    const queryString = 'DELETE FROM tasks WHERE id = $1;';
    const values = [task.id];

    const result = await db.query(queryString, values);

    if (result.rowCount === 0) {
      return { message: `No task with ID# ${task.id} in the tasks db.` };
    }

    return { message: `Task with ID# ${task.id} deleted successfully.`};

  } catch(error) {
    console.error('Error deleting the task. Error - ', error);
    throw error;
  }
};

const deleteAllTasksByHero = async (task: Task): Promise<{message: string}> => {

  try {
    const result = await db.query('DELETE * FROM tasks WHERE superhero_id = $1 RETURN *;', [task.superhero_id])
    
    if (result.rowCount === 0) {
      return { message: `No task with ID# ${task.superhero_id} in the tasks db.` };
    }

    return { message: `All tasks were deleted successfully.`};
  } catch(error) {
    console.error('Error deleting the tasks. Error - ', error);
    throw error;
  }
};

const deleteAllTasks = async(): Promise<{message: string}> => {

  try {
    const result = await db.query('TRUNCATE TABLE tasks RESTART IDENTITY;')
    return { message: `Tasks cleared successfully` };
  } catch(error) {
    console.error('Error deleting the tasks. Error - ', error);
    throw error;
  }
};

export default {
  getAllTasks,
  getAllTasksBySuperhero,
  addTaskBySuperhero,
  getTaskById,
  updateTaskCompletion,
  deleteTaskById,
  deleteAllTasksByHero,
  deleteAllTasks
}