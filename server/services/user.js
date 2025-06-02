import mongoose from "mongoose";
import User from "../models/user.js";
import { ApiError } from "../utils/ApiError.js";
import { generateAccessAndRefreshTokenForUser } from "../utils/generateToken.js";
import { BAD_REQUEST, CONFLICT, INTERNAL_SERVER_ERROR } from "../utils/apiResponseCode.js";
import { clearAuthCookies, comparePasswordUsingBcrypt, Hashed_Password, isEmail } from "../utils/utilities.js";
import PostTopic from "../models/postTopics.js";
import ImageContent from "../models/imageContent.js";
import CarouselContent from "../models/carouselContent.js";
import DYKContent from "../models/dykContent.js";
import SavePosts from "../models/savePosts.js";
import { generateOTPForEmail, verifyEmailOTP } from "../utils/functions.js";
import { uploadOnClodinary } from "../utils/cloudinary.js";
import i18n from "../utils/i18n.js";
import UserScheduledTask from "../models/userSchesuledTask.js";

const signup = async (inputs) => {
    let user;
    if (isEmail(inputs.email)) {
        if (!inputs.password) throw new ApiError(BAD_REQUEST, "Password is required")
        inputs.password = await Hashed_Password(inputs.password)
        user = await User.findOne({
            email: inputs.email,
            isDeleted: false,
        })

        if (user?.isEmailVerify) throw new ApiError(CONFLICT, i18n.__("EMAIL_EXISTS"));

        if (user) {
            await User.deleteMany({
                email: inputs.email,
                isDeleted: false,
                isEmailVerify: false,
            });
        }

        if (!user) {
            user = await User.create(inputs);
            generateOTPForEmail(inputs.email, user.role)
        }
        return user
    } else {
        throw new ApiError(CONFLICT, i18n.__("EMAIL_EXISTS"))
    }
}

const signupSigninByProvider = async (inputs) => {
    let user;
    let login = false
    if (isEmail(inputs.email)) {
        user = await User.findOne({
            email: inputs.email,
            isDeleted: false,
            provider: inputs.provider,
            uid: inputs.uid
        })

        if (user) {
            login = true
        } else {
            user = await User.create(inputs);
        }
        const { accessToken, refreshToken } = generateAccessAndRefreshTokenForUser(user)
        const sessionExpiry = Date.now() + parseInt(process.env.ACCESS_TOKEN_EXPIRY) * 1000;
        user = await User.findByIdAndUpdate({_id: user._id}, {refreshToken: refreshToken, sessionExpiry: sessionExpiry}, {new: true})
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        user.login = login;
        return user;
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
        if (!user) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_EMAIL"))
        let otp = await verifyEmailOTP(inputs.email, inputs.otp)

        if (otp === false) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_OTP"))
        subObj.isEmailVerify = true
    }
    
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokenForUser(user)
    subObj.refreshToken = refreshToken
    subObj.sessionExpiry = Date.now() + parseInt(process.env.ACCESS_TOKEN_EXPIRY) * 1000;
    user = await User.findByIdAndUpdate({ _id: user._id }, subObj, { new: true }).lean()
    user.accessToken = accessToken;
    user.refreshToken = refreshToken; 
    return user;
}

const resendOTP = async (inputs) => {
    let user;
    if (isEmail(inputs.email)) {
        user = await User.findOne({ email: inputs.email, isDeleted: false })
        if (user) {
            generateOTPForEmail(inputs.email)
        } else {
            throw new ApiError(BAD_REQUEST, i18n.__("INVALID_EMAIL"))
        }
    }
}

const forgetPassword = async (inputs) => {
    let user;
    if (isEmail(inputs.email)) {
        user = await User.findOne({
            email: inputs.email,
            isDeleted: false,
            isEmailVerify: true
        });
        if (!user) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_EMAIL"))
        inputs.newPassword = await Hashed_Password(inputs.newPassword)
        user = await User.findByIdAndUpdate({ _id: user._id }, { password: inputs.newPassword }, { new: true }).lean()
        generateOTPForEmail(user.email);
    }
}


const login = async (inputs) => {
    let user;
    if (isEmail(inputs.email)) {
        user = await User.findOne({
            email: inputs.email,
            isEmailVerify: true,
            isDeleted: false,
        }).select('+password').lean();
        if (!user) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_USER"))
        let compare = await comparePasswordUsingBcrypt(inputs.password, user.password);
        if (!compare) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_PASSWORD"))
        const {accessToken, refreshToken} = await generateAccessAndRefreshTokenForUser(user)
        let sessionExpiry = Date.now() + parseInt(process.env.ACCESS_TOKEN_EXPIRY) * 1000;
        user = await User.findByIdAndUpdate({ _id: user._id }, {refreshToken: refreshToken, sessionExpiry: sessionExpiry}, { new: true }).lean()
        
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        return user
    }
}


const logout = async (req, res) => {
    clearAuthCookies(res)
    await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: '', sessionExpiry: '' } },
      { new: true }
    ).lean();


    return new Promise((resolve, reject) => {
        req.session.destroy((err) => {
            if (err) {
                logger.error('Session destruction failed', {
                    error: err.message,
                    sessionID: req.sessionID || 'unknown',
                });
                return reject(new ApiError(INTERNAL_SERVER_ERROR, i18n.__('SESSION_DESTROY_FAILED')));
            }
            resolve();
        });
    });

}

const userDetails = async (inputs, user, files) => {
    if (files && files.length > 0) {
        for (const file of files) {
            if (file.fieldname === 'logo') {
                const result = await uploadOnClodinary(file.path, 'logo');
                if (!result || !result.secure_url) throw new ApiError(BAD_REQUEST, 'Unable to upload logo');
                inputs.logo = result.secure_url;

            } else if (file.fieldname.startsWith('productCategories[')) {

                const match = file.fieldname.match(/productCategories\[(\d+)\]\[image\]/);
                if (match) {
                    const index = parseInt(match[1], 10);
                    const result = await uploadOnClodinary(file.path, `productCategories_${index}`);
                    if (!result || !result.secure_url) {
                        throw new ApiError(BAD_REQUEST, `Unable to upload product image for index ${index}`);
                    }
                    inputs.productCategories[index].image = result.secure_url;
                }
            }
        }
    }

    inputs.isProfileCompleted = true

    let updatedUser = await User.findOneAndUpdate(
        { _id: user._id, isEmailVerify: true, isDeleted: false },
        inputs,
        { new: true, runValidators: true }
    );
    if (!updatedUser) {
        throw new ApiError(BAD_REQUEST, 'User not found or invalid conditions');
    }
    return updatedUser;
}

const getUserProfile = async (user) => {
    const userProfile = await User.findById(user._id).lean();

    if (!userProfile) {
        throw new ApiError(BAD_REQUEST, 'User not found');
    }
    return userProfile;
}


const postContent = async (inputs, user) => {

    let postContent = await PostTopic.findOne({ userId: user._id })
    if (postContent) {
        postContent = await PostTopic.findByIdAndUpdate({ _id: postContent._id }, { topics: inputs.topics }, { new: true })
    } else {
        postContent = await PostTopic.create({ userId: user._id, topics: inputs.topics })
    }
    if (!postContent) throw new ApiError(BAD_REQUEST, "Unable to save topics")
    return postContent;
}

const getPendingTopics = async (user) => {
    const postContent = await PostTopic.findOne({ userId: user._id })
    return postContent;
}

const getPostContent = async (user, postcontentid) => {

    const postContent = await PostTopic.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(postcontentid),
                userId: new mongoose.Types.ObjectId(user._id)
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'userData'
            }
        },
        {
            $unwind: {
                path: '$userData',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                status: 1,
                topics: 1,
                userId: 1,
                logo: '$userData.logo', // Assuming logo is a field in the user document
                _id: 1
            }
        }
    ]);

    if (!postContent || postContent.length === 0) {
        throw new ApiError(BAD_REQUEST, "No post content found");
    }

    return postContent[0];
}

const saveImageContent = async (inputs, user) => {

    let postContent = await PostTopic.findById({ _id: inputs.postContentId, userId: user._id })
    if (!postContent) throw new ApiError(BAD_REQUEST, "No topics found")

    let topic = postContent.topics.find((topic) => topic === inputs.topic)
    if (!topic) throw new ApiError(BAD_REQUEST, "No topics found")

    let saveContent = await ImageContent.create(inputs)
    if (!saveContent) throw new ApiError(BAD_REQUEST, "Unable to save Content")
    return saveContent;

}


const saveCarouselContent = async (inputs, user) => {

    let postContent = await PostTopic.findById({ _id: inputs.postContentId, userId: user._id })
    if (!postContent) throw new ApiError(BAD_REQUEST, "No topics found")

    let topic = postContent.topics.find((topic) => topic === inputs.topic)
    if (!topic) throw new ApiError(BAD_REQUEST, "No topics found")

    let saveContent = await CarouselContent.create(inputs)
    if (!saveContent) throw new ApiError(BAD_REQUEST, "Unable to save Content")
    return saveContent;
}

const saveDYKContent = async (inputs, user) => {

    let postContent = await PostTopic.findById({ _id: inputs.postContentId, userId: user._id })
    if (!postContent) throw new ApiError(BAD_REQUEST, "No topics found")

    let topic = postContent.topics.find((topic) => topic === inputs.topic)
    if (!topic) throw new ApiError(BAD_REQUEST, "No topics found")

    let saveContent = await DYKContent.create(inputs)
    if (!saveContent) throw new ApiError(BAD_REQUEST, "Unable to save Content")
    return saveContent;
}

const savePosts = async (inputs, user) => {
    let postContent = await PostTopic.findById({ _id: inputs.postContentId, userId: user._id })
    if (!postContent) throw new ApiError(BAD_REQUEST, "No topics found")

    inputs.userId = user._id
    let post = await SavePosts.create(inputs)
    if (!post) throw new ApiError(BAD_REQUEST, "Unable to save posts")

    return post;
}

const getSavePosts = async (postContentId, user) => {

    const topic = await PostTopic.findOne({ _id: postContentId, status: 'success', userId: user._id });
    if (!topic) {
        console.log('No topic found');
        return [];
    }

    // Find saved posts that match user, postContentId, topic, and one of the topics in PostTopic.topics
    const savedPosts = await SavePosts.find({
        postContentId: postContentId,
        userId: user._id,
        topic: { $in: topic.topics } // Match any topic from PostTopic.topics
    });


    // Array to store final results
    const results = [];

    // Process each saved post
    for (const savedPost of savedPosts) {
        let contentData = {};
        // Fetch content based on contentType
        if (savedPost.contentType === 'ImageContent') {
            const content = await ImageContent.findById(savedPost.contentId, 'content hashtags');
            if (content && content.content && content.hashtags) {
                contentData = {
                    title: content.content.title || '',
                    description: content.content.description || '',
                    hashtags: content.hashtags || []
                };
            }
        } else if (savedPost.contentType === 'DYKContent') {
            const content = await DYKContent.findById(savedPost.contentId, 'content hashtags');
            if (content && content.content && content.hashtags) {
                contentData = {
                    title: content.content.title || '',
                    description: content.content.fact || '', // Use fact as description for DYKContent
                    hashtags: content.hashtags || []
                };
            }
        } else if (savedPost.contentType === 'CarouselContent') {
            const content = await CarouselContent.findById(savedPost.contentId, 'content');
            if (content && content.content && content.content.length >= 6) {
                // Extract title, description, hashtags from content[5] (sixth position)
                contentData = {
                    title: content.content[5].title || '',
                    description: content.content[5].description || '',
                    hashtags: content.content[5].hashtags || []
                };
            }
        }

        if (Object.keys(contentData).length > 0) {
            results.push({
                _id: savedPost._id,
                images: savedPost.images || [],
                title: contentData.title,
                description: contentData.description,
                hashtags: contentData.hashtags,
                contentType: savedPost.contentType,
                topic: savedPost.topic || '',
                status: savedPost.status || ''
            });
        }
    }

    return results;
}


const getUserAllPosts = async (user) => {
    const savedPosts = await SavePosts.find({
        userId: user._id
    });

    return savedPosts;

}

const getUserPostDetail = async (params, user) => {


    let post, content;
    let results = [];
    let contentData = {};


    post = await SavePosts.findById({ _id: params.postid, userId: user._id })

    if (!post) throw new ApiError(400, "Post does not exist");

    if (post.contentType === "ImageContent") {
        content = await ImageContent.findById(post.contentId, 'content hashtags');
        if (content && content.content && content.hashtags) {
            contentData = {
                title: content.content.title || '',
                description: content.content.description || '',
                hashtags: content.hashtags || []
            };
        }
    } else if (post.contentType === 'DYKContent') {
        const content = await DYKContent.findById(post.contentId, 'content hashtags');
        if (content && content.content && content.hashtags) {
            contentData = {
                title: content.content.title || '',
                description: content.content.fact || '', // Use fact as description for DYKContent
                hashtags: content.hashtags || []
            };
        }
    } else if (post.contentType === 'CarouselContent') {
        const content = await CarouselContent.findById(post.contentId, 'content');
        if (content && content.content && content.content.length >= 6) {
            // Extract title, description, hashtags from content[5] (sixth position)
            contentData = {
                title: content.content[5].title || '',
                description: content.content[5].description || '',
                hashtags: content.content[5].hashtags || []
            };
        }
    }



    results.push({
        _id: post._id,
        images: post.images || [],
        title: contentData.title,
        description: contentData.description,
        hashtags: contentData.hashtags,
        contentType: post.contentType,
        topic: post.topic || '',
        status: post.status || '',
        type: post.type || '',
        createdAt: post.createdAt || ''
    });

    return results



}
const getImageContent = async (contentId, user) => {

    let content = await ImageContent.findOne({ _id: contentId, userId: user._id })
    if (!content) throw new ApiError(BAD_REQUEST, "No content found")
    return content;
}

const getCarouselContent = async (contentId, user) => {

    let content = await CarouselContent.findOne({ _id: contentId, userId: user._id })
    if (!content) throw new ApiError(BAD_REQUEST, "No content found")
    return content;
}

const getDYKContent = async (contentId, user) => {

    let content = await DYKContent.findOne({ _id: contentId, userId: user._id })
    if (!content) throw new ApiError(BAD_REQUEST, "No content found")
    return content;
}

const updatePost = async (postId, user, inputs) => {
    // let update;
    const update = await SavePosts.findByIdAndUpdate({ contentId: postId, userId: user._id, contentType: inputs.contentType }, { images: inputs.images }, { new: true })
    if (!update) throw new ApiError(BAD_REQUEST, "Unable to update posts")

    // update = await SavePosts.findById({ _id: update._id })
    return update;
}

const updatePostTopics = async (postId, user, inputs) => {
    let update;
    update = await PostTopic.findByIdAndUpdate({ _id: postId, userId: user._id }, { status: inputs.status }, { new: true })
    if (!update) throw new ApiError(BAD_REQUEST, "Unable to update Status")

    update = await PostTopic.findById({ _id: update._id })
    return update

}

const getUserScheduledPosts = async (user) => {
    const scheduledPosts = await UserScheduledTask.find({ userId: user._id }).lean();
    return scheduledPosts;
}


const UserServices = {
    signup,
    signupSigninByProvider,
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
    getUserProfile,
    getPendingTopics,
    updatePostTopics,
    getUserAllPosts,
    getUserPostDetail,
    getUserScheduledPosts
}
export default UserServices;
