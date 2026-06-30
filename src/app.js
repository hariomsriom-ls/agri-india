import express from "express"
import cors from "cors"
import cookieparser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieparser())

// routesimport
import landOwnerRouter from './routes/user/landowner.routes.js'
import pendingRegistrationRouter from './routes/user/pendingregistration.routes.js'
import authorityRouter from './routes/user/authority.routes.js'
import workerRouter from './routes/user/worker.routes.js'

//routes declaration
app.use("/api/v1/user/landowner", landOwnerRouter)
app.use("/api/v1/user/pending-registration", pendingRegistrationRouter)
app.use("/api/v1/user/authority", authorityRouter)
app.use("/api/v1/user/worker", workerRouter)

export {app};