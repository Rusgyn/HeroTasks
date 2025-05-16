import db from '../db';
import { Superhero } from '../../types/superheroTypes';
import { NewSuperheroInput } from '../../types/superheroTypes';

// Get all superheroes from database

const getAllSuperheroes = async() : Promise<Superhero[]> => {
  try {
    const result = await db.query('SELECT * FROM superheroes;');
    return result.rows as Superhero[];
  } catch (error) {
    console.error('Queries. Error fetching superheroes: ', error);
    throw error;
  }
};

// Get all superheroes by logged in user (in session)
const getAllSuperheroesByLoggedUser = async(userId: number) : Promise<Superhero[]> => {
  try {
    const result = await db.query('SELECT * FROM superheroes WHERE user_id = $1;', [userId]);
    return result.rows as Superhero[];
  } catch (error) {
    console.error('Queries. Error fetching superheroes: ', error);
    throw error;
  }
};

// Get Superhero name
const getSuperheroName = async(userId: number) : Promise<Superhero[]> => {
  try {
    const result = await db.query('SELECT * FROM superheroes WHERE user_id = $1;', [userId] );
    return result.rows as Superhero[];
  } catch (error) {
    console.error('Queries. Error fetching superheroes: ', error);
    throw error;
  }
};

// Delete superhero
const deleteSuperhero = async(superheroName: string) : Promise<Superhero> => {
  try {
    const result = await db.query(`DELETE FROM superheroes WHERE superhero_name = $1 RETURNING *;`, [superheroName.toLowerCase()]);

    if (result.rows.length === 0) {
      throw new Error(`Superhero named "${superheroName}" not found.`);
    }

    return result.rows[0] as Superhero;

  } catch (error) {
    console.error('Queries. Error deleting superhero:', error);
    throw error;
  }
};

// Add new superhero
const addSuperhero = async (superheroInput: NewSuperheroInput, session: any): Promise<Superhero | undefined> => {
  try {
    const { superhero_name } = superheroInput;
    const user_id = session.user.id;

    const result = await db.query(
      `INSERT INTO superheroes (superhero_name, user_id)
       VALUES ($1, $2)
       RETURNING *;`, [superhero_name.toLowerCase(), user_id]
    );

    return result.rows[0] as Superhero;

  } catch (error) {
    console.error('Queries. Error adding a new superhero: ', error);
    throw error;
  }
};

// Update superhero
const updateSuperheroProfile = async (superhero: Superhero): Promise<Superhero> => {
  try {
    const { superhero_name } = superhero;

    // Find the superhero id
    const superheroIdResult = await db.query(
      'SELECT id FROM superheroes WHERE superhero_name = $1;',
      [superhero_name.toLowerCase()]
    );

    if (superheroIdResult.rows.length === 0) {
      throw new Error(`Superhero with name "${superhero_name}" not found.`);
    }

    const superhero_id = superheroIdResult.rows[0].id;

    // Update the profile
    const result = await db.query(
      `UPDATE superheroes
       SET superhero_name = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *;`,
      [superhero_name.toLowerCase(), superhero_id]
    );

    return result.rows[0] as Superhero;

  } catch (error) {
    console.error('Queries. Error updating superhero profile: ', error);
    throw error;
  }
};

// Get the task and strength.
const getSuperheroWithTasksAndStrength = async (heroId: number): Promise<Superhero> => {

  //Accept superhero's ID
  //Looks up the superhero profile (superheroes db table)
  //Also looks up their list of tasks
  //Combine the hero data and its tasks into one object
  // Return to FE to display the strength and tasks together in real time.
  try {
    // Fetch superhero basic info
    const heroResult = await db.query(
      `SELECT id, superhero_name, strength, user_id, created_at, updated_at
       FROM superheroes
       WHERE id = $1;`,
      [heroId]
    );

    if (heroResult.rows.length === 0) {
      throw new Error(`Superhero with ID ${heroId} not found.`);
    }

    const hero = heroResult.rows[0];

    // Fetch tasks for this superhero
    const tasksResult = await db.query(
      `SELECT id, superpower, completed, created_at, updated_at
       FROM tasks
       WHERE superhero_id = $1;`,
      [heroId]
    );

    // Return hero with tasks. Combine superhero data, tasks, then return it.
    return {
      ...hero,
      tasks: tasksResult.rows //adds new property tasks to hero (superheroes db prop)
    } as Superhero;

  } catch (error) {
    console.error("Queries. Error fetching superhero with tasks and strength:", error);
    throw error;
  }
};

export default {
  getAllSuperheroes,
  getAllSuperheroesByLoggedUser,
  getSuperheroName,
  deleteSuperhero,
  addSuperhero,
  updateSuperheroProfile,
  getSuperheroWithTasksAndStrength
};