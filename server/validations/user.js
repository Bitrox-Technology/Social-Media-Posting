import joi from "joi"
import VALIDATE_SCHEMA from "./validateSchema.js";
import { CONTENT_TYPE_ENUM, POST_STATUS_ENUM, POST_TYPE_ENUM, PRODUCT_POST_TYPE_ENUM, PROVIDER_ENUM } from "../config/constant.js";

const validateSignup = async (inputs) => {
    let schema = {};
    schema = joi.object().keys({
        email: joi.string().email().lowercase().required(),
        password: joi.string()
            .min(6)
            .pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])'))
            .required(),
    });

    VALIDATE_SCHEMA(schema, inputs);
}

const validateSignupSigninByProvider = async (inputs) => {
    let schema = {};

    if (inputs.provider === 'google' || inputs.provider === 'apple') {
        schema = joi.object().keys({
            email: joi.string().email().lowercase().required(),
            provider: joi.string().valid('google', 'apple').required(),
            uid: joi.string().trim().required(),
        });
    }

    VALIDATE_SCHEMA(schema, inputs);
}

const validateOTP = async (inputs) => {
    let schema = {}
    schema = joi.object().keys({
        email: joi.string().email().lowercase().required(),
        otp: joi.string().required(),
    })
    VALIDATE_SCHEMA(schema, inputs);
}

const validateResendOTP = async (inputs) => {
    let schema = {}
    schema = joi.object().keys({
        email: joi.string().email().lowercase().required(),
    })
    VALIDATE_SCHEMA(schema, inputs);
}

const validateforgetPassword = async (inputs) => {
    let schema = {}
    schema = joi.object().keys({
        email: joi.string().email().lowercase().required(),
        newPassword: joi.string().min(6).pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required(),
    })
    VALIDATE_SCHEMA(schema, inputs);
}

const validateUserProfile = async (inputs) => {
    const productCategorySchema = joi.object({
        category: joi.string().trim().required(),
        productName: joi.string().trim().required(),
        image: joi.string().trim().optional(),
    });
    const schema = joi.object({
        userName: joi.string().trim().required(),
        email: joi.string().email().trim().lowercase().required(),
        countryCode: joi.string().trim().required(),
        phone: joi.string()
            .trim()
            .pattern(/^[0-9]{10}$/).optional(),
        location: joi.string().trim().optional(),
        companyName: joi.string().trim().optional(),
        productCategories: joi.array().items(productCategorySchema).optional(),
        services: joi.array().items(joi.string().trim()).optional(),
        keyProducts: joi.array().items(joi.string().trim()).optional(),
        targetMarket: joi.string().trim().optional(),
        websiteUrl: joi.string().uri().trim().optional(),
        logo: joi.string().trim().optional(),
        bio: joi.string().trim().optional(),
    });

    VALIDATE_SCHEMA(schema, inputs);
};

const validateLogin = async (inputs) => {
    let schema = {}
    schema = joi.object().keys({
        email: joi.string().email().lowercase().required(),
        password: joi.string()
            .min(6)
            .pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])'))
            .required(),
    });

    VALIDATE_SCHEMA(schema, inputs);
}

const validatePostContent = async (inputs) => {
    let schema = {}
    schema = joi.object({
        topics: joi.array().items(joi.string().trim().min(7).required()).required()
    });

    VALIDATE_SCHEMA(schema, inputs);
};

const validateImageContent = async (inputs) => {
    let schema = {}
    schema = joi.object({
        postContentId: joi.string().trim().min(1).required(),
        topic: joi.string().trim().min(1).required(),
        templateId: joi.string().trim().required(),
        content: joi.object({
            title: joi.string().trim().required(),
            description: joi.string().trim().required(),
            footer: joi.string().trim().allow('').optional(),
            websiteUrl: joi.string().trim().uri().allow('').optional(),
            imageUrl: joi.string().trim().uri().required(),
        }),
        hashtags: joi.array().items(joi.string().trim()).optional(),
        status: joi.string().valid(...POST_STATUS_ENUM).default("pending")
    });

    VALIDATE_SCHEMA(schema, inputs);
};

const validateCarouselContent = async (inputs) => {
    const contentSchema = joi.object({
        tagline: joi.string().allow('').empty('').optional(),
        title: joi.string().allow('').empty('').optional(),
        description: joi.string().allow('').empty('').optional(),
        hashtags: joi.array().items(joi.string().trim()).optional(),
    });

    const schema = joi.object({
        postContentId: joi.string().required(),
        topic: joi.string().trim().min(1).required(),
        templateId: joi.string().trim().min(1).required(),
        content: joi.array().items(contentSchema).optional(),
        status: joi.string().valid(...POST_STATUS_ENUM).default("pending")
    });

    VALIDATE_SCHEMA(schema, inputs);
};

const validateDYKContent = async (inputs) => {
    let schema = {}
    schema = joi.object({
        postContentId: joi.string().trim().min(1).required(),
        topic: joi.string().trim().min(1).required(),
        templateId: joi.string().trim().required(),
        content: joi.object({
            title: joi.string().trim().optional(),
            fact: joi.string().trim().optional(),
        }),
        hashtags: joi.array().items(joi.string().trim()).optional(),
        status: joi.string().valid(...POST_STATUS_ENUM).default("pending")
    });

    VALIDATE_SCHEMA(schema, inputs);
};

const validateSavePost = async (inputs) => {
    let schema = {}
    schema = joi.object({
        postContentId: joi.string().required(),
        contentId: joi.string().required(),
        contentType: joi.string().valid(...CONTENT_TYPE_ENUM).required(),
        topic: joi.string().trim().min(1).optional(),
        type: joi.string().valid(...POST_TYPE_ENUM).optional(),
        status: joi.string().valid(...POST_STATUS_ENUM).default('success'),
        images: joi.array()
            .items(
                joi.object({
                    url: joi.string().trim().uri().required(),
                    label: joi.string().trim().min(1).required(),
                })
            )
            .optional(),
    });

    VALIDATE_SCHEMA(schema, inputs);
};

const validateUpdatePost = async (inputs) => {
    let schema = {}
    schema = joi.object({
        contentType: joi.string().valid(...CONTENT_TYPE_ENUM).required(),
        images: joi.array()
            .items(
                joi.object({
                    url: joi.string().trim().uri().required(),
                    label: joi.string().trim().min(1).required(),
                })
            )
            .optional(),
    });

    VALIDATE_SCHEMA(schema, inputs);
};

const validateSaveProductInfo = async (inputs) => {
    let schema = {}
    schema = joi.object({
        contentType: joi.string().valid('ProductContent').required(),
        productName: joi.string().trim().min(1).required(),
        postTypes: joi.array().items(joi.string().valid(...PRODUCT_POST_TYPE_ENUM)).min(1).required(),
        discount: joi.object({
            percentage: joi.number().min(1).max(100),
            description: joi.string().trim().min(1),
        }).optional(),
        flashSale: joi.object({
            offer: joi.string().trim().min(1),
            validUntil: joi.string().trim().min(1).$_match(/^\d{4}-\d{2}-\d{2}$/),
        }).optional(),
        schedule: joi.object({
            fromDate: joi.string().trim().pattern(/^\d{4}-\d{2}-\d{2}$/),
            toDate: joi.string().trim().pattern(/^\d{4}-\d{2}-\d{2}$/),
            time: joi.string().trim().pattern(/^\d{2}:\d{2}$/)
        }).optional(),
        imagesUrl: joi.array().items(
            joi.object({
                url: joi.string().trim().uri(),
                label: joi.string().trim().min(1),
            })
        ).optional(),
    });


    VALIDATE_SCHEMA(schema, inputs);
};


const validateBlog = async (inputs) => {
    let schema = {}
    schema = joi.object({
        title: joi.string().trim().min(1).required(),
        content: joi.string().trim().min(1).required(),
        metaDescription: joi.string().trim().max(160).optional(),
        excerpt: joi.string().trim().optional(),
        focusKeyword: joi.string().trim().optional(),
        categories: joi.array().items(joi.string().trim()).optional(),
        tags: joi.array().items(joi.string().trim()).optional(),
        imageUrl: joi.string().trim().uri().optional(),
        imageAltText: joi.string().trim().optional(),
        imageDescription: joi.string().trim().optional(),
        slug: joi.string().trim().optional(),
    });

    VALIDATE_SCHEMA(schema, inputs);
};

const validateBlogPost = async (inputs) => {
    let schema = {}
    schema = joi.object({
        title: joi.string().trim().min(1).required(),
        content: joi.string().trim().min(1).required(),
        metaDescription: joi.string().trim().optional(),
        excerpt: joi.string().trim().optional(),
        focusKeyword: joi.string().trim().optional(),
        slug: joi.string().trim().optional(),
        categories: joi.array().items(joi.string().trim()).optional(),
        tags: joi.array().items(joi.string().trim()).optional(),
        imageUrl: joi.string().trim().uri().optional(),
        imageAltText: joi.string().trim().optional(),
        scheduleTime: joi.string().trim().allow('').optional(),
        imageDescription: joi.string().trim().optional(),
    });

    VALIDATE_SCHEMA(schema, inputs);
};


const UserValidation = {
    validateSignup,
    validateOTP,
    validateResendOTP,
    validateforgetPassword,
    validateLogin,
    validatePostContent,
    validateImageContent,
    validateCarouselContent,
    validateDYKContent,
    validateSavePost,
    validateUpdatePost,
    validateUserProfile,
    validateSignupSigninByProvider,
    validateSaveProductInfo,
    validateBlog,
    validateBlogPost,
}

export default UserValidation;