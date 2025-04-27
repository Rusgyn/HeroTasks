import db from '../db';
import Superhero from '../../types/superheroTypes';
import NewSuperheroInput from '../../types/newSuperheroTypes';

// Get all superheroes
const getAllSuperheroes = async() : Promise<Superhero[]> => {
  try {
    const result = await db.query('SELECT * FROM superheroes;');
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

export default {
  getAllSuperheroes,
  deleteSuperhero,
  addSuperhero,
  updateSuperheroProfile
};