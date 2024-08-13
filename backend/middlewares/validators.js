import { body, validationResult } from "express-validator"
import { PrismaClient } from "@prisma/client"
import responseJson from "../utils/responseJson.js"
const prisma = new PrismaClient()

export const registerValidation = [
    body("name")
        .notEmpty()
        .withMessage("name is required")
        .isString()
        .withMessage("name must be string")
        .isLength({ min: 3, max: 30 })
        .withMessage("name between 3 to 30 characters")
        .trim(),
    body("email")
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("invalid email")
        .custom(async (email) => {
            const user = await prisma.users.findUnique({ where: { email } })
            if (user) return Promise.reject("email already used")
        })
        .trim(),
    body("password")
        .notEmpty()
        .withMessage("password is required")
        .isLength({ min: 6, max: 20 })
        .withMessage("password between 6 to 20 characters")
        .trim(),
    body("gender")
        .notEmpty()
        .withMessage("gender is required")
        .isIn(["L", "P"])
        .withMessage("gender only contains L or P")
        .trim()
]

export const loginValidation = [
    body("email")
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("invalid email")
        .trim(),
    body("password").notEmpty().withMessage("password is required").trim()
]

export const validate = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return responseJson(400, res, "Request failed", {
            errors: errors.mapped()
        })
    }
    next()
}
