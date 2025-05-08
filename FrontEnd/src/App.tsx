import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Session from './components/Session';
import HeroTaskBoard from './components/HeroTaskBoard';


const App = () => {

  return (
    <Router>

      <div>
        <title>HeroTasks</title>
        <Routes>
          <Route path='/' element={ <Home />} />
          <Route path='/login' element={<Session />} />
          <Route path='/task-board' element={ <HeroTaskBoard />} />
        </Routes>
      </div>

    </Router>   
  );

}

export default App;