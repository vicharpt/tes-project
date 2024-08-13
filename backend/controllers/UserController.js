import _catch from "../utils/catch.js"
import responseJson from "../utils/responseJson.js"
import * as userServices from "../services/UserService.js"

export const getUsers = async (req, res) => {
    _catch(res, async () => {
        const users = await userServices.getAll()
        responseJson(200, res, `Success get users, total (${users.length}) data`, {
            data: users
        })
    })
}
