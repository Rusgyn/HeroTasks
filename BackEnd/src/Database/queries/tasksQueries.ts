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

// const updateTaskCompleted = async (taskId: number) : Promise<Task> => {
//   try {
//     const result = await db.query(
//       `UPDATE tasks
//         SET completed = TRUE
//         updated_at = CURRENT TIMESTAMP
//         WHERE id = $1 RETURNING *;`, [taskId]);

//     if (result.rows[0].length === 0) {
//       throw new Error(`Task with id ${taskId} not found.`);
//     };

//     return result.rows[0] as Task;

//   } catch (error) {
//     console.error('Queries. Error updating task completion: ', error);
//     throw error;
//   }
// };

// Get task by ID
const getTaskById = async (id: number): Promise<Task | null> => {
  const result = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
  return result.rows[0] || null;
};

// Update task completion
// const updateTaskCompletion = async (id: number, completed: boolean): Promise<Task> => {
//   const result = await db.query(
//     'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *',
//     [completed, id]
//   );
//   return result.rows[0];
// };

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

//   // 1. Update the task's completion status
//   const updatedTaskRes = await db.query(
//     'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *',
//     [completed, taskId]
//   );
//   const updatedTask = updatedTaskRes.rows[0];

//   // 2. Get superhero_name of the task
//   const superheroName = updatedTask.superhero_name;

//   // 3. Fetch all tasks for this superhero (to recalculate strength)
//   const tasksRes = await db.query(
//     'SELECT * FROM tasks WHERE superhero_name = $1',
//     [superheroName]
//   );
//   const allTasks = tasksRes.rows;

//   // 4. Count completed tasks
//   const completedCount = allTasks.filter(task => task.completed).length;

//   // 5. Compute strength as a fraction (e.g. 0.6 for 3/5), rounded to 2 decimal places
//   const strength = allTasks.length > 0 ? parseFloat((completedCount / allTasks.length).toFixed(2)) : 0;

//   // 6. Update the strength in superheroes table
//   await db.query(
//     'UPDATE superheroes SET strength = $1 WHERE superhero_name = $2',
//     [strength, superheroName]
//   );

//   return updatedTask;
// };


export default {
  getAllTasks,
  getAllTasksBySuperhero,
  addTaskBySuperhero,
  getTaskById,
  updateTaskCompletion
}