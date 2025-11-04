import express from "express";
import {ENV} from "./lib/env.js";
import {connectDB} from "./lib/db.js";
import path from "path";
const app = express();
const __dirname = path.resolve();
app.get("/", (req, res) => {
    res.status(200).json({message: "hey from the server 123"});
});
if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "frontend/dist")));
    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
    });
}
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