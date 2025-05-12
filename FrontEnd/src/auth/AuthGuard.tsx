import useAuthSession from "./useAuthSession";
import { Navigate, Outlet } from "react-router-dom";

const AuthGuard = () => {
  //props
  const {isSessionActive, isLoading} = useAuthSession();

  if(isLoading) {
    console.log("Loading ...");
    return null; //null prevent rendering anything until session check completes
  }


  console.log("Done ...");
  return isSessionActive ? <Outlet /> : <Navigate to="/login" replace />;// true : false
  
}

export default AuthGuard;