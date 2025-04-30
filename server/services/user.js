import User from "../models/user.js";
import { ApiError } from "../utils/ApiError.js";
import { generateAccessAndRefreshTokenForUser } from "../utils/generateToken.js";
import { BAD_REQUEST } from "../utils/apiResponseCode.js";
import { comparePasswordUsingBcrypt, Hashed_Password, isEmail } from "../utils/utilities.js";
import PostContent from "../models/postContent.js";
import ImageContent from "../models/imageContent.js";
import CarouselContent from "../models/carouselContent.js";
import DYKContent from "../models/dykContent.js";
import SavePosts from "../models/savePosts.js";
import { generateOTPForEmail, verifyEmailOTP } from "../utils/functions.js";
import { uploadOnClodinary } from "../utils/cloudinary.js";

const signup = async (inputs) => {
    let user;
    if (isEmail(inputs.email)) {
        if (!inputs.password) throw new ApiError(BAD_REQUEST, "Password is required")
        inputs.password = await Hashed_Password(inputs.password)
        user = await User.findOne({
            email: inputs.email,
            isDeleted: false,
            isEmailVerify: true
        })
        if (!user) {
            user = await User.findOne({
                email: inputs.email, isDeleted: false
            })
            if (user) {
                await User.deleteMany({
                    email: inputs.email,
                    isDeleted: false,
                    isEmailVerify: false,
                });
            }

            user = await User.create(inputs);
            await generateOTPForEmail(inputs.email)
            return user
        } else {
            throw new ApiError(BAD_REQUEST, "Email already exists")
        }
    }
}

const verifyOTP = async (inputs) => {
    let user;
    let subObj = {}

    if (isEmail(inputs.email)) {
        user = await User.findOne({
            email: inputs.email,
            isDeleted: false
        })
        if (!user) throw new ApiError(BAD_REQUEST, "Invalid email")
        let otp = await verifyEmailOTP(inputs.email, inputs.otp)

        if (otp === false) throw new ApiError(BAD_REQUEST, "Invalid OTP")
        subObj.isEmailVerify = true
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokenForUser(user._id)
    subObj.refreshToken = refreshToken
    user = await User.findByIdAndUpdate({ _id: user._id }, subObj).lean()

    user = await User.findById({ _id: user._id }).lean()

    user.accessToken = accessToken;
    user.type = "Bearer";
    user.refreshToken = refreshToken;

    return user;
}

const resendOTP = async (inputs) => {
    let user;
    if (Utils.isEmail(inputs.email)) {
        user = await User.findOne({ email: inputs.email, isDeleted: false })

        if (user) {
            await generateOTPForEmail(inputs.email)
        } else {
            throw new ApiError(BAD_REQUEST, i18n.__("INVALID_EMAIL"))
        }

    } else {
        user = await User.findOne({
            phone: inputs.phone,
            countryCode: inputs.countryCode,
            isDeleted: false,
        })
        if (user) {
            await generateOTPForPhone(inputs.countryCode, inputs.phone)
        } else {
            throw new ApiError(BAD_REQUEST, i18n.__("INVALID_PHONE"))
        }
    }
}

const forgetPassword = async (inputs) => {
    let user;
    if (Utils.isEmail(inputs.email)) {

        user = await User.findOne({
            email: inputs.email,
            isDeleted: false,
            isEmailVerify: true
        });
        if (!user) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_EMAIL"))

        let compare = Utils.comparePasswordAndConfirmpassword(inputs.newPassword, inputs.confirmPassword)
        if (compare == false) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_CREDENTIALS"))
        inputs.newPassword = await Utils.Hashed_Password(inputs.newPassword)

        user = await User.findByIdAndUpdate({ _id: user._id }, { password: inputs.newPassword })

        await generateOTPForEmail(user.email);
    }
}


const login = async (inputs) => {
    let user;
    if (isEmail(inputs.email)) {
        user = await User.findOne({ email: inputs.email, isDeleted: false }).select("+password")
        if (!user) throw new ApiError(BAD_REQUEST, "Invalid user")
        let compare = await comparePasswordUsingBcrypt(inputs.password, user.password);
        if (!compare) throw new ApiError(BAD_REQUEST, "Invalid password")

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokenForUser(user._id)
        user = await User.findByIdAndUpdate({ _id: user._id }, { refreshToken: refreshToken }).lean()
        user = await User.findById({ _id: user._id }).lean()

        user.accessToken = accessToken;
        user.type = "Bearer";
        user.refreshToken = refreshToken;
        return user
    }
}


const logout = async (user) => {
    return await User.findByIdAndUpdate({
        _id: user._id,
        isDeleted: false
    }, {
        $set: { refreshToken: "" }
    }, {
        new: true
    }).select("+refreshToken")

}

const userDetails = async (inputs, user, file) => {

    if ( !file) throw new ApiError(BAD_REQUEST, "Logo is required");

    let logoUrl = await uploadOnClodinary(file.path, "logo")
    if (!logoUrl) throw new ApiError(BAD_REQUEST, "Unable to upload logo")

    inputs.logo = logoUrl.secure_url
    inputs.isProfileCompleted = true
    
    let updateUser = await User.findOne({ _id: user._id , email: inputs.email, isEmailVerify: true, isDeleted: false })
    if (!updateUser) throw new ApiError(BAD_REQUEST, "User not found")    

    updateUser = await User.findByIdAndUpdate({ _id: updateUser._id }, inputs, { new: true })
    if (!updateUser) throw new ApiError(BAD_REQUEST, "Unable to update user details")

    updateUser = await User.findById({ _id: updateUser._id })
    return updateUser
}

const getUserProfile = async (user) => {
    const userProfile = await User.findById(user._id).lean(); 

    if (!userProfile) {
      throw new ApiError(BAD_REQUEST, 'User not found');
    }
    return userProfile;
}

const postContent = async (inputs, user) => {

    let postContent = await PostContent.findOne({ userId: user._id })
    if (postContent) {
        postContent = await PostContent.findByIdAndDelete({ _id: postContent._id }, { new: true })
        postContent = await PostContent.create({ userId: user._id, topics: inputs.topics })
    } else {
        postContent = await PostContent.create({ userId: user._id, topics: inputs.topics })
    }
    if (!postContent) throw new ApiError(BAD_REQUEST, "Unable to save topics")
    return postContent;
}

const getPostContent = async (user, postcontentid) => {

    let postContent = await PostContent.findById({ _id: postcontentid })
    if (!postContent) throw new ApiError(BAD_REQUEST, "No topics found")
    return postContent;
}

const saveImageContent = async (inputs, user) => {

    let postContent = await PostContent.findById({ _id: inputs.postContentId })
    if (!postContent) throw new ApiError(BAD_REQUEST, "No topics found")

    let topic = postContent.topics.find((topic) => topic === inputs.topic)
    if (!topic) throw new ApiError(BAD_REQUEST, "No topics found")

    let saveContent = await ImageContent.create(inputs)
    if (!saveContent) throw new ApiError(BAD_REQUEST, "Unable to save Content")
    return saveContent;

}


const saveCarouselContent = async (inputs, user) => {

    let postContent = await PostContent.findById({ _id: inputs.postContentId })
    if (!postContent) throw new ApiError(BAD_REQUEST, "No topics found")

    let topic = postContent.topics.find((topic) => topic === inputs.topic)
    if (!topic) throw new ApiError(BAD_REQUEST, "No topics found")

    let saveContent = await CarouselContent.create(inputs)
    if (!saveContent) throw new ApiError(BAD_REQUEST, "Unable to save Content")
    return saveContent;
}

const saveDYKContent = async (inputs, user) => {

    let postContent = await PostContent.findById({ _id: inputs.postContentId })
    if (!postContent) throw new ApiError(BAD_REQUEST, "No topics found")

    let topic = postContent.topics.find((topic) => topic === inputs.topic)
    if (!topic) throw new ApiError(BAD_REQUEST, "No topics found")

    let saveContent = await DYKContent.create(inputs)
    if (!saveContent) throw new ApiError(BAD_REQUEST, "Unable to save Content")
    return saveContent;
}

const savePosts = async (inputs, user) => {
    let postContent = await PostContent.findById({ _id: inputs.postContentId })
    if (!postContent) throw new ApiError(BAD_REQUEST, "No topics found")

    inputs.userId = user._id
    let post = await SavePosts.create(inputs)
    if (!post) throw new ApiError(BAD_REQUEST, "Unable to save posts")

    return post;
}

const getSavePosts = async (postContentId, user) => {

    console.log("postContentId", postContentId)
    const posts = await SavePosts.find({ postContentId: postContentId, userId: user._id })

    console.log("posts", posts)
    return posts
}

const getImageContent = async (contentId, user) => {

    let content = await ImageContent.findOne({ _id: contentId })
    if (!content) throw new ApiError(BAD_REQUEST, "No content found")
    return content;
}

const getCarouselContent = async (contentId, user) => {

    let content = await CarouselContent.findOne({ _id: contentId })
    if (!content) throw new ApiError(BAD_REQUEST, "No content found")
    return content;
}

const getDYKContent = async (contentId, user) => {

    let content = await DYKContent.findOne({ _id: contentId })
    if (!content) throw new ApiError(BAD_REQUEST, "No content found")
    return content;
}

const updatePost = async (postId, user, inputs) => {
    let update;
    update = await SavePosts.findByIdAndUpdate({ contentId: postId, userId: user._id, contentType: inputs.contentType }, { images: inputs.images }, { new: true })
    if (!update) throw new ApiError(BAD_REQUEST, "Unable to update posts")

    update = await SavePosts.findById({ _id: update._id })
    return update;
}


const UserServices = {
    signup,
    verifyOTP,
    resendOTP,
    forgetPassword,
    logout,
    login,
    postContent,
    getPostContent,
    saveImageContent,
    saveCarouselContent,
    saveDYKContent,
    savePosts,
    getSavePosts,
    getImageContent,
    getCarouselContent,
    getDYKContent,
    updatePost,
    userDetails,
    getUserProfile
}
export default UserServices;
