import React, { useState, useEffect } from "react";
import axios from "axios";
import { Superhero } from '../types/Superhero';
import '../styles/HeroTaskBoard.scss';


const HeroTaskBoard = () => {

  const [superheroes, setSuperheroes] = useState<Superhero[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroesData = async() => {
      try {
        const response = await axios.get('/HeroTasks/superheroes-with-tasks');
        console.log("Hero DashBoard. The Superheroes Data: ", response.data);
        setSuperheroes(response.data);
      } catch (error) {
        console.error("Hero Dashboard. Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHeroesData();
  }, []);

  if (loading) return <div className="loading"> Loading ... </div>;

  return (
    <div className="board_page">

      <div className="board">
        <h1> HeroTaskBoard Component!</h1>
      </div>

    </div>
  )
};

export default HeroTaskBoard;