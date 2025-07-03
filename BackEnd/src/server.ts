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
import bcrypt from 'bcryptjs';

//Internal Modules and DB Queries */
import db from './Database/db';
import userQueries from "./Database/queries/usersQueries";
import superheroQueries from "./Database/queries/superheroesQueries";
import taskQueries from "./Database/queries/tasksQueries";

//Type imports
import User from "./types/userTypes";
import { Superhero, NewSuperheroInput } from "./types/superheroTypes";

//Utilities import
import isUserLoggedIn from "./utils/sessionUtils";

/* Express Setup */
const app = express();

app.set("trust proxy", 1); //This trust the Railway proxy

/* Middleware */
//CORS should be added before any other routes or middleware this ensures that the CORS headers are properly set in the response before any other logic 
// app.use(cors({
//   origin: "https://hero-tasks.vercel.app", //process.env.CLIENT_URL || "http://localhost:5173",
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// }));

//Testing this CORS to see what causes the error when deploying
const allowedOrigins = [
  "https://hero-tasks.vercel.app",
  "http://localhost:5173",
];

const corsOptions = {
  origin: (origin: string | undefined, callback: any) => {
    console.log("CORS origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  // methods: ["GET", "POST", "PUT", "DELETE"],
  // allowedHeaders: ["Content-Type", "Authorization"],
};

// 🔹 Apply once for all regular requests
app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://hero-tasks.vercel.app/'); // Or specify your domain
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


app.use(morgan('dev')); // HTTP request logger
app.use(express.json()); // Parse JSON payloads.
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads

/* DB Test - Development */
// db.query('SELECT current_database();')
//   .then(response => console.log('✅ Connected to DB:', response.rows[0]))
//   .catch(error => console.error('❌ Error checking current DB:', error));

/* Session Configuration */ 
//**Always place express-session after express.json() and express.urlencoded() middleware for session handling to work properly.
const sessionSecret = process.env.DB_SESSION_SECRET;
if (sessionSecret) {
  app.use(
    session({
      secret: sessionSecret,
      resave: false, //avoid saving session if not modified
      saveUninitialized: false, //prevent creating session until stored
      cookie: {
        httpOnly: true, //prevent client-side scripts from accessing the cookie
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production (https)
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 1000 * 60 * 60, // 1hr session
        // DEVELOPMENT 
        // secure: false, //DEVELOPMENT ONLY. Update to true during production, https
        // sameSite: 'lax', //DEVELOPMENT ONLY.
      }
    })
  );
} else {
  console.error("DB_SESSION_SECRET is unset in .env");
  process.exit(1); //Terminate the app.
};


/* Routes */
/** Session . This is for debugging purpose**/
// app.use((req, res, next) => {
//   console.log('🔍 [Session Logger]');
//   console.log('Cookies:', req.headers.cookie);
//   console.log('Session:', req.session);
//   next();
// });

app.get('/test-cors', (_, res): Promise<any> => {
  res.json({ ok: true });
  return Promise.resolve();
}
)


//Authenticate session
app.get('/HeroTasks/check-session', async (req: Request, res: Response): Promise<any> => {
  try { 
    if (isUserLoggedIn(req.session)) {
       console.log("THE USER IN SESSION IS: =>  ", req.session.loggedUser);
      return res.json( {loggedIn: true} );
    }

    res.json( {loggedIn: false} );

  } catch (error) {
    console.error ('Server side. Error checking the sessions');
    return res.status(500).json( {error: 'Internal Server Error'} );
  };

  console.log("=============")
});

//login
app.post('/HeroTasks/login', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    console.log('Server Side. Please fill in your username and password');
    res.status(400).json({ error: 'Please fill in your username and password' });
    return;
  }

  try {
    const isUserExist = await userQueries.getUserByEmail(username);

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

//Logout Route
app.post('/HeroTasks/logout', async (req: Request, res: Response): Promise<any> => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.clearCookie('connect.sid')
      res.status(200).json({ message: 'Logout successful!' });
    }
  });
});

//Registration route
app.post('/HeroTasks/register', async (req: Request, res: Response): Promise<void> => {
  
  const { first_name, last_name, email, password, code } = req.body;

  try {
    //Guard Statement. Check if user already exist.
    const isUserExist = await userQueries.getUserByEmail(email);

    if (isUserExist) {
      console.log('User already exists for email:', email);
      res.status(400).json({ error: 'User already exists!' });
      return;
    }

    // newUser as the users types
    const newUser: User = {
      first_name,
      last_name,
      email,
      password_digest: password,
      code,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const addNewUser = await userQueries.addUser(newUser);
    res.status(201).json(addNewUser);
    return;

  } catch (error) {
    console.error('Error registering user: ', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  };

} )

//Code Verification
app.post('/HeroTasks/verify-code', async (req: Request, res: Response): Promise<void> => {
  const { code } = req.body;
  const userId = req.session.loggedUser?.id;

  console.log("Verifying code. Session user:", userId, "| Code entered:", code);

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized: No user logged in.' });
    return;
  }

  try {
    const isValid = await userQueries.verifyUserCode(userId, code.toString());

    if (!isValid) {
      res.status(401).json({ error: 'Invalid code.' });
      return;
    }

    res.status(200).json({ message: 'Code verified.' });
  } catch (error) {
    console.error('Server error verifying code: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//New Superhero
app.post('/HeroTasks/superheroes', async (req: Request, res: Response): Promise<void> => {

  const { superhero_name } = req.body

  try {
    // 1. Get the active user
    const userId = req.session.loggedUser?.id;

    if (typeof userId !== 'number') {
      res.status(401).json({ error: 'Unauthorized: No user logged in' });
      return;
    }
    // 2. Validate the superhero name and the active user. To check if it exist.
    const isSuperheroExist = await superheroQueries.getSuperheroByNameAndUserId(superhero_name, userId);

    if(isSuperheroExist) {
      res.status(400).json({ error: 'Superhero already exists!' });
      return;
    }

    //3. New Superhero data
    const newSuperhero: Superhero = {
      superhero_name,
      strength: 0,
      created_at: new Date(),
      updated_at: new Date(),
      user_id: userId
    };

    const addNewSuperhero = await superheroQueries.addSuperhero(newSuperhero);
    res.status(201).json(addNewSuperhero);

  } catch (error) {
    console.error('Error registering user: ', error);
    res.status(500).json({ error: 'Internal server error' });
  };  
}
);

//Dashboard: Get all superheroes along with their tasks
app.get('/HeroTasks/superheroes-with-tasks', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.session.loggedUser?.id
    console.log("The userID is : => ", userId);

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized: No user logged in' });
      return;
    }

    const superheroes = await superheroQueries.getAllSuperheroesByLoggedUser(userId);

    const superheroesWithTasks = await Promise.all(
      superheroes.map(async (hero) => {
        if (typeof hero.id !== 'number') {
          return { ...hero, tasks: [] };
        }
        const tasks = await taskQueries.getAllTasksBySuperhero(hero.id);
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

//Add Task
app.post('/HeroTasks/superheroes/:heroId/add-task', async (req: Request, res: Response): Promise<void> => {
  const heroId = parseInt(req.params.heroId);
  const { superpower } = req.body;
  
  // Guard Statement
  if (isNaN(heroId)) {
    res.status(400).json({ error: 'Invalid Superhero ID' });
    return;
  }

  if (!superpower || typeof superpower !== 'string') {
    res.status(400).json({ error: 'Invalid or missing superpower field' });
    return;
  }

  //Connecting to db to add task
  try {

    const newTaskInput = {
      superhero_id: heroId,
      superpower,
      completed: false,
      created_at: new Date(),
      updated_at: new Date(),
    }

    const newTask = await taskQueries.addTaskBySuperhero(newTaskInput);
    res.status(201).json(newTask);
    return;

  } catch(error) {
    console.error('Server side. Error adding new task: ', error);
    res.status(500).json({ error: 'Internal server error' });
  };

});

//Dashboard: Update the task completion. Toggle
app.put('/HeroTasks/tasks/:taskId/toggle', async (req: Request, res: Response): Promise<void> => {
  const taskId = parseInt(req.params.taskId);
  console.log("Server side. Receive the taskId number: ", taskId);
  if (isNaN(taskId)) {
    res.status(400).json({ error: 'Invalid task ID' });
    return;
  }

  try {
    // 1. Get current task completion status
    const task = await taskQueries.getTaskById(taskId);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return 
    }

    // 2. Toggle the status
    const newCompletedStatus = !task.completed;

    // 3. Update task and recalculate strength
    await taskQueries.updateTaskCompletion(taskId, newCompletedStatus);

    res.status(200).json({ message: 'Task toggled successfully' });

  } catch (error) {
    console.error('Error toggling task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Dashboard: Fetch the affected hero data
app.get('/HeroTasks/superheroes/:id', async (req: Request, res: Response): Promise<void> => {
  const heroId = parseInt(req.params.id);
  const hero = await superheroQueries.getSuperheroWithTasksAndStrength(heroId); 
  res.json(hero);
});

//Delete Task (individual)
app.delete('/HeroTasks/tasks/:id', async (req: Request, res: Response): Promise<void> => {
  const taskId = parseInt(req.params.id);

  // Guard Statement
  if (isNaN(taskId)) {
    res.status(400).json({ error: 'Invalid Task ID' });
    return;
  }

  // Use DB queries to delete the task
  try {
    const task = await taskQueries.getTaskById(taskId);

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const delTask = await taskQueries.deleteTaskById(task);
    res.status(200).json({ message: delTask.message });
    return;

  } catch (error) {
    console.error('Server side. Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

//Delete Superhero All Task
app.delete('/HeroTasks/superheroes/:id/delete-all-tasks', async (req: Request, res: Response): Promise<void> => {
  const heroId = parseInt(req.params.id);

  // Guard Statement
  if (isNaN(heroId)) {
    res.status(400).json({ error: 'Invalid Task ID' });
    return;
  }

  try {
    const delAllTask = await taskQueries.deleteAllTasksByHero(heroId);
    res.status(200).json({ message: delAllTask.message });
    return;

  } catch (error) {
    console.error('Server side. Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

//Delete or Eliminate Superhero
app.delete('/HeroTasks/superheroes/:id', async (req: Request, res: Response): Promise<void> => {
  
  const heroId = parseInt(req.params.id);

  // Guard Statement
  if (isNaN(heroId)) {
    res.status(400).json({ error: 'Invalid Task ID' });
    return;
  }

  const loggedUserIdByHero = await superheroQueries.getLoggedUserByHeroId(heroId);

  if (!loggedUserIdByHero) {
    res.status(404).json({ error: 'The user_id by superhero Id was not found'});
    return;
  }

  const userInSession = req.session.loggedUser?.id;

  if (!userInSession) {
    res.status(404).json({ error: 'No active session'});
    return;
  }

  if (userInSession !== loggedUserIdByHero.user_id) {
    res.status(404).json({ error: 'You have no access to this Superhero'});
    return;
  }

  try {
    const delSuperhero = await superheroQueries.deleteSuperheroById(heroId);
    res.status(200).json({ message: delSuperhero.message });
    return;

  } catch (error) {
    console.error('Line 461. Server side. Error deleting the Superhero:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
    
});


// ===========================
/* Server Start */
const PORT = process.env["PORT"] || 3001;

app.listen(PORT, () => {
  console.log(`Thank you for using the App. The Server is running on http://localhost:${PORT}`);
});
