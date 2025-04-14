import User from "../models/user.js";
import { ApiError } from "../utils/apiError.js";
import { generateAccessAndRefreshTokenForUser } from "../utils/generateToken.js";
import { BAD_REQUEST } from "../utils/apiResponseCode.js";
import { comparePasswordUsingBcrypt, Hashed_Password, isEmail } from "../utils/utilities.js";
import PostContent from "../models/postContent.js";
import ImageContent from "../models/imageContent.js";

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

const postContent = async (inputs, user) => {
    let existingUser = await User.findOne({ _id: user._id })
    if (!existingUser) throw new ApiError(BAD_REQUEST, "Invalid user")

    let postContent = await PostContent.findOne({ userId: user._id })
    if (postContent) {
        postContent = await PostContent.findByIdAndUpdate({ _id: postContent._id }, { topics: inputs.topics }, { new: true })
    } else {
        postContent = await PostContent.create({ userId: user._id, topics: inputs.topics })
    }
    if (!postContent) throw new ApiError(BAD_REQUEST, "Unable to save topics")
    return postContent;
}

const getPostContent = async (user, postcontentid) => {
    let existingUser = await User.findOne({ _id: user._id })
    if (!existingUser) throw new ApiError(BAD_REQUEST, "Invalid user")

    let postContent = await PostContent.findById({ _id: postcontentid })
    if (!postContent) throw new ApiError(BAD_REQUEST, "No topics found")
    return postContent;
}

const saveImageContent = async (inputs, user) => {
    let existingUser = await User.findOne({ _id: user._id })
    if (!existingUser) throw new ApiError(BAD_REQUEST, "Invalid user")

    let postContent = await PostContent.findById({ _id: inputs.postContentId })
    if (!postContent) throw new ApiError(BAD_REQUEST, "No topics found")

    let topic = postContent.topics.find((topic) => topic === inputs.topic)
    if (!topic) throw new ApiError(BAD_REQUEST, "No topics found")
    
    let saveContent= await ImageContent.create(inputs)
    if (!saveContent) throw new ApiError(BAD_REQUEST, "Unable to save topics")
    return postContent;

}

export {
    signup,
    login,
    postContent,
    getPostContent,
    saveImageContent
}
