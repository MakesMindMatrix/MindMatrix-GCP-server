const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken(user._id)
    const cookieExpireDays = Number(process.env.COOKIE_EXPIRE) || 7;

    const options = {
        expires: new Date(
            Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        sameSite: 'None'
    }

    res.cookie('token', token, options)

    res.status(statusCode).json({
        success: true,
        user,
        token
    })
}

module.exports = sendToken