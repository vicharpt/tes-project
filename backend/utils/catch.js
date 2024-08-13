import responseJson from "./responseJson.js"

export default (res, callback) => {
    try {
        callback()
    } catch (e) {
        responseJson(500, res, "Internam server error")
    }
}
