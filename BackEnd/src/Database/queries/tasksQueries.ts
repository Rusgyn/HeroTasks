import db from '../db';
import Task from '../../types/taskTypes';

const getAllTasks = async() : Promise<Task[]> => {
  try{
    const result = await db.query('SELECT * FROM tasks;');
    return result.rows as Task[];
  } catch(error) {
    console.error('Queries. Error fetching tasks: ', error);
    throw error;
  }
};

const getTaskByHero = async(hero: string): Promise<Task | undefined> => {
  try {
    const result = await db.query('SELECT * FROM tasks WHERE hero_name = $1;', [hero.toLowerCase()]);

    if (result.rows.length === 0) {
      console.error(`Queries. Hero ${hero} is not in our galaxy.`);
      return undefined;
    } 
    
    return result.rows[0] as Task;
    
  } catch (error) {
    console.error('Queries. Error fetching our list of task by our hero: ', error);
    throw error;
  }
};

// const addTaskByHero = async(task: string) : Promise<Task> => {
//   try {
//     const result = await db.query('INSERT INTO tasks () VALUES ($1, $2) RETURNING *;', []);
//   }
// }
