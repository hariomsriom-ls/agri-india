import express from "express"
import cors from "cors"
import http from "http";
import cookieparser from "cookie-parser";
import { initializeSocket } from "../src/socket/socket.js";

const app = express()

console.log("CORS ORIGIN:", process.env.CORS_ORIGIN);

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

const server = http.createServer(app);

initializeSocket(server);

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieparser());

// routesimport
import landOwnerRouter from './routes/user/landowner.routes.js'
import pendingRegistrationRouter from './routes/user/pendingregistration.routes.js'
import authorityRouter from './routes/user/authority.routes.js'
import workerRouter from './routes/user/worker.routes.js'
import addressRouter from './routes/address.routes.js'

//routes declaration
app.use("/api/v1/user/landowner", landOwnerRouter)
app.use("/api/v1/user/pending-registration", pendingRegistrationRouter)
app.use("/api/v1/user/authority", authorityRouter)
app.use("/api/v1/user/worker", workerRouter)
app.use("/api/v1/address", addressRouter)


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || (err.name === "ValidationError" ? 400 : 500);
    const message = err.message || "Internal Server Error";
    
    return res.status(statusCode).json({
        statusCode,
        message,
        success: false,
        errors: err.errors || []
    });
});

export {app};