import jwt from "jsonwebtoken"

export default (payload, secret, expiresIn) => {
    return jwt.sign(payload, secret, { expiresIn })
}
