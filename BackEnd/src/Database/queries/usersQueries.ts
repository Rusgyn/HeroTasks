import db from '../db';
import bcrypt from 'bcryptjs';
import User from '../../types/userTypes';

// Get user
const getAllUsers = async(): Promise<User[]> => {
  try {
    const result = await db.query('SELECT * FROM users;');
    return result.rows as User[];
  } catch (error) {
    console.error('Queries. Error fetching users: ', error);
    throw error;
  }
};

const getUserByEmail = async(email: string): Promise<User> => {
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1;', [email.toLowerCase()]);
    return result.rows[0] as User;
  } catch (error) {
    console.error('Queries. Error fetching user by email/username: ', error);
    throw error;
  }
};

const addUser = async (user: User): Promise<User> => {
  try {
    const hashedPassword = await bcrypt.hash(user.password_digest, 10);
    const queryString = 'INSERT INTO users (first_name, last_name, email, password_digest, code) VALUES ($1, $2, $3, $4, $5) RETURNING *;';

    const result = await db.query(queryString, [user.first_name, user.last_name, user.email.toLowerCase(), hashedPassword, user.code]);
    return result.rows[0] as User;
  } catch (error) {
    console.error('Queries. Error adding new user: ', error);
    throw error;
  }
};

const updateUserProfile = async(user: User) : Promise<User> => {
  try {
    const queryString = 'UPDATE users SET first_name = $1, last_name = $2, email = $3, code = $4 WHERE id = $5 RETURNING *;';

    const result = await db.query(queryString, [user.first_name, user.last_name, user.email.toLowerCase(), user.code, user.id]);
    return result.rows[0] as User;
  } catch (error) {
    console.error('Queries. Error updating user profile: ', error);
    throw error;
  }
};

const updateUserPassword = async(user: User) : Promise<User> => {
  try {
    const hashedPassword = await bcrypt.hash(user.password_digest, 10);
    const queryString = 'UPDATE users SET password_digest = $1 WHERE id = $2 RETURNING *;';

    const result = await db.query(queryString, [hashedPassword, user.id]);
    return result.rows[0] as User;
  } catch(error) {
    console.error('Queries. Error updating password: ', error);
    throw error;
  }
};

// Verify if code matches the user ID
const verifyUserCode = async (userId: number, code: string): Promise<boolean> => {
  try {
    const result = await db.query(
      'SELECT id FROM users WHERE id = $1 AND TRIM(code) = $2 LIMIT 1;',
      [userId, code.trim()]
    );
    return result.rows.length > 0;
  } catch (error) {
    console.error('Queries. Error verifying user code: ', error);
    throw error;
  }
};


export default {
  getAllUsers,
  getUserByEmail,
  addUser,
  updateUserProfile,
  updateUserPassword,
  verifyUserCode
};