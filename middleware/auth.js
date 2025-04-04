const User = require("../models/user.model")
const ErrorHandler = require("../utils/errorHandler")
const asyncHandler = require("./asyncHandler");
const jwt = require('jsonwebtoken'); 

exports.isAuthenticated = asyncHandler(async (req, res, next) => {
    const {token} = req.cookies;
         
    if (!token) {
        return next(new ErrorHandler("Please login to access this resource", 401))
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decodedData.id)

    next()
})

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role ${req.user.role} is not allowed to acces this role`, 403))
        }
        next()
    }
}