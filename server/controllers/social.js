import { ApiResponse } from "../utils/ApiResponse.js"
import { OK } from "../utils/apiResponseCode.js"
import SocialServices from "../services/social.js"

const LinkedInAuthentication = async (req, res, next) => {
    try {
        let result = SocialServices.linkedInAuthentication()
        return res.redirect(result)
    } catch (error) {
        next(error)
    }

}

const LinkedInCallback = async (req, res, next) => {
    try {
        let result = SocialServices.linkedInCallback(req.query)
        return res.status(OK).json(new ApiResponse(OK, result, "LinkedIn Callback URL generated successfully"))
    } catch (error) {
        next(error)
    }

}


const LinkedInPost = async (req, res, next) => {
    try {
        let result = SocialServices.linkedInPost(req.body)
        return res.status(OK).json(new ApiResponse(OK, result, "LinkedIn Post URL generated successfully"))
    } catch (error) {
        next(error)
    }

}

const FacebookAuthentication = async (req, res, next) => {
    try {
        let result = SocialServices.facebookAuthentication()
        return res.redirect(result)
    } catch (error) {
        next(error)
    }

}

const FacebookCallback = async (req, res, next) => {
    try {
        let result = SocialServices.facebookCallback(req.query)
        return res.status(OK).json(new ApiResponse(OK, result, "Facebook Callback URL generated successfully"))
    } catch (error) {
        next(error)
    }

}


const FacebookPost = async (req, res, next) => {
    try {
        let result = SocialServices.facebookPost(req.body)
        return res.status(OK).json(new ApiResponse(OK, result, "Facebook Post URL generated successfully"))
    } catch (error) {
        next(error)
    }

}

const GetIGAccount = async (req, res, next) => {
    try {
        let result = SocialServices.getIGAccount(pageId, pageAccessToken)
        return res.status(OK).json(new ApiResponse(OK, result, "Instagram Account fetched successfully"))
    } catch (error) {
        next(error)
    }

}


const InstagramCreateMedia = async (req, res, next) => {
    try {
        let result = SocialServices.instagramCreateMedia(req.body)
        return res.status(OK).json(new ApiResponse(OK, result, "Instagram Media created successfully"))
    } catch (error) {
        next(error)
    }

}

const InstagramPublishMedia = async (req, res, next) => {
    try {
        let result = SocialServices.instagramPublishMedia(req.body)
        return res.status(OK).json(new ApiResponse(OK, result, "Instagram Media published successfully"))
    } catch (error) {
        next(error)
    }

}


const SocailMediaControllers = {
    LinkedInAuthentication, LinkedInCallback, LinkedInPost, FacebookAuthentication,
    FacebookCallback, FacebookPost, GetIGAccount, InstagramCreateMedia, InstagramPublishMedia
}
export default SocailMediaControllers;