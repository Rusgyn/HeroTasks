import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Session from './components/Session';
import Home from './components/Home';


const App = () => {

  return (
    <Router>

      <div>
        <title>HeroTasks</title>
        <Routes>
          <Route path='/' element={ <Home />} />
          <Route path='/login' element={<Session />} />
        </Routes>
      </div>

    </Router>   
  );

}

export default App;