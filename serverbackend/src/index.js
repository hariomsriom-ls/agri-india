//import dotenv from "dotenv";
import "dotenv/config";
import connectDB from "./db/index.js";

//dotenv.config();

import { app } from "./app.js";



connectDB()

.then(()=>{
    app.on("error", (error)=>{
        console.log("error",error);
        throw error
    })
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at port : ${process.env.PORT}`)
    })
})
.catch((err) =>{
    console.log("MONGODB CONNECTION FAILED", err)
})



