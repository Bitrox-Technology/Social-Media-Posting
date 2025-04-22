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
import mongoose from "mongoose";

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
            return user
        } else {
            throw new ApiError(BAD_REQUEST, "Email already exists")
        }
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

const userDetails = async (inputs, user, files) => {
    const avatar = req.files['avatar'] 
    const logo = req.files['logo'] 
    if (!avatar && !logo) throw new ApiError(BAD_REQUEST, "Avatar and Logo are required")
    
    let avatarUrl =  await uploadOnCloudinary(avatar[0].path, "avatar")
    if (!avatarUrl) throw new ApiError(BAD_REQUEST, "Unable to upload avatar")
    
    let logoUrl =  await uploadOnCloudinary(logo[0].path, "logo")
    if (!logoUrl) throw new ApiError(BAD_REQUEST, "Unable to upload logo")

    inputs.avatar = avatarUrl
    inputs.logo = logoUrl
    inputs.isProfileCompleted = true

    let updateUser = await User.findByIdAndUpdate({ _id: user._id }, inputs, { new: true })
    if (!upload) throw new ApiError(BAD_REQUEST, "Unable to update user details")
    
    updateUser = await User.findById({ _id: updateUser._id })
    return updateUser
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


export {
    signup,
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
    userDetails
}
