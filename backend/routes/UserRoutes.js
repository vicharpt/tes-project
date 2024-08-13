import express from "express"
import { getUsers } from "../controllers/UserController.js";
import { authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get('/users', authorize, getUsers);

export default router