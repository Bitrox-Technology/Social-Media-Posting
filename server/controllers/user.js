import { login, signup } from "../services/user.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { OK } from "../utils/apiResponseCode.js"
import { validateSignup, validateLogin } from "../validations/user.js"

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


const SavePosts = async (req, res, next) => {
    try {
        let user = await login(req.body)
        return res.status(OK).json(new ApiResponse(OK, user, "User Login Successfully" ))
    } catch (error) {
        next(error)
    }
}


export { Signup, Login, SavePosts }