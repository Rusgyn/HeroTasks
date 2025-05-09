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
import session from "express-session"; //maintain user state
import morgan from "morgan"; // HTTP request logger
import cors from "cors";
import axios from "axios";
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

/* Session Configuration */ 
//**Always place express-session after express.json() and express.urlencoded() middleware for session handling to work properly.
const sessionSecret = process.env.DB_SESSION_SECRET
if (sessionSecret) {
  app.use(
    session({
      secret: sessionSecret as string,
      resave: false, //avoid saving session if not modified
      saveUninitialized: false, //prevent creating session until stored
      cookie: {
        httpOnly: true, //prevent client-side scripts from accessing the cookie
        secure: false, //update to true during production, https
        maxAge: 1000 * 60 * 60, // 1hr session
      }
    })
  )
} else {
  console.log("Server side. DB_SESSION_SECRET is unset in .env");
  process.exit(1); //Terminate the app.
};

/* Routes */
app.get('/', (_req, res) => {
  console.log('You reach the HeroTasks backend');
  res.send('Hi, HeroTasks API is running!');
});
app.get('/HeroTasks/Hey', (_req, res) => {
  res.send('Hey, HeroTasks API is running!');
});

/** Session **/
//login
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
      console.log("Server Side. The password is correct");
      if (userId !== undefined) {
        req.session.loggedUser = { id: userId, username: userEmail };
        res.status(200).json({ message: 'Login successful'})
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
});

//Create a logout route
// destroy the session
//clear the cookie
//redirect to Home Page

//Dashboard: Get all superheroes along with their tasks
app.get('/superheroes-with-tasks', async (req: Request, res: Response): Promise<void> => {
  try {
    const superheroes = await superheroQueries.getAllSuperheroes();
    console.log("Server side. superheroes from db: ", superheroes);

    const superheroesWithTasks = await Promise.all(
      superheroes.map(async (hero) => {
        const tasks = await taskQueries.getAllTasksBySuperhero(hero.superhero_name);
        return {
          ...hero,
          tasks
        };
      })
    );

    res.status(200).json(superheroesWithTasks);

  } catch (error) {
    console.error("Server. Error fetching superheroes with tasks:", error);
    res.status(500).json({ error: 'Internal server error while fetching dashboard data' });
  }
});

//Dashboard: Update the task completion. Toggle
app.put('/HeroTasks/tasks/:id/toggle', async (req: Request, res: Response): Promise<void> => {
  const taskId = parseInt(req.params.id);

  try {
    // Get the current task
    const task = await taskQueries.getTaskById(taskId);
    if (!task) {
      console.log("Server Side. Task not found.")
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // Toggle the `completed` value
    const updatedTask = await taskQueries.updateTaskCompletion(taskId, !task.completed);
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error toggling task completion:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



/* Server Start */
app.listen(PORT, () => {
  console.log(`Thank you for using the App. The Server is running on http://localhost:${PORT}`);
});
