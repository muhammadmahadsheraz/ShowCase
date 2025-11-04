import dotenv from "dotenv";
dotenv.config({path: true});
export const ENV = { CLERK_PUBLISHABLE_KEY : process.env.CLERK_PUBLISHABLE_KEY,CLERK_SECRET_KEY : process.env.CLERK_SECRET_KEY,PORT : process.env.PORT, DB_URL : process.env.DB_URL,APPLICATION_STATUS : process.env.APPLICATION_STATUS};