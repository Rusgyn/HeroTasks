import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
//import Home from './components/Home';
import Register from './components/Register';
import Session from './components/Session';
import PasswordReset from './components/PasswordReset';
import HeroTaskBoard from './components/HeroTaskBoard';
import ContactUs from './components/ContactUs';


const App = () => {

  return (
    <Router>

      <div>
        <title>HeroTasks</title>
        <Routes>
          <Route path='/' element={ <Session />} />
          <Route path='/register' element={ <Register />} />
          <Route path='/login' element={<Session />} />
          <Route path='/forgot-password' element={ <PasswordReset />} />
          <Route path='/help' element={ <ContactUs /> } />
          <Route path='/task-board' element={ <HeroTaskBoard />} />
        </Routes>
      </div>

    </Router>   
  );

}

export default App;