import User from "../models/user.js";
import { ApiError } from "../utils/ApiError.js";
import { BAD_REQUEST, UN_AUTHORIZED } from "../utils/apiResponseCode.js";
import jwt from "jsonwebtoken"


const AuthMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            throw new ApiError(UN_AUTHORIZED, "Unauthorized")
        }

        const decordedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        let user;

        if(decordedToken?.role == "ADMIN"){
           user = await Admin.findById(decordedToken?._id).lean()
        }else{
            user = await User.findOne({_id: decordedToken?._id, isDeleted: false}).lean()
        }

        if (!user) {
            throw new ApiError(BAD_REQUEST, "Invalid Token")
        }

        req.user = user;
        next()
    } catch (error) {
        next(error)
    }
}


export { AuthMiddleware }