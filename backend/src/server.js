import express from "express";
import {ENV} from "./lib/env.js";
import path from "path";
const app = express();
const __dirname = path.resolve();
app.get("/", (req, res) => {
    res.status(200).json({message: "hey from the server 123"});
});
if(ENV.APPLICATION_STATUS === "production"){
    app.use(express.static(path.join(__dirname, "frontend/dist")));
    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
    });
}
app.listen(3001, () => {
    console.log("server is running on port 3001");
});