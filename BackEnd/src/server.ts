import express from "express";
import morgan from "morgan"; // HTTP request logger
import cors from "cors";
import db from "./Database/db";
import dotenv from "dotenv";
import axios from "axios";

const app = express();
const PORT = 3001;

//handles dotenv for databasing. Loaded at the start
dotenv.config();

//Middleware
//CORS middleware. Should be added before any other routes or middleware this ensures that the CORS headers are properly set in the response before any other logic 
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(morgan('dev')); // HTTP request logger
app.use(express.json()); // Parse JSON payloads.
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads

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
