import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Register from './components/Register';
import Session from './components/Session';
import HeroTaskBoard from './components/HeroTaskBoard';
import ContactUs from './components/ContactUs';
import AuthGuard from './auth/AuthGuard';



const App = () => {

  return (
    <Router>
      <div>
        <title>HeroTasks</title>
        <Routes>

          {/* No session required. Public route */}
          <Route path='/' element={ <Session />} />
          <Route path='/login' element={<Session />} />
          <Route path='/register' element={ <Register />} />
          <Route path='/help' element={ <ContactUs /> } />

          {/* Requires Session. Protected route in one wrapper */}
          <Route element={ <AuthGuard /> } >
            <Route path='/task-board' element={ <HeroTaskBoard />} />
          </Route>
          
        </Routes>
      </div>
    </Router>   
  );

}

export default App;