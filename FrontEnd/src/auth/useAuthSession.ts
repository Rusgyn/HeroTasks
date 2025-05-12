import { useState, useEffect } from "react";
import axios from 'axios';

const useAuthSession = () => {
  const [isSessionActive, setIsSessionActive] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('HeroTasks/check-session', {withCredentials: true})

        console.log("Checking session. Reponse is: ", response.data);
        setIsSessionActive(response.data.loggedIn)
      } catch (error) {
        console.log("Checking Session. Error validating the session: ", error);
        setIsSessionActive(false);
      }

      setIsLoading(false);
    };
    checkSession();
  }, []); //[], runs only once

  if(isLoading) {
    console.log("Loading....");
    return null;// null,prevent rendering anything until the session checking is complete.
  }

  //... TO ADD THE NEXT STEPS WHEN SUCCESSFUL

}

export default useAuthSession;