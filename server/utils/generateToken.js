import { INTERNAL_SERVER_ERROR } from "./apiResponseCode.js";
import { ApiError } from "./apiError.js";
import User from "../models/user.js";
import {generateAccessToken, generateRefershToken} from "./utilities.js"; 

const generateAccessAndRefreshTokenForUser = async (user) => {
    try {
        const existeduser = await User.findById(user._id)
        const accessToken = await generateAccessToken(user, "USER")
        const refreshToken = await generateRefershToken(user)
        existeduser.refreshToken = refreshToken;
        await existeduser.save({ validateBeforeSave: false })
        return {accessToken, refreshToken}
    } catch (err) {
        throw new ApiError(INTERNAL_SERVER_ERROR, err.message)
    }
}

export {
    generateAccessAndRefreshTokenForUser
}
