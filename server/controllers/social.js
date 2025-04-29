import { ApiResponse } from "../utils/ApiResponse.js"
import { OK } from "../utils/apiResponseCode.js"
import SocialServices from "../services/social.js"

const LinkedInAuthentication = async (req, res, next) => {
    try {
        let result =  SocialServices.linkedInAuthentication(req.body)
        console.log("result", result)
        return res.redirect(result)
    } catch (error) {
        next(error)
    }

}

const LinkedInCallback = async (req, res, next) => {
    console.log("req.query", req.query)
    try {
        let result =  SocialServices.linkedInCallback(req.query.code)
        return res.status(OK).json(new ApiResponse(OK, result, "LinkedIn Callback URL generated successfully"))
    } catch (error) {
        next(error)
    }

}


const LinkedInPost = async (req, res, next) => {
    try {
        let result =  SocialServices.linkedInPost( req.body)
        return res.status(OK).json(new ApiResponse(OK, result, "LinkedIn Post URL generated successfully"))
    } catch (error) {
        next(error)
    }

}



const SocailMediaControllers = { LinkedInAuthentication, LinkedInCallback, LinkedInPost }
export default SocailMediaControllers;