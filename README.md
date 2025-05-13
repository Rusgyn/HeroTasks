# HeroTasks

Empower your little heroes to complete tasks, build habits, and grow stronger every day!  
**HeroTasks** is a task management app designed for families, where parents assign tasks and children complete them as superheroes.

---

## ✨ Features

- 👩‍👧‍👦 Parent (Main User) can create multiple superheroes (children)
- ✅ Superheroes can complete daily tasks and build good habits
- ❤️ Tasks can include rewards and feedback
- 🔐 Secure session-based login for authentication
- 🔄 Real-time task board updates using sessions and guards
- 🎨 Clean responsive UI styled with SASS
- 🗃️ PostgreSQL database for persistent storage

---

## 🛠️ Tech Stack

**Frontend**  
- React + Vite + TypeScript  
- React Router DOM  
- SASS (modular SCSS styling)  

**Backend**  
- Node.js + Express.js + TypeScript  
- PostgreSQL (via pg or an ORM)  

---

## 📦 Installation

### 1. Clone the repository
```bash
git clone https://github.com/Rusgyn/HeroTasks.git
cd HeroTasks
```

### 2. Setup Backend and start the development server:
```bash
cd BackEnd
npm install
# Create a .env file with DB credentials and session secret
npm run dev
```

### Setup Frontend and start the development server:
```bash
cd ../FrontEnd
npm install
npm run dev
```

## 🔐 Authentication
- Sessions are validated using a useAuthSession custom hook.
- Routes requiring login are protected using AuthGuard.tsx.
- If a session is active, the user is redirected to /task-board.

## ✅ Usage

- Login using a superhero account
- Complete tasks to earn strength
- Logout when finished

## 📁 Project Structure
HeroTasks/
│
├── FrontEnd/
│   ├── src/
│   │   ├── auth/          # useAuthSession + AuthGuard
│   │   ├── components/    # Reusable UI components
│   │   ├── styles/        # Pages styling
│   │   └── types/         # types
│   │   └── App.tsx        # App entry and routing
│
├── BackEnd/
│   ├── src/
│   │   ├── Database/      # DB connection
│   │   │ ├── queries/     # Reusable UI components
│   │   │ ├── seeds/     # Reusable UI components
│   │   │ ├── db.ts     # Reusable UI components
│   │   ├── types/        # Pages styling
│   │   └── utils/         # types
│   ├── server.ts          # Express route handlers
│   ├── .env                # Logic for API endpoints
│   ├── database/          # SQL scripts and DB connection
│   └── server.ts          # Main Express server

## 📄 License

MIT

## 🙋‍♀️ Contributing
Contributions are welcome! Please fork the repository and open a pull request. For major changes, open an issue first to discuss.
