import session from "express-session";

// Extend the existing session data interface
declare module 'express-session' { 
  interface SessionData {
    loggedUser: { id: number, username: string };
    // Can define more custom property here
  }
}

/**
 * NOTE:
 * By default, TypeScript uses the built-in types for express-session, and it does not include your custom properties.
 * Hence, you need to extend the SessionData interface provided by the express-session library to include your custom property (example: loggedUser).
 * This has to be added in your Tsconfig.json include file.
 */