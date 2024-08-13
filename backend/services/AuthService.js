import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client"
import generateToken from "../utils/generateToken.js"
const prisma = new PrismaClient()

export const save = async (req) => {
    let { name, email, password, gender } = req
    gender = gender.toUpperCase()
    password = await bcrypt.hash(password, 10)
    await prisma.users.create({
        data: {
            name,
            email,
            password,
            gender
        }
    })
}

export const authenticate = async (req, res) => {
    const user = await prisma.users.findUnique({ where: { email: req.email } })
    if (!user) return { status: 404, msg: "email not found" }
    const match = await bcrypt.compare(req.password, user.password)
    if (!match) return { status: 401, msg: "wrong password" }
    const payload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }
    const config = process.env
    const accessToken = generateToken(
        payload,
        config.ACCESS_TOKEN_SECRET,
        config.ACCESS_TOKEN_LIFETIME
    )
    const refreshToken = generateToken(
        payload,
        config.REFRESH_TOKEN_SECRET,
        config.REFRESH_TOKEN_LIFETIME
    )
    await prisma.users.update({
        where: { id: user.id },
        data: { refreshToken }
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    })
    return { accessToken }
}
