import mongoose from "mongoose";
import User from "../models/user.js";
import { ApiError } from "../utils/ApiError.js";
import { generateAccessAndRefreshTokenForUser } from "../utils/generateToken.js";
import { BAD_REQUEST, CONFLICT, INTERNAL_SERVER_ERROR } from "../utils/apiResponseCode.js";
import { clearAuthCookies, comparePasswordUsingBcrypt, convertToCron, decryptToken, encryptToken, Hashed_Password, isEmail } from "../utils/utilities.js";
import PostTopic from "../models/postTopics.js";
import ImageContent from "../models/imageContent.js";
import CarouselContent from "../models/carouselContent.js";
import DYKContent from "../models/dykContent.js";
import SavePosts from "../models/savePosts.js";
import { generateOTPForEmail, verifyEmailOTP } from "../utils/functions.js";
import { uploadStreamToCloudinary } from "../utils/cloudinary.js";
import i18n from "../utils/i18n.js";
import UserScheduledTask from "../models/userSchesuledTask.js";
import Blog from "../models/blog.js";
import { v4 as uuidv4 } from "uuid";
import cron from 'node-cron';
import { publishBlogPost, publishContent1 } from "./blogPost.js";
import FestivalContent from "../models/festivalContent.js";
import WordpressCredentials from "../models/wordpress.js";
import ProductContent from "../models/productContent.js";

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
        user = await User.findByIdAndUpdate({ _id: user._id }, { refreshToken: refreshToken, sessionExpiry: sessionExpiry }, { new: true })
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

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokenForUser(user)

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
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokenForUser(user)

        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        return user
    }
}


const logout = async (req, res) => {
    clearAuthCookies(res)

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

    console.log("User Details Inputs", files)
    if (files && files.length > 0) {
        for (const file of files) {
            if (file.fieldname === 'logo') {
                const result = await uploadStreamToCloudinary(file.buffer, {
                    folder: 'company_logos',
                    public_id: `${inputs.companyName}_logo_${Date.now()}`,
                });
                if (!result || !result.secure_url) throw new ApiError(BAD_REQUEST, 'Unable to upload logo');
                inputs.logo = result.secure_url;

            } else if (file.fieldname.startsWith('productCategories[')) {

                const match = file.fieldname.match(/productCategories\[(\d+)\]\[image\]/);
                if (match) {
                    const index = parseInt(match[1], 10);
                    const result = await uploadStreamToCloudinary(file.buffer, {
                        folder: 'product_categories',
                        public_id: `${inputs.companyName}_category_${index}_${Date.now()}`,
                    });
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
    let topicSetId = uuidv4()
    console.log("Topic set Id", topicSetId)
    if (postContent) {
        postContent = await PostTopic.findByIdAndUpdate({ _id: postContent._id }, { topics: inputs.topics, topicSetId: topicSetId, status:"pending" }, { new: true })
    } else {
        postContent = await PostTopic.create({ userId: user._id, topics: inputs.topics, topicSetId: topicSetId,  status:"pending"})
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
                topicSetId: 1,
                logo: '$userData.logo', 
                websiteUrl: '$userData.websiteUrl',
                uniqueIdentifier: "$userData.uniqueIdentifier",
                productCategories: "$userData.productCategories",
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
    if (inputs.type === 'festival' || inputs.type === 'product') {

    } else {
        let postContent = await PostTopic.findById({ _id: inputs.postContentId, userId: user._id })
        if (!postContent) throw new ApiError(BAD_REQUEST, "No topics found")
        console.log("Post Topic set Id: ", postContent)
        inputs.topicSetId=postContent.topicSetId
    }
    inputs.userId = user._id
    let post = await SavePosts.create(inputs)
    if (!post) throw new ApiError(BAD_REQUEST, "Unable to save posts")

    return post;
}

const getSavePosts = async (postContentId, user) => {

    const topic = await PostTopic.findOne({ _id: postContentId,  userId: user._id });
    if (!topic) {
        console.log('No topic found');
        return [];
    }

    // Find saved posts that match user, postContentId, topic, and one of the topics in PostTopic.topics
    const savedPosts = await SavePosts.find({
        postContentId: postContentId,
        topicSetId: topic.topicSetId,
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

  // Fetch the post by ID and user ID
  post = await SavePosts.findById({ _id: params.postid, userId: user._id });

  if (!post) throw new ApiError(400, "Post does not exist");

  // Handle different content types
  if (post.contentType === "ImageContent") {
    content = await ImageContent.findById(post.contentId, 'content hashtags');
    if (content && content.content && content.hashtags) {
      contentData = {
        title: content.content.title || '',
        description: content.content.description || '',
        hashtags: content.hashtags || [],
      };
    }
  } else if (post.contentType === 'DYKContent') {
    content = await DYKContent.findById(post.contentId, 'content hashtags');
    if (content && content.content && content.hashtags) {
      contentData = {
        title: content.content.title || '',
        description: content.content.fact || '',
        hashtags: content.hashtags || [],
      };
    }
  } else if (post.contentType === 'CarouselContent') {
    content = await CarouselContent.findById(post.contentId, 'content');
    if (content && content.content && content.content.length >= 6) {
      contentData = {
        title: content.content[5].title || '',
        description: content.content[5].description || '',
        hashtags: content.content[5].hashtags || [],
      };
    }
  } else if (post.contentType === 'FestivalContent') {
    content = await FestivalContent.findById(post.contentId, 'festivalName description festivalDate imageUrl');
    if (content) {
      contentData = {
        title: content.festivalName || '',
        description: content.description || '',
        hashtags: [], // Hashtags not provided in FestivalContent
        festivalDate: content.festivalDate || '',
        imageUrl: content.imageUrl || '',
      };
    }
  } else if (post.contentType === 'ProductContent') {
    content = await ProductContent.findById(
      post.contentId,
      'productName description imagesUrl footer websiteUrl price discount flashSale postTypes'
    );
    if (content) {
      contentData = {
        title: content.productName || '',
        description: content.description || '',
        hashtags: [], // Hashtags not provided in ProductContent
        imagesUrl: content.imagesUrl || [],
        footer: content.footer || '',
        websiteUrl: content.websiteUrl || '',
        price: content.price || '',
        discount: content.discount || null,
        flashSale: content.flashSale || null,
        postTypes: content.postTypes || [],
      };
    }
  }

  // Construct the result object
  results.push({
    _id: post._id,
    images: post.images || [],
    title: contentData.title || '',
    description: contentData.description || '',
    hashtags: contentData.hashtags || [],
    contentType: post.contentType || '',
    topic: post.topic || '',
    status: post.status || '',
    type: post.type || '',
    createdAt: post.createdAt || '',
    // Include additional fields for specific content types
    ...(post.contentType === 'FestivalContent' && {
      festivalDate: contentData.festivalDate || '',
      imageUrl: contentData.imageUrl || '',
    }),
    ...(post.contentType === 'ProductContent' && {
      imagesUrl: contentData.imagesUrl || [],
      footer: contentData.footer || '',
      websiteUrl: contentData.websiteUrl || '',
      price: contentData.price || '',
      discount: contentData.discount || null,
      flashSale: contentData.flashSale || null,
      postTypes: contentData.postTypes || [],
    }),
  });

  return results;
};

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

    return update

}

const getUserScheduledPosts = async (user) => {
    const scheduledPosts = await UserScheduledTask.find({ userId: user._id }).lean();
    return scheduledPosts;
}

const saveBlog = async (inputs, user) => {
    const blogPost = await Blog.create({
        userId: user._id,
        title: inputs.title,
        content: inputs.content,
        metaDescription: inputs.metaDescription,
        categories: inputs.categories,
        tags: inputs.tags,
        tone: inputs.tone,
        topic: inputs.topic,
        audience: inputs.audience,
        section: inputs.section,
        imageUrl: inputs.imageUrl,
        imageAltText: inputs.imageAltText,
        imageDescription: inputs.imageDescription,
        focusKeyword: inputs.focusKeyword,
        slug: inputs.slug,
        excerpt: inputs.excerpt

    });
    if (!blogPost) throw new ApiError(BAD_REQUEST, i18n.__("UNABLE_TO_SAVE_BLOG_POST"));
    return blogPost;
}

const getBlogById = async (blogId, user) => {
    const blogPost = await Blog.findOne({ _id: blogId, userId: user._id }).lean();
    if (!blogPost) throw new ApiError(BAD_REQUEST, i18n.__("BLOG_POST_NOT_FOUND"));
    return blogPost;
}

const getAllBlogs = async (user) => {
    const blogs = await Blog.find({ userId: user._id }).sort({ createdAt: -1 }).lean();
    if (!blogs || blogs.length === 0) throw new ApiError(BAD_REQUEST, i18n.__("NO_BLOGS_FOUND"));
    return blogs;
}

// const scheduledBlogPosts = async (inputs, user) => {
//   let postResult;

//   if (inputs.scheduleTime && inputs.scheduleTime !== "") {
//     const cronExpression = convertToCron(inputs.scheduleTime);
//     console.log("Generated cron expression:", cronExpression);

//     const scheduledDate = new Date(inputs.scheduleTime);
//     const now = new Date();
//     if (scheduledDate <= now) {
//       throw new ApiError(BAD_REQUEST, i18n.__("INVALID_SCHEDULED_TIME"));
//     }

//     const taskId = uuidv4();

//     const scheduledTask = new UserScheduledTask({
//       userId: user._id,
//       taskId,
//       task: "Post to Blog",
//       platform: "wordpress",
//       imageUrl: inputs.imageUrl,
//       title: inputs.title,
//       description: inputs.content,
//       scheduleTime: scheduledDate,
//       cronExpression,
//       status: "pending",
//       postId: null,
//     });

//     await scheduledTask.save();

//     // Schedule the task using node-cron
//     const task = cron.schedule(
//       cronExpression,
//       async () => {
//         try {
//           postResult = await publishBlogPost(inputs);
//           console.log(
//             `Scheduled post executed successfully with post ID: ${postResult}`
//           );

//           // Update the scheduled task with the postId and status
//           await UserScheduledTask.updateOne(
//             { taskId },
//             {
//               $set: {
//                 status: "completed",
//                 postId: postResult,
//               },
//             }
//           );
//         } catch (error) {
//           console.error("Scheduled blog post failed:", error.message);

//           // Update the scheduled task status to 'failed'
//           await UserScheduledTask.updateOne(
//             { taskId },
//             {
//               $set: {
//                 status: "failed",
//               },
//             }
//           );
//         }
//       },
//       {
//         scheduled: true,
//         timezone: "Asia/Kolkata", // Use IST timezone as per the current date
//       }
//     );

//     return {
//       message: `Post scheduled successfully for ${scheduledDate.toLocaleString(
//         "en-IN",
//         { timeZone: "Asia/Kolkata" }
//       )}`,
//       taskId,
//       postId: null,
//     };
//   } else {
//     postResult = await publishBlogPost(inputs);;
//     if (!postResult) throw new ApiError(BAD_REQUEST, i18n.__("POST_FAILED"));
//     return {
//       message: "Post published immediately",
//       postId: postResult,
//     };
//   }
// };

const scheduledContent = async (inputs, user) => {
    try {
        if (!inputs.title || !inputs.content || !inputs.excerpt || !inputs.metaDescription || !inputs.section || !inputs.wordpress_username || !inputs.wordpress_password) {
            throw new ApiError(400, 'Required fields missing');
        }

        inputs.wordpress_username = decryptToken(inputs.wordpress_username)
        inputs.wordpress_password = decryptToken(inputs.wordpress_password)

        let postResult;

        if (inputs.scheduleTime && inputs.scheduleTime !== '') {
            const scheduledDate = new Date(inputs.scheduleTime);
            const now = new Date();
            if (isNaN(scheduledDate.getTime()) || scheduledDate <= now) {
                throw new ApiError(400, 'Invalid or past schedule time');
            }

            const cronExpression = convertToCron(inputs.scheduleTime);
            console.log('Generated cron expression:', cronExpression);

            const taskId = uuidv4();
            const scheduledTask = new UserScheduledTask({
                userId: user._id,
                taskId,
                task: `Post to ${inputs.section.charAt(0).toUpperCase() + inputs.section.slice(1)}`,
                platform: 'wordpress',
                imageUrl: inputs.imageUrl,
                title: inputs.title,
                description: inputs.content,
                scheduleTime: scheduledDate,
                cronExpression,
                status: 'pending',
                postId: null,
            });

            await scheduledTask.save();

            cron.schedule(
                cronExpression,
                async () => {
                    try {
                        postResult = await publishContent1(inputs);
                        console.log(`Scheduled ${inputs.section} post executed with post ID: ${postResult}`);

                        await UserScheduledTask.updateOne(
                            { taskId },
                            { $set: { status: 'completed', postId: postResult } }
                        );
                    } catch (error) {
                        console.error(`Scheduled ${inputs.section} post failed:`, error.message);
                        await UserScheduledTask.updateOne(
                            { taskId },
                            { $set: { status: 'failed' } }
                        );
                    }
                },
                { scheduled: true, timezone: 'Asia/Kolkata' }
            );

            return {
                message: `Post scheduled successfully for ${scheduledDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
                taskId,
                postId: null,
            };
        } else {
            postResult = await publishContent1(inputs);
            console.log(`Post executed immediately with post ID: ${postResult}`);
            return {
                message: 'Post published immediately',
                postId: postResult,
            };
        }
    } catch (error) {
        console.error('Error scheduling content:', error);
        throw new ApiError(500, error.message || 'Failed to schedule content');
    }
};

const festivalContent = async (inputs, file, user) => {
    if (!file) throw new ApiError(BAD_REQUEST, i18n.__("FILE_NOT_FOUND"));

    const result = await uploadStreamToCloudinary(file.buffer, {
        folder: 'festival_images',
        public_id: `festival_image_${Date.now()}`,
    });
    if (!result || !result.secure_url) throw new ApiError(BAD_REQUEST, 'Unable to upload logo');
    inputs.imageUrl = result.secure_url;
    inputs.userId = user._id


    const createContent = await FestivalContent.create(inputs)
    if (!createContent) throw new ApiError(BAD_REQUEST, i18n.__("UNABLE_SAVE_CONTENT"));

    return createContent;

}

const getFestivalContent = async (user, params) => {
    const content = await FestivalContent.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(params.contentid),
                userId: new mongoose.Types.ObjectId(user._id),
            },
        },
        {
            $lookup: {
                from: 'users',
                let: { userId: '$userId' }, // Define variable for lookup
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$_id', '$$userId'] }, // Match userId with user._id
                        },
                    },
                    {
                        $project: {
                            logo: 1,
                            websiteUrl: 1,
                            uniqueIdentifier: 1,
                        },
                    },
                ],
                as: 'userData',
            },
        },
        {
            $unwind: {
                path: '$userData',
                preserveNullAndEmptyArrays: true, // Keep documents even if no user is found
            },
        },
        {
            $project: {
                festivalName: 1,
                description: 1,
                festivalDate: 1,
                imageUrl: 1,
                userId: 1,
                logo: '$userData.logo',
                websiteUrl: '$userData.websiteUrl',
                uniqueIdentifier: "$userData.uniqueIdentifier",// Project the logo from userData
                _id: 1,
            },
        },
    ]);
   
    console.log("Festival Content: ", content)

    if (!content || content.length === 0) {
        throw new ApiError(BAD_REQUEST, 'No post content found');
    }

    return content[0]; // Return the first document (single content)
};


const wordpressAuth = async (inputs, user) => {
    let result;
    if (!inputs.wordpress_username && !inputs.wordpress_password) throw new ApiError(BAD_REQUEST, i18n.__("CREDENTIALS_MISSING"))

    inputs.wordpress_username = encryptToken(inputs.wordpress_username)
    inputs.wordpress_password = encryptToken(inputs.wordpress_password)


    result = await WordpressCredentials.findOne({ userId: user._id });
    inputs.isAuthenticate = true
    inputs.userId = user._id
    if (result) {

        result = await WordpressCredentials.updateOne(inputs, { new: true }).lean()
    } else {
        result = await WordpressCredentials.create(inputs)
    }
    return result;
}

const getWordpressAuth = async (user) => {
    const result = await WordpressCredentials.findOne({ userId: user._id }).lean()

    return result
}


const productContent = async (inputs, files, user) => {
    if (!files) throw new ApiError(BAD_REQUEST, i18n.__("FILES_NOT_FOUND"));

    console.log("Files: ", files)

    inputs.imagesUrl = []
    for (const file of files) {
        if (file.fieldname === 'imagesUrl') {
            const result = await uploadStreamToCloudinary(file.buffer, {
                folder: 'product_images',
                public_id: `${file.fieldname}_image_${Date.now()}`,
            });
            if (!result || !result.secure_url) {
                throw new ApiError(BAD_REQUEST, 'Unable to upload product image');
            }
            inputs.imagesUrl.push(result.secure_url);
        }
    }

    const product = await ProductContent.create({
        ...inputs,
        contentType: 'ProductContent',
        userId: user._id
    });

    return product;

}


const getProductContent = async (user, params) => {
    const content = await ProductContent.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(params.contentid),
                userId: new mongoose.Types.ObjectId(user._id),
            },
        },
        {
            $lookup: {
                from: 'users',
                let: { userId: '$userId' }, // Define variable for lookup
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$_id', '$$userId'] }, // Match userId with user._id
                        },
                    },
                    {
                        $project: {
                            logo: 1,
                            websiteUrl: 1,
                            uniqueIdentifier: 1 
                        },
                    },
                ],
                as: 'userData',
            },
        },
        {
            $unwind: {
                path: '$userData',
                preserveNullAndEmptyArrays: true, // Keep documents even if no user is found
            },
        },
        {
            $project: {
                productName: 1,
                description: 1,
                price: 1,
                imagesUrl: 1,
                userId: 1,
                logo: '$userData.logo',
                websiteUrl: '$userData.websiteUrl',
                uniqueIdentifier: "$userData.uniqueIdentifier",// Project the logo from userData
                postTypes: 1,
                discount: 1,
                flashSale: 1,
                _id: 1,
            },
        },
    ]);

    if (!content || content.length === 0) {
        throw new ApiError(BAD_REQUEST, 'No post content found');
    }

    return content[0]; 
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
    getUserScheduledPosts,
    saveBlog,
    getBlogById,
    scheduledContent,
    getAllBlogs,
    festivalContent,
    getFestivalContent,
    wordpressAuth,
    getWordpressAuth,
    productContent,
    getProductContent
}
export default UserServices;
