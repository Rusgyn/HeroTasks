// Load environment variables
import dotenv from "dotenv";
import path from "path";
dotenv.config(
  {
    path: path.resolve(__dirname, '../.env')
  }
); //Above format will ensure that db is loaded before anything and get the correct values.

//Node.js and library
import express, { Request, Response } from "express";
import morgan from "morgan"; // HTTP request logger
import cors from "cors";
import axios from "axios";
import session from "express-session"; //maintain user state
import bcrypt from 'bcryptjs';

//Internal Modules and DB Queries */
import db from './Database/db';
import userQueries from "./Database/queries/usersQueries";
import superheroQueries from "./Database/queries/superheroesQueries";
import taskQueries from "./Database/queries/tasksQueries";

//Type imports
import User from "./types/userTypes";
import { Superhero, NewSuperheroInput } from "./types/superheroTypes";
import { Task, NewTaskInput } from "./types/taskTypes";
import { error } from "console";

/* Express Setup */
const app = express();
const PORT = 3001;

/* Middleware */
//CORS should be added before any other routes or middleware this ensures that the CORS headers are properly set in the response before any other logic 
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(morgan('dev')); // HTTP request logger
app.use(express.json()); // Parse JSON payloads.
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads

/* DB Test - Development */
db.query('SELECT current_database();')
  .then(response => console.log('✅ Connected to DB:', response.rows[0]))
  .catch(error => console.error('❌ Error checking current DB:', error));

  db.query("SELECT * FROM users WHERE email = 'jane.smith@test.com';")
  .then((response) => console.log("DB Test, user table found: ", response.rows))
  .catch((error) => console.error("DT Test, error querying users table:", error));

/* Routes */
app.get('/', (_req, res) => {
  console.log('You reach the HeroTasks backend');
  res.send('Hi, HeroTasks API is running!');
});
app.get('/HeroTasks/Hey', (_req, res) => {
  res.send('Hey, HeroTasks API is running!');
});

/** Session **/
app.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  console.log("Server Side. User login info: ", req.body);
  console.log("=== END ===");

  if (!username || !password) {
    console.log('Server Side. Please fill in your username and password');
    res.status(400).json({ error: 'Please fill in your username and password' });
    return;
  }
  
  console.log('Server. Login button clicked');

  try {
    const isUserExist = await userQueries.getUserByEmail(username);
    console.log("Server side. isUserExit data: ", isUserExist);
    console.log("=== END ===");

    if(!isUserExist) {
      console.log('Server Side. User not found with email: ', username);
      res.status(401).json({ error: 'Invalid credentials!' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, isUserExist.password_digest);

    if (!isPasswordValid) {
      console.log('Password is incorrect for email: ', username);
      res.status(401).json({ error: 'Invalid credentials!' });
      return;
    }

    if (isUserExist && isPasswordValid) {
      const userId = isUserExist.id;
      const userEmail = isUserExist.email;

      if (userId !== undefined) {
        req.session.loggedUser = { id: userId, username: userEmail };
        console.log("Server Side. LoggedUser is: ", req.session.loggedUser);
        res.status(500).json({ message: 'Login successful'})
      } else {
        console.error('server Side. User ID is undefined.');
        res.status(500).json({ error: 'Internal Server error.'});
        return;
      }
    }
  } catch (error) {
    console.log("Server Side. Error when attempting to log in: ", error);
    res.status(500).json({ error: 'Internal Server error' });
  }

  //Check is user exist by username
  //YES = Check the password. NO = send 401. Invalid credential
  // Username & Password = Okay => save session
  // Username/ Password = !Okay => send 401 Invalid credential

  // Add error catch when ID is not present => send 500 Internal server e
});

//Create a logout route
// destroy the session
//clear the cookie
//redirect to Home Page

/* Server Start */
app.listen(PORT, () => {
  console.log(`Thank you for using the App. The Server is running on http://localhost:${PORT}`);
});
