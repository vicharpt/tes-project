export default (
    status,
    res,
    msg,
    args = { data: undefined, errors: undefined, token: undefined }
) => {
    res.status(status).json({
        status,
        msg,
        data: args.data,
        errors: args.errors,
        token: args.token
    })
}
