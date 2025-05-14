import UserServices from "../services/user.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { OK } from "../utils/apiResponseCode.js"
import UserValidation from "../validations/user.js"

const Signup = async (req, res, next) => {
    try {
        await UserValidation.validateSignup(req.body)
        let user = await UserServices.signup(req.body)
        return res.status(OK).json(new ApiResponse(OK, {email: user.email}, "OTP send successfully"))
    } catch (error) {
        next(error)
    }

}

const VerifyOTP = async (req, res, next) => {
    try {
        await UserValidation.validateOTP(req.body)
        let user = await UserServices.verifyOTP(req.body)
        return res.status(OK).json(new ApiResponse(OK, user, "User verified successfully"))
    } catch (error) {
        next(error)
    }

}

const ResendOTP = async (req, res, next) => {
    try {
        await UserValidation.validateResendOTP(req.body);
        let user = await UserServices.resendOTP(req.body)
        return res.status(OK).json(new ApiResponse(OK, user, "OTP resent successfully"))
    } catch (error) {
        next(error)
    }
}

const ForgetPassword = async (req, res, next) => {
    try {
        await UserValidation.validateforgetPassword(req.body)
        let user = await UserServices.forgetPassword(req.body)
        return res.status(OK).json(new ApiResponse(OK, user, "Password reset successfully"))
    } catch (error) {
        next(error)
    }
}


const Logout = async (req, res, next) => {
    try {
        let user = await UserServices.logout(req.user)
        return res.status(OK).json(new ApiResponse(OK, user, "User Logout Successfully"))
    } catch (error) {
        next(error)
    }
}

const UserDetails = async (req, res, next) => {
    console.log("UserDetails", req.body, req.user, req.files)
    try {
        await UserValidation.validateUserProfile(req.body)
        let user = await UserServices.userDetails(req.body, req.user, req.files)
        return res.status(OK).json(new ApiResponse(OK, user, "User details saved successfully"))
    } catch (error) {
        next(error)
    }

}

const GetUserProfile = async (req, res, next) => {
    try {
        let user = await UserServices.getUserProfile(req.user)
        return res.status(OK).json(new ApiResponse(OK, user, "User profile fetched successfully"))
    } catch (error) {
        next(error)
    }

}

const Login = async (req, res, next) => {
    try {
        await UserValidation.validateLogin(req.body)
        let user = await UserServices.login(req.body)
        return res.status(OK).json(new ApiResponse(OK, user, "User Login Successfully"))
    } catch (error) {
        next(error)
    }
}

const PostContent = async (req, res, next) => {
    try {
        await UserValidation.validatePostContent(req.body)
        let user = await UserServices.postContent(req.body, req.user)
        return res.status(OK).json(new ApiResponse(OK, user, "Topics saved Successfully"))
    } catch (error) {
        next(error)
    }
}

const GetPostContent = async (req, res, next) => {
    try {
        let user = await UserServices.getPostContent(req.user, req.params.postcontentid)
        return res.status(OK).json(new ApiResponse(OK, user, "Topics fetched Successfully"))
    } catch (error) {
        next(error)
    }
}

const SaveImageContent = async (req, res, next) => {
    try {
        await UserValidation.validateImageContent(req.body)
        let user = await UserServices.saveImageContent(req.body, req.user)
        return res.status(OK).json(new ApiResponse(OK, user, "Image content saved Successfully"))
    } catch (error) {
        next(error)
    }
}

const SaveCarouselContent = async (req, res, next) => {
    try {
        await UserValidation.validateCarouselContent(req.body)
        let user = await UserServices.saveCarouselContent(req.body, req.user)
        return res.status(OK).json(new ApiResponse(OK, user, "Image content saved Successfully"))
    } catch (error) {
        next(error)
    }
}

const SaveDYKContent = async (req, res, next) => {
    try {
        await UserValidation.validateDYKContent(req.body)
        let user = await UserServices.saveDYKContent(req.body, req.user)
        return res.status(OK).json(new ApiResponse(OK, user, "Do you Know content saved Successfully"))
    } catch (error) {
        next(error)
    }
}

const SavePosts = async (req, res, next) => {
    try {
        await UserValidation.validateSavePost(req.body)
        let user = await UserServices.savePosts(req.body, req.user)
        return res.status(OK).json(new ApiResponse(OK, user, "Post saved Successfully"))
    } catch (error) {
        next(error)
    }
}

const GetSavePosts = async (req, res, next) => {
    try {
        let user = await UserServices.getSavePosts(req.params.postcontentid, req.user)
        return res.status(OK).json(new ApiResponse(OK, user, "Posts fetched Successfully"))
    } catch (error) {
        next(error)
    }
}

const GetImageContent = async (req, res, next) => {
    try {
        let user = await UserServices.getImageContent(req.params.contentid, req.user)
        return res.status(OK).json(new ApiResponse(OK, user, "Content fetched Successfully"))
    } catch (error) {
        next(error)
    }
}

const GetCarouselContent = async (req, res, next) => {
    try {
        let user = await UserServices.getCarouselContent(req.params.contentid, req.user)
        return res.status(OK).json(new ApiResponse(OK, user, "Content fetched Successfully"))
    } catch (error) {
        next(error)
    }
}

const GetDYKContent = async (req, res, next) => {
    try {
        let user = await UserServices.getDYKContent(req.params.contentid, req.user)
        return res.status(OK).json(new ApiResponse(OK, user, "Content fetched Successfully"))
    } catch (error) {
        next(error)
    }
}

const UpdatePost = async (req, res, next) => {
    try {
        await UserValidation.validateUpdatePost(req.body)
        let user = await UserServices.updatePost(req.params.postid, req.user, req.body)
        return res.status(OK).json(new ApiResponse(OK, user, "Content fetched Successfully"))
    } catch (error) {
        next(error)
    }
}

const GetPendingTopics = async (req, res, next) => {
    try {
        let user = await UserServices.getPendingTopics(req.user)
        return res.status(OK).json(new ApiResponse(OK, user, "Topics fetched Successfully"))
    } catch (error) {
        next(error)
    }
}

const UpdatePostTopicsStatus = async (req, res, next) => {
    try {
        let user = await UserServices.updatePostTopics(req.params.posttopicid, req.user, req.body)
        return res.status(OK).json(new ApiResponse(OK, user, "Status Update Successfully"))
    } catch (error) {
        next(error)
    }
}

const GetUserAllPosts = async(req, res, next) => {
     try {
        let user = await UserServices.getUserAllPosts(req.user)
        return res.status(OK).json(new ApiResponse(OK, user, "Posts fetched Successfully"))
    } catch (error) {
        next(error)
    }
}
const UserControllers = {
    Signup, VerifyOTP, ResendOTP, UserDetails, UpdatePostTopicsStatus,
    ForgetPassword, Logout, GetPendingTopics, GetUserAllPosts,
    Login, SavePosts, PostContent, GetPostContent, SaveImageContent,
    UpdatePost, SaveCarouselContent, SaveDYKContent, GetSavePosts,
    GetImageContent, GetCarouselContent, GetDYKContent, GetUserProfile
}

export default UserControllers