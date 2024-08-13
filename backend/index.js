import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import AuthRoutes from "./routes/AuthRoutes.js"
import UserRoutes from "./routes/UserRoutes.js"
import env from "dotenv"
env.config()

const app = express()
app.use(cors({ credentials: true, origin: "http://localhost:3000" }))
app.use(cookieParser())
app.use(express.json())
app.use(AuthRoutes)
app.use("/api", UserRoutes)

app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
)
