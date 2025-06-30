
# 🦸‍♀️ HeroTasks

Empower your little heroes to complete tasks, build habits, and grow stronger every day!  
**HeroTasks** is a fun and interactive task management web app for families. Parents assign tasks to their children (superheroes), and the children earn strength points by completing them — building responsibility, routine, and good habits.

---

## ✨ Features

- 👨‍👩‍👧 **Parent Dashboard:** A main user (parent) can add and manage multiple superheroes (children).
- 💪 **Superhero:** Each superhero can view, complete, and track their assigned tasks.
- 📝 **Task Management:** Add, edit, or delete superpowers (chores/tasks) for each superhero.
- 🛡 **Code Confirmation:** Secure 4-digit code confirmation is required to perform sensitive actions like:
  - Adding or deleting a superhero
  - Adding or deleting tasks
  - Logging out of the parent account
- 🔄 **Real-Time Updates:** The task board reflects changes instantly while maintaining session state.
- 🔐 **Session-Based Authentication:** Routes are protected and persist securely using sessions.
- 📱 **Responsive Design:** Clean, mobile-friendly interface styled with modular SASS.
- 🗃 **Persistent Storage:** All superheroes and tasks are stored in a PostgreSQL database.

---

## 🛠 Tech Stack

### Frontend
- ⚛ React + Vite + TypeScript
- 🧭 React Router DOM
- 🎨 SASS (modular SCSS styling)

### Backend
- 🧠 Node.js + Express.js + TypeScript
- 🗃 PostgreSQL

---

## 🚀 How It Works

1. **Login & Session Guarding**
   - Parents and superheroes log in to their respective views.
   - The app uses a `useAuthSession` hook and `AuthGuard.tsx` to protect routes and redirect unauthorized users.

2. **Superhero Creation & Task Assignment**
   - Parents create superheroes using a form that requires code confirmation.
   - Tasks (superpowers) can be created, assigned to a superhero, and deleted — all guarded with the 4-digit code modal.

3. **Superhero Experience**
   - They can toggle a task as “completed” and watch their strength grow.

4. **Security & Roles**
   - Parents are the only ones who can manage superheroes and tasks.
   - Superheroes have limited access — they can view and mark tasks but cannot modify data.

---

## 📦 Installation

### 1. Clone the repository
```bash
git clone https://github.com/Rusgyn/HeroTasks.git
cd HeroTasks
```

### 2. Setup Backend
```bash
cd BackEnd
npm install
# Create a .env file with your DB credentials and session secret
npm run dev
```

### 3. Setup Frontend
```bash
cd ../FrontEnd
npm install
npm run dev
```

---

## 🔐 Authentication & Authorization

- 🔑 Session-based login with middleware protection.
- 🧩 All routes requiring authentication use guards (`AuthGuard.tsx`).
- 🧮 Critical actions (e.g., adding/deleting superheroes or tasks) trigger a secure **ConfirmWithCode** modal for verification.

---

## 🗂 Project Structure

```bash
HeroTasks/
├── FrontEnd/
│   └── src/
│       ├── auth/          # Auth session hooks & route guards
│       ├── components/    # Modals, forms, UI components
│       ├── styles/        # SCSS module styling
│       ├── types/         # TypeScript interfaces
│       └── App.tsx        # Routing & main layout
│
├── BackEnd/
│   └── src/
│       ├── Database/
│       │   ├── db.ts       # Database pool connection
│       │   ├── queries/    # Reusable SQL query functions
│       │   └── seeds/      # Optional seed data
│       ├── types/          # Shared types
│       └── utils/          # Code confirmation, auth helpers
├── .env                    # Environment variables
└── server.ts               # Express entry point
```

---

## 🧪 Example Usage

### Parent Flow
- Log in to the parent dashboard
- Add a superhero using the secure 4-digit code
- Assign superpowers (tasks) for each superhero
- Delete tasks or superheroes with code confirmation

### Superhero Flow
- View assigned superpowers
- Mark completed tasks and earn strength 💪

---

## 📄 License

MIT License

---

## 🙋‍♀️ Contributing

Contributions are welcome!  
Please fork the repo and submit a pull request. For larger changes, open an issue first to discuss.

---

## 💌 Special Thanks

This app was created with love and purpose — to help families work together and make daily tasks fun, meaningful, and empowering for young kids.

---

## 📸 HeroTasks Images

