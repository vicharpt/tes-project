import jwt from "jsonwebtoken"
import _catch from "../utils/catch.js"
import { PrismaClient } from "@prisma/client"
import responseJson from "../utils/responseJson.js"
import generateToken from "../utils/generateToken.js"
const prisma = new PrismaClient()
const config = process.env

export const authorize = (req, res, next) => {
    const authheader = req.headers["authorization"]
    const token = authheader && authheader.split(" ")[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, config.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403)
        req.email = decoded.email
        next()
    })
}

export const refreshToken = async (req, res) => {
    _catch(res, async () => {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.sendStatus(401)
        const user = await prisma.users.findFirst({ where: { refreshToken } })
        if (!user) return res.sendStatus(403)
        jwt.verify(
            refreshToken,
            config.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err) return res.sendStatus(403)
                const payload = {
                    userId: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
                const accessToken = generateToken(
                    payload,
                    config.ACCESS_TOKEN_SECRET,
                    config.ACCESS_TOKEN_LIFETIME
                )
                responseJson(200, res, undefined, { token: accessToken })
            }
        )
    })
}
