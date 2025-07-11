import dotenv from "dotenv"

import { app } from "./app.js";
import { connectDB } from "./db/index.js";

dotenv.config({
    path: './.env'
})

const port = process.env.PORT || 4000

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log("server is running at port", port)
        })
    })
    .catch((error) => {
        console.log("MongoDB connection failed",error)
    })