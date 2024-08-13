import express from "express"
import { login, logout, register } from "../controllers/AuthController.js"
import { refreshToken } from "../middlewares/authMiddleware.js"

const router = express.Router()
router.post("/register", register)
router.post("/login", login)
router.delete("/logout", logout)
router.get("/token", refreshToken)

export default router
