import express from "express";
import morgan from "morgan"; // HTTP request logger
import cors from "cors";
import db from "./Database/db";
import dotenv from "dotenv";

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

app.get('/', (_req, res) => {
  res.send('HeroTasks API is running!');
});

// Server Start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
