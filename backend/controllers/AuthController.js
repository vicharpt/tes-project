import * as authServices from "../services/AuthService.js"
import {
    loginValidation,
    registerValidation,
    validate
} from "../middlewares/validators.js"
import _catch from "../utils/catch.js"
import responseJson from "../utils/responseJson.js"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export const register = [
    ...registerValidation,
    validate,
    async (req, res) => {
        _catch(res, async () => {
            await authServices.save(req.body)
            responseJson(200, res, "Register successfully")
        })
    }
]

export const login = [
    ...loginValidation,
    validate,
    async (req, res) => {
        _catch(res, async () => {
            const user = await authServices.authenticate(req.body, res)
            if (user.accessToken) {
                responseJson(200, res, "Login successfully", {
                    token: user.accessToken
                })
            } else responseJson(user.status, res, user.msg)
        })
    }
]

export const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(204)
    const user = await prisma.users.findFirst({ where: { refreshToken } })
    if (!user) return res.sendStatus(204)
    await prisma.users.update({
        data: { refreshToken: null },
        where: { id: user.id }
    })
    res.clearCookie("refreshToken")
    res.sendStatus(200)
}
