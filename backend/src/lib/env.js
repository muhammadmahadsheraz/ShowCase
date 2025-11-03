import dotenv from "dotenv";
dotenv.config();
export const ENV = {PORT : process.env.PORT, MY_URL : process.env.DB_URL,APPLICATION_STATUS : process.env.APPLICATION_STATUS};