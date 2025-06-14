import User from "../models/user.js";
import Admin from "../models/admin.js";
import { ApiError } from "../utils/ApiError.js";
import { EXPIRED_TOKEN, UN_AUTHORIZED } from "../utils/apiResponseCode.js";
import jwt from "jsonwebtoken"
import i18n from "../utils/i18n.js";
import { clearAuthCookies, generateAccessToken } from "../utils/utilities.js";
// import { log } from "winston";

const AuthMiddleware = async (req, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken
        console.log("Access Token", accessToken)

        if (!accessToken) throw new ApiError(UN_AUTHORIZED, i18n.__("INVALID_TOKEN"))
        let decodedToken;
        try {
            decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        } catch (err) {
            if (err instanceof TokenExpiredError) {
                throw new ApiError(EXPIRED_TOKEN, i18n.__('TOKEN_EXPIRED'));
            }
            throw new ApiError(UN_AUTHORIZED, i18n.__('INVALID_TOKEN'));
        }

        let user;

        if (decodedToken.role === 'ADMIN') {
            user = await Admin.findById(decodedToken._id).select('email role status isDeleted');
        } else {
            user = await User.findById(decodedToken._id).select('email role status isDeleted');
        }
        if (!user || user.status === 'INACTIVE' || user.isDeleted) {
            clearAuthCookies(res);
            throw new ApiError(UN_AUTHORIZED, i18n.__('ACCOUNT_DEACTIVATED'));
        }
        user.expiresAt = decodedToken.exp * 1000;
        user.role === "ADMIN" ? req.admin = user : req.user = user;

        next()
    } catch (error) {
        clearAuthCookies(res);
        next(new ApiError(UN_AUTHORIZED, i18n.__("UNAUTHORIZED")));
    }
}

const handleTokenRefresh = async (req, res, next) => {
    try {
        let user;
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) throw new ApiError(UN_AUTHORIZED, i18n.__("REFRESH_TOKEN"));

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        if (decoded?.role === "ADMIN") {
            user = await Admin.findById(decoded.userId).select('email role isActive');
        } else {
            user = await User.findById(decoded.userId).select('email role isActive');
        }

        if (!user || !user.isActive) {
            clearAuthCookies(res);
            throw new ApiError(UN_AUTHORIZED, i18n.__("INVALID_REFRESH_TOKEN"));
        }

        // Generate new tokens
        const accessToken = await generateAccessToken(user, user.role);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 2 * 60 * 60 * 1000, // 15 minutes
            path: '/',
        });

        user.role === "ADMIN" ? req.admin = user : req.user = user;
        next();
    } catch (error) {
        clearAuthCookies(res);
        next(new ApiError(UN_AUTHORIZED, i18n.__("TOKEN_REFRESH_FAILED")))
    }
};


export { AuthMiddleware, handleTokenRefresh }