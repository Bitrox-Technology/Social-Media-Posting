import { Router } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import { INTERNAL_SERVER_ERROR, OK, UN_AUTHORIZED } from "../utils/apiResponseCode.js";
import i18n from "../utils/i18n.js";
import jwt from "jsonwebtoken";
import { RevokeToken } from "../utils/csrf.js";
import logger from "../middlewares/logger.js";
import { AuthMiddleware } from "../middlewares/auth.js";
import User from "../models/user.js";
import Admin from "../models/admin.js";
import { clearAuthCookies, generateAccessToken } from "../utils/utilities.js";
import { ApiError } from "../utils/ApiError.js";
const authRouter = Router()

authRouter.get("/auth-status", AuthMiddleware, async (req, res) => {
    try {
        if (!req.user) throw new ApiError(UN_AUTHORIZED, i18n.__('USER_NOT_FOUND'));
        res.status(OK).json(new ApiResponse(OK, {
            user: { id: req.user._id, email: req.user.email, role: req.user.role, expiresAt: req.user.sessionExpiry },
            isAuthenticated: true,
        }, i18n.__('AUTH_STATUS_SUCCESS')));
    } catch (error) {
        logger.error('Auth status error', {
            message: error.message,
            stack: error.stack,
            ip: req.getClientIp(),
        });
        throw error instanceof ApiError ? error : new ApiError(INTERNAL_SERVER_ERROR, i18n.__('AUTH_STATUS_FAILED'));
    }
})

authRouter.get('/validate-session', AuthMiddleware, async (req, res) => {
    try {
        if (!req.user || req.user.status === 'INACTIVE' || req.user.isDeleted) {
            throw new ApiError(UN_AUTHORIZED, i18n.__('SESSION_INVALID'));
        }
        if (req.user.sessionExpiry < new Date()) {
            throw new ApiError(UN_AUTHORIZED, i18n.__('SESSION_EXPIRED'));
        }
        res.status(OK).json(new ApiResponse(OK, {
            user: { id: req.user._id, email: req.user.email, role: req.user.role, expiresAt: req.user.sessionExpiry },
            sessionValid: true,
        }, i18n.__('SESSION_VALID')));
    } catch (error) {
        logger.error('Session validation error', {
            message: error.message,
            stack: error.stack,
        });
        throw error instanceof ApiError ? error : new ApiError(INTERNAL_SERVER_ERROR, i18n.__('SESSION_VALIDATION_FAILED'));
    }
});

authRouter.post('/refresh-token', async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) throw new ApiError(UN_AUTHORIZED, i18n.__('REFRESH_TOKEN'));

        let decoded;
        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        if (!decoded) throw new ApiError(UN_AUTHORIZED, i18n.__('INVALID_REFRESH_TOKEN'));

        if(decoded.exp < Date.now() / 1000) {
            clearAuthCookies(res);
            throw new ApiError(UN_AUTHORIZED, i18n.__('REFRESH_TOKEN_EXPIRED'));
        }
        let user;
        if (decoded.role === 'ADMIN') {
            user = await Admin.findById(decoded._id).select('email role status isDeleted');
        } else {
            user = await User.findById(decoded._id).select('email role status isDeleted');
        }
        if (!user || user.status === 'INACTIVE' || user.isDeleted) {
            clearAuthCookies(res)
            throw new ApiError(UN_AUTHORIZED, i18n.__('INVALID_REFRESH_TOKEN'));
        }
       
        const newAccessToken = await generateAccessToken(user, user.role);
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 2 * 60 * 60 * 1000, 
            path: '/',
        });

        user = await User.findByIdAndUpdate(user._id, { sessionExpiry: new Date(Date.now() + 2 * 60 * 60 * 1000) }, { new: true }).lean();

        const {newCsrfToken, expiresAt} = RevokeToken(req);
        
        res.status(OK).json(new ApiResponse(OK, {
            email: user.email,
            role: user.role,
            sessionExpiry: user.sessionExpiry,
            csrfToken: newCsrfToken,
            csrfExpiresAt: expiresAt,
        }, i18n.__('TOKEN_REFRESHED')));
    } catch (error) {
        error instanceof ApiError ? error : new ApiError(UN_AUTHORIZED, i18n.__('TOKEN_REFRESH_FAILED'));
    }
})

export default authRouter;