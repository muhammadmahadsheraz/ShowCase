import express from "express";
import {ENV} from "./lib/env.js";
const app = express();
console.log(ENV.PORT, "port");
app.get("/", (req, res) => {
    res.status(200).json({message: "hey from the server 123"});
});
app.listen(3001, () => {
    console.log("server is running on port 3001");
});