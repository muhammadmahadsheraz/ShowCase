import express from "express";
import {ENV} from "./lib/env.js";
import {connectDB} from "./lib/db.js";
import {inngest,functions} from "./lib/inngest.js";
import {serve} from 'inngest/express';
import path from "path";
import cors from 'cors';
const app = express();

const __dirname = path.resolve();
//middleware
app.use(express.json());
app.use(cors({origin : ENV.CLIENT_URL,credentials:true}));
app.use("/api/inngest",serve( {client : inngest , functions}));


const connectServer =  async () =>{
    try {
        
        await connectDB();
        app.listen(ENV.PORT, () => {
            console.log("server is running on port",ENV.PORT);
        });
    } catch (error) {
        console.log("Error in connecting to the server",error);
        process.exit(1);

    }
}
connectServer();