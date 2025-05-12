
const isUserLoggedIn = (reqSession: any) => {
  return reqSession.loggedUser?.id !== undefined; //loggedUser is the 'express-session" extended property. types/express-session.d.ts
}

export default isUserLoggedIn;