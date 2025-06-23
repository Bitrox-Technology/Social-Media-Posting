import UserServices from "../services/user.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { OK, CREATED } from "../utils/apiResponseCode.js"
import UserValidation from "../validations/user.js"
import i18n from "../utils/i18n.js"
import { RevokeToken } from "../utils/csrf.js"
import { setSecureCookies } from "../utils/utilities.js"


const Signup = async (req, res, next) => {
    try {
        await UserValidation.validateSignup(req.body)
        let user = await UserServices.signup(req.body)

        const { newCsrfToken, expiresAt } = RevokeToken(req);
        return res.status(CREATED).json(new ApiResponse(CREATED, { email: user.email, csrfToken: newCsrfToken, expiresAt: expiresAt }, i18n.__("OTP_SEND_SUCCESS")))
    } catch (error) {
        next(error)
    }

}

const SignupSigninByProvider = async (req, res, next) => {
    try {
        await UserValidation.validateSignupSigninByProvider(req.body)
        let user = await UserServices.signupSigninByProvider(req.body)
        setSecureCookies(res, user.accessToken, user.refreshToken)
        const { accessToken, refreshToken, ...userData } = user;
        const { newCsrfToken, expiresAt } = RevokeToken(req);
        return user.login === true ? res.status(OK).json(new ApiResponse(OK, { user: userData, csrfToken: newCsrfToken, expiresAt: expiresAt }, i18n.__("USER_LOGIN_SUCCESS"))) :
            res.status(CREATED).json(new ApiResponse(CREATED, { user: userData, csrfToken: newCsrfToken, expiresAt: expiresAt }, i18n.__("USER_CREATED_SUCCESS")))
    } catch (error) {
        next(error)
    }
}

const VerifyOTP = async (req, res, next) => {
    try {
        await UserValidation.validateOTP(req.body)
        let user = await UserServices.verifyOTP(req.body)
        setSecureCookies(res, user.accessToken, user.refreshToken)
        const { accessToken, refreshToken, ...userData } = user;
        const { newCsrfToken, expiresAt } = RevokeToken(req);
        return res.status(OK).json(new ApiResponse(OK, { user: userData, csrfToken: newCsrfToken, expiresAt: expiresAt }, i18n.__("USER_VERFIED_SUCCESS")))
    } catch (error) {
        next(error)
    }

}

const ResendOTP = async (req, res, next) => {
    try {
        await UserValidation.validateResendOTP(req.body);
        await UserServices.resendOTP(req.body);
        const { newCsrfToken, expiresAt } = RevokeToken(req);
        return res.status(OK).json(new ApiResponse(OK, { csrfToken: newCsrfToken, expiresAt: expiresAt }, i18n.__("OTP_RESENT_SUCCESS")))
    } catch (error) {
        next(error)
    }
}

const ForgetPassword = async (req, res, next) => {
    try {
        await UserValidation.validateforgetPassword(req.body)
        let user = await UserServices.forgetPassword(req.body)
        const { newCsrfToken, expiresAt } = RevokeToken(req);
        return res.status(OK).json(new ApiResponse(OK, { user, csrfToken: newCsrfToken, expiresAt: expiresAt }, i18n.__("PASSWORD_RESET_SUCCESS")))
    } catch (error) {
        next(error)
    }
}


const Logout = async (req, res, next) => {
    try {
        await UserServices.logout(req, res)
        return res.status(OK).json(new ApiResponse(OK, {}, i18n.__("USER_LOGOUT_SUCCESS")))
    } catch (error) {
        next(error)
    }
}

const UserDetails = async (req, res, next) => {
    try {
        await UserValidation.validateUserProfile(req.body)
        let user = await UserServices.userDetails(req.body, req.user, req.files)
        const { newCsrfToken, expiresAt } = RevokeToken(req);
        return res.status(OK).json(new ApiResponse(OK, { user, csrfToken: newCsrfToken, expiresAt: expiresAt }, i18n.__("USER_PROFILE_UPDATED_SUCCESS")))
    } catch (error) {
        next(error)
    }

}

const GetUserProfile = async (req, res, next) => {
    try {
        let user = await UserServices.getUserProfile(req.user)
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("PROFILE_FETECHED_SUCCESS")))
    } catch (error) {
        next(error)
    }

}

const Login = async (req, res, next) => {
    try {
        await UserValidation.validateLogin(req.body)
        let user = await UserServices.login(req.body)
        setSecureCookies(res, user.accessToken, user.refreshToken)
        const { accessToken, refreshToken, password, ...userData } = user;
        const { newCsrfToken, expiresAt } = RevokeToken(req);
        return res.status(OK).json(new ApiResponse(OK, { user: userData, csrfToken: newCsrfToken, expiresAt: expiresAt }, i18n.__("USER_LOGIN_SUCCESS")))
    } catch (error) {
        next(error)
    }
}

const PostContent = async (req, res, next) => {
    try {
        await UserValidation.validatePostContent(req.body)
        let user = await UserServices.postContent(req.body, req.user)
        const { newCsrfToken, expiresAt } = RevokeToken(req);
        return res.status(CREATED).json(new ApiResponse(CREATED, { user, csrfToken: newCsrfToken, expiresAt: expiresAt }, i18n.__("TOPIC_SAVED_SUCCESS")))
    } catch (error) {
        next(error)
    }
}

const GetPostContent = async (req, res, next) => {
    try {
        let user = await UserServices.getPostContent(req.user, req.params.postcontentid)
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("TOPIC_FETCHED_SUCEESS")))
    } catch (error) {
        next(error)
    }
}

const SaveImageContent = async (req, res, next) => {
    try {
        await UserValidation.validateImageContent(req.body)
        let user = await UserServices.saveImageContent(req.body, req.user)
        const { newCsrfToken, expiresAt } = RevokeToken(req);
        return res.status(CREATED).json(new ApiResponse(CREATED, { user, csrfToken: newCsrfToken, expiresAt: expiresAt }, i18n.__("IMAGE_CONTENT_SUCEESS")))
    } catch (error) {
        next(error)
    }
}

const SaveCarouselContent = async (req, res, next) => {
    try {
        await UserValidation.validateCarouselContent(req.body)
        let user = await UserServices.saveCarouselContent(req.body, req.user)
        const { newCsrfToken, expiresAt } = RevokeToken(req);
        return res.status(CREATED).json(new ApiResponse(CREATED, { user, csrfToken: newCsrfToken, expiresAt: expiresAt }, i18n.__("CAROUSEL_CONTENT_SUCEESS")))
    } catch (error) {
        next(error)
    }
}

const SaveDYKContent = async (req, res, next) => {
    try {
        await UserValidation.validateDYKContent(req.body)
        let user = await UserServices.saveDYKContent(req.body, req.user)
        const { newCsrfToken, expiresAt } = RevokeToken(req);
        return res.status(CREATED).json(new ApiResponse(CREATED, { user, csrfToken: newCsrfToken, expiresAt: expiresAt }, i18n.__("DYK_CONTENT_SUCEESS")))
    } catch (error) {
        next(error)
    }
}

const SavePosts = async (req, res, next) => {
    try {
        await UserValidation.validateSavePost(req.body)
        let user = await UserServices.savePosts(req.body, req.user)
        const { newCsrfToken, expiresAt } = RevokeToken(req);
        return res.status(CREATED).json(new ApiResponse(CREATED, { user, csrfToken: newCsrfToken, expiresAt: expiresAt }, i18n.__("POST_SAVED_SUCEESS")))
    } catch (error) {
        next(error)
    }
}

const GetSavePosts = async (req, res, next) => {
    try {
        let user = await UserServices.getSavePosts(req.params.postcontentid, req.user)
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("POSTS_FETCHED_SUCEESS")))
    } catch (error) {
        next(error)
    }
}

const GetImageContent = async (req, res, next) => {
    try {
        let user = await UserServices.getImageContent(req.params.contentid, req.user)
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("IMAGE_CONTENT_FETCHED_SUCEESS")))
    } catch (error) {
        next(error)
    }
}

const GetCarouselContent = async (req, res, next) => {
    try {
        let user = await UserServices.getCarouselContent(req.params.contentid, req.user)
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("CAROUSEL_CONTENT_FETCHED_SUCEESS")))
    } catch (error) {
        next(error)
    }
}

const GetDYKContent = async (req, res, next) => {
    try {
        let user = await UserServices.getDYKContent(req.params.contentid, req.user)
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("DYK_CONTENT_FETCHED_SUCEESS")))
    } catch (error) {
        next(error)
    }
}

const UpdatePost = async (req, res, next) => {
    try {
        await UserValidation.validateUpdatePost(req.body)
        let user = await UserServices.updatePost(req.params.postid, req.user, req.body)
        const { newCsrfToken, expiresAt } = RevokeToken(req);
        return res.status(OK).json(new ApiResponse(OK, { user, csrfToken: newCsrfToken, expiresAt: expiresAt }, i18n.__("UPDATE_POST_SUCEESS")))
    } catch (error) {
        next(error)
    }
}

const GetPendingTopics = async (req, res, next) => {
    try {
        let user = await UserServices.getPendingTopics(req.user)
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("TOPIC_FETCHED_SUCEESS")))
    } catch (error) {
        next(error)
    }
}

const UpdatePostTopicsStatus = async (req, res, next) => {
    try {
        let user = await UserServices.updatePostTopics(req.params.posttopicid, req.user, req.body)
        const { newCsrfToken, expiresAt } = RevokeToken(req);
        return res.status(OK).json(new ApiResponse(OK, { user, csrfToken: newCsrfToken, expiresAt: expiresAt }, i18n.__("UPDATE_POST_SUCEESS")))
    } catch (error) {
        next(error)
    }
}

const GetUserAllPosts = async (req, res, next) => {
    try {
        let user = await UserServices.getUserAllPosts(req.user)
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("USER_POST_SUCCESS")))
    } catch (error) {
        next(error)
    }
}

const GetUserPostDetailById = async (req, res, next) => {
    try {
        let user = await UserServices.getUserPostDetail(req.params, req.user)
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("USER_POST_DETAIL_SUCCESS")))
    } catch (error) {
        next(error)
    }
}

const GetUserScheduledPosts = async (req, res, next) => {
    try {
        let user = await UserServices.getUserScheduledPosts(req.user)
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("USER_SCHEDULED_POST_SUCCESS")))
    } catch (error) {
        next(error)
    }
}

const SaveProductInfo = async (req, res, next) => {
    try {
        await UserValidation.validateProductInfo(req.body)
        let user = await UserServices.saveProductInfo(req.body, req.user)
        const { newCsrfToken, expiresAt } = RevokeToken(req);
        return res.status(CREATED).json(new ApiResponse(CREATED, { user, csrfToken: newCsrfToken, expiresAt: expiresAt }, i18n.__("PRODUCT_INFO_SAVED_SUCCESS")))
    } catch (error) {
        next(error)
    }
}

const SaveBlog = async (req, res, next) => {
    try {
        await UserValidation.validateBlog(req.body)
        let user = await UserServices.saveBlog(req.body, req.user)
        const { newCsrfToken, expiresAt } = RevokeToken(req);
        return res.status(CREATED).json(new ApiResponse(CREATED, { user, csrfToken: newCsrfToken, expiresAt: expiresAt }, i18n.__("BLOG_POST_SAVED_SUCCESS")))
    } catch (error) {
        next(error)
    }
}

const GetBlogById = async (req, res, next) => {
    try {
        let user = await UserServices.getBlogById(req.params.blogid, req.user)
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("BLOG_POST_FETCHED_SUCCESS")))
    } catch (error) {
        next(error)
    }
}

const BlogPost = async (req, res, next) => {
    try {
        await UserValidation.validateBlogPost(req.body)
        let blog = await UserServices.scheduledContent(req.body, req.user)
        const { newCsrfToken, expiresAt } = RevokeToken(req);
        return res.status(CREATED).json(new ApiResponse(CREATED, { blog, csrfToken: newCsrfToken, expiresAt: expiresAt }, i18n.__("BLOG_POST_SUCCESSS")))
    } catch (error) {
        next(error)
    }
}

const GetAllBlogs = async (req, res, next) => {
    try {
        let blogs = await UserServices.getAllBlogs(req.user)
        return res.status(OK).json(new ApiResponse(OK, blogs, i18n.__("ALL_BLOGS_FETCHED_SUCCESS")))
    } catch (error) {
        next(error)
    }
}

const FestivalContent = async (req, res, next) => {
    try {
        await UserValidation.validateFestivalContent(req.body)
        let blog = await UserServices.festivalContent(req.body, req.file, req.user)
        const { newCsrfToken, expiresAt } = RevokeToken(req);
        return res.status(CREATED).json(new ApiResponse(CREATED, { blog, csrfToken: newCsrfToken, expiresAt: expiresAt }, i18n.__("SAVE_FESTIVAL_CONTENT_SUCCESSS")))
    } catch (error) {
        next(error)
    }
}


const GetFestivalContent = async (req, res, next) => {
    try {
        let blogs = await UserServices.getFestivalContent(req.user, req.params)
        return res.status(OK).json(new ApiResponse(OK, blogs, i18n.__("FESTIVAL_CONTENT_FETCHED_SUCCESS")))
    } catch (error) {
        next(error)
    }
}


const SaveProductContent = async (req, res, next) => {
    try {
        await UserValidation.validateProductContent(req.body)
        let product = await UserServices.productContent(req.body, req.files, req.user)
        const { newCsrfToken, expiresAt } = RevokeToken(req);
        return res.status(CREATED).json(new ApiResponse(CREATED, { product, csrfToken: newCsrfToken, expiresAt: expiresAt }, i18n.__("SAVE_PRODUCT_CONTENT_SUCCESSS")))
    } catch (error) {
        next(error)
    }
}

const GetProductContent = async (req, res, next) => {
    try {
        let product = await UserServices.getProductContent(req.user, req.params)
        return res.status(OK).json(new ApiResponse(OK, product, i18n.__("PRODUCT_CONTENT_FETCHED_SUCCESS")))
    } catch (error) {
        next(error)
    }
}
const WordpressAuth = async (req, res, next) => {
    try {
        await UserValidation.validateWordpressAuth(req.body)
        let user = await UserServices.wordpressAuth(req.body, req.user)
        const { newCsrfToken, expiresAt } = RevokeToken(req);
        return res.status(OK).json(new ApiResponse(OK, { user, csrfToken: newCsrfToken, expiresAt: expiresAt }, i18n.__("WORDPRESS_AUTH_SUCEESS")))

    } catch (error) {
        next(error)
    }
}

const GetWordpressAuth = async (req, res, next) => {
    try {
        let user = await UserServices.getWordpressAuth(req.user)
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("WORDPRESS_AUTH_FETCHED_SUCCESS")))
    } catch (error) {
        next(error)
    }
}

const CreateUserSubscription = async (req, res, next) => {
    try {
        await UserValidation.validateCreateUserSubscription(req.body)
        let user = await UserServices.createUserSubscription(req.body, req.user)
        const { newCsrfToken, expiresAt } = RevokeToken(req);
        return res.status(OK).json(new ApiResponse(OK, { user, csrfToken: newCsrfToken, expiresAt: expiresAt }, i18n.__("SUBSCRIPTION_CREATED_SUCCESS")))

    } catch (error) {
        next(error)
    }
}

const UserControllers = {
    Signup, VerifyOTP, ResendOTP, UserDetails, UpdatePostTopicsStatus, GetUserPostDetailById,
    ForgetPassword, Logout, GetPendingTopics, GetUserAllPosts, SignupSigninByProvider, GetAllBlogs,
    Login, SavePosts, PostContent, GetPostContent, SaveImageContent, SaveProductInfo, FestivalContent, GetFestivalContent,
    UpdatePost, SaveCarouselContent, SaveDYKContent, GetSavePosts, SaveBlog, GetBlogById, BlogPost, GetProductContent,
    GetImageContent, GetCarouselContent, GetDYKContent, GetUserProfile, GetUserScheduledPosts, SaveProductContent,
    WordpressAuth, GetWordpressAuth, CreateUserSubscription
}

export default UserControllers