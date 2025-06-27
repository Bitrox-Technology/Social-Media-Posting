import { getAuthUrl, getTokens } from "../middlewares/google.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { BAD_REQUEST, OK } from "../utils/apiResponseCode.js";
import i18n from "../utils/i18n.js";

const GoogleAuth = async (req, res, next) => {
    try {
        const authUrl = getAuthUrl();
        return res.status(OK).json(new ApiResponse(OK, authUrl, i18n.__("GOOGLE_AUTHURL_SUCCESS")));
    } catch (error) {
        next(error)
    }
}

const GoogleAuthOAuth2Callback = async (req, res, next) => {
    try {
        const { code } = req.query;
        if (!code) {
            throw new ApiError(BAD_REQUEST, "Authorization code is required");
        }
        const tokens = await getTokens(code);
        return res.status(OK).json(new ApiResponse(OK, tokens, i18n.__("GOOGLE_AUTH_SUCCESS")));
    } catch (error) {
        next(error);
    }
}


const GoogleBusinessPost = async (req, res, next) => {
    try {
        // Implement your logic for handling Google Business Profile posts here
        // This is a placeholder function
        res.status(OK).json(new ApiResponse(OK, {}, i18n.__("GOOGLE_BUSINESS_POST_SUCCESS")));
    } catch (error) {
        next(error);
    }
}
const GoogleControllers = {
    GoogleAuth, 
    GoogleAuthOAuth2Callback,
    GoogleBusinessPost
};
export default GoogleControllers;