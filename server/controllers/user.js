import { getPostContent, login, postContent, signup, saveImageContent } from "../services/user.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { OK } from "../utils/apiResponseCode.js"
import { validateSignup, validateLogin, validatePostContent, validateImageContent } from "../validations/user.js"

const Signup = async (req, res, next) => {
    try {
        await validateSignup(req.body)
        let user = await signup(req.body)
        return res.status(OK).json(new ApiResponse(OK, user, "User Created Successfully"))
    } catch (error) {
        next(error)
    }

}

const Login = async (req, res, next) => {
    try {
        await validateLogin(req.body)
        let user = await login(req.body)
        return res.status(OK).json(new ApiResponse(OK, user, "User Login Successfully" ))
    } catch (error) {
        next(error)
    }
}

const PostContent = async (req, res, next) => {
    try {
        await validatePostContent(req.body)
        let user = await postContent(req.body, req.user) 
        return res.status(OK).json(new ApiResponse(OK, user, "Topics saved Successfully" ))
    } catch (error) {
        next(error)
    }
}

const GetPostContent = async (req, res, next) => {
    try {
        let user = await getPostContent(req.user, req.params.postcontentid) 
        return res.status(OK).json(new ApiResponse(OK, user, "Topics fetched Successfully" ))
    } catch (error) {
        next(error)
    }
}

const SaveImageContent = async (req, res, next) => {
    try {
        await validateImageContent(req.body)
        let user = await saveImageContent(req.body, req.user) 
        return res.status(OK).json(new ApiResponse(OK, user, "Image content saved Successfully" ))
    } catch (error) {
        next(error)
    }
}



const SavePosts = async (req, res, next) => {
    try {
        let user = await login(req.body)
        return res.status(OK).json(new ApiResponse(OK, user, "User Login Successfully" ))
    } catch (error) {
        next(error)
    }
}




export { Signup, Login, SavePosts, PostContent, GetPostContent, SaveImageContent }