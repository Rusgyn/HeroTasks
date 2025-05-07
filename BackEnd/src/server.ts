import dotenv from "dotenv";
import path from "path";
dotenv.config(
  {
    path: path.resolve(__dirname, '../.env')
  }
); //handles dotenv for databasing. Above format will ensure that db is loaded before anything and get the correct values.

import express from "express";
import morgan from "morgan"; // HTTP request logger
import cors from "cors";
import db from './Database/db';
import axios from "axios";
import session from "express-session"; //maintain user state
/* DB Queries */
import userQueries from "./Database/queries/usersQueries";
import superheroQueries from "./Database/queries/superheroesQueries";
import taskQueries from "./Database/queries/tasksQueries";
/* Types */
import User from "./types/userTypes";
import { Superhero, NewSuperheroInput } from "./types/superheroTypes";
import { Task, NewTaskInput } from "./types/taskTypes";

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
db.query("SELECT * FROM users WHERE id = 1;")
  .then((response) => console.log("DB Test, user table found: ", response.rows))
  .catch((error) => console.error("DT Test, error querying users table:", error));
  
db.query('SELECT current_database();')
  .then(res => console.log('✅ Connected to DB:', res.rows[0]))
  .catch(err => console.error('❌ Error checking current DB:', err));

/* User API routes */
app.get('/', (_req, res) => {
  console.log('You reach the HeroTasks backend');
  res.send('Hi, HeroTasks API is running!');
});
app.get('/HeroTasks/Hey', (_req, res) => {
  res.send('Hey, HeroTasks API is running!');
});


/** Session **/
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log("Server. Login info: ", req.body);
  console.log("=== END ===");

  if (!username || !password) {
    res.status(400).json({ error: 'Please fill in your username and password' });
    console.log('Server. Please fill in your username and password');
    return;
  };

  console.log('Server. Login button clicked');

})

// Server Start
app.listen(PORT, () => {
  console.log(`Thank you for using the App. The Server is running on http://localhost:${PORT}`);
});
