import { ApiResponse } from "../utils/ApiResponse.js"
import { OK } from "../utils/apiResponseCode.js"
import SocialServices from "../services/social.js"

const LinkedInAuthentication = async (req, res, next) => {
    try {
        let result = await SocialServices.linkedInAuthentication()
        return res.status(200).json(new ApiResponse(OK, result, "LinkedIn Authentication URL generated successfully"))
    } catch (error) {
        next(error)
    }

}

const LinkedInCallback = async (req, res, next) => {
    console.log("LinkedIn Callback URL", req.query)
    try {
        let result = await SocialServices.linkedInCallback(req.query)
        return res.status(OK).json(new ApiResponse(OK, result, "LinkedIn Callback URL generated successfully"))
    } catch (error) {
        next(error)
    }

}


const LinkedInPost = async (req, res, next) => {
    try {
        let result = await SocialServices.linkedInPost(req.body)
        return res.status(OK).json(new ApiResponse(OK, result, "LinkedIn Post URL generated successfully"))
    } catch (error) {
        next(error)
    }

}

const FacebookAuthentication = async (req, res, next) => {
    try {
        let result = await SocialServices.facebookAuthentication()
         return res.status(200).json(new ApiResponse(OK, result, "Facebook Authentication URL generated successfully"))
    } catch (error) {
        next(error)
    }

}

const FacebookCallback = async (req, res, next) => {
    try {
        let result =await SocialServices.facebookCallback(req.query)
        return res.status(OK).json(new ApiResponse(OK, result, "Facebook Callback URL generated successfully"))
    } catch (error) {
        next(error)
    }

}


const FacebookPost = async (req, res, next) => {
    try {
        let result =await SocialServices.facebookPost(req.body)
        return res.status(OK).json(new ApiResponse(OK, result, "Facebook Post URL generated successfully"))
    } catch (error) {
        next(error)
    }

}

const InstagramAuthentication = async (req, res, next) => {
    try {
        let result = await SocialServices.instagramAuthentication()
         return res.status(200).json(new ApiResponse(OK, result, "Instagram Authentication URL generated successfully"))
    } catch (error) {
        next(error)
    }

}

const InstagramCallback = async (req, res, next) => {

    console.log("Query", req.query)
    try {
        let result =await SocialServices.instagramCallback(req.query)
        return res.status(OK).json(new ApiResponse(OK, result, "Instagram Callback URL generated successfully"))
    } catch (error) {
        next(error)
    }

}

const GetIGAccount = async (req, res, next) => {
    try {
        let result = await SocialServices.getIGAccount(pageId, pageAccessToken)
        return res.status(OK).json(new ApiResponse(OK, result, "Instagram Account fetched successfully"))
    } catch (error) {
        next(error)
    }

}


const InstagramCreateMedia = async (req, res, next) => {
    try {
        let result =await SocialServices.instagramCreateMedia(req.body)
        return res.status(OK).json(new ApiResponse(OK, result, "Instagram Media created successfully"))
    } catch (error) {
        next(error)
    }

}

const InstagramPublishMedia = async (req, res, next) => {
    try {
        let result =await SocialServices.instagramPublishMedia(req.body)
        return res.status(OK).json(new ApiResponse(OK, result, "Instagram Media published successfully"))
    } catch (error) {
        next(error)
    }

}


const SocailMediaControllers = {
    LinkedInAuthentication, LinkedInCallback, LinkedInPost, FacebookAuthentication, InstagramAuthentication, InstagramCallback,
    FacebookCallback, FacebookPost, GetIGAccount, InstagramCreateMedia, InstagramPublishMedia
}
export default SocailMediaControllers;