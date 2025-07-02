import { useState, useEffect } from "react";
import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL || '';

const useAuthSession = () => {
  const [isSessionActive, setIsSessionActive] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {

        axios.get("https://herotasks-production.up.railway.app/cors-test", { withCredentials: true });

        const response = await axios.get(`${backendUrl}/HeroTasks/check-session`, { withCredentials: true });

        console.log("Checking session. Response is: ", response.data);
        setIsSessionActive(response.data.loggedIn); //loggedIn (boolean) from backend
      } catch (error) {
        console.log("Checking Session. Error validating the session: ", error);
        setIsSessionActive(false);
      }

      setIsLoading(false);
    };
    checkSession();
  }, []); //[], runs only once

  return { 
    isSessionActive, isLoading
  };

};

export default useAuthSession;