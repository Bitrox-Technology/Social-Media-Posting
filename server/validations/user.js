import { ApiError } from "../utils/ApiError.js";
import { BAD_REQUEST } from "../utils/apiResponseCode.js"
import joi from "joi"

const validateSignup = async (inputs) => {
    let schema = {}
    schema = joi.object().keys({
        email: joi.string().email().required(),
        // countryCode: joi.string().optional(),
        // phone: joi.string().pattern(/^[0-9\-\(\)\s]+$/).optional(),
        password: joi.string().min(6).pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required(),
        // confirmPassword: joi.string().optional()
    })
    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details ? validationError.details.map(detail => detail.message).join(', ') : "Invalid input";
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
}
const validateOTP = async (inputs) => {
    let schema = {}
    schema = joi.object().keys({
        email: joi.string().email().required(),
        otp: joi.string().required(),
    })
    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details ? validationError.details.map(detail => detail.message).join(', ') : i18n.__('INVALID_CREDENTIALS');
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
}

const validateResendOTP = async (inputs) => {
    let schema = {}
    schema = joi.object().keys({
        email: joi.string().email().required(),
    })
    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details ? validationError.details.map(detail => detail.message).join(', ') : i18n.__('INVALID_CREDENTIALS');
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
}

const validateforgetPassword = async (inputs) => {
    let schema = {}
    schema = joi.object().keys({
        email: joi.string().email().required(),
        newPassword: joi.string().min(6).pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required(),
    })
    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details ? validationError.details.map(detail => detail.message).join(', ') : i18n.__('INVALID_CREDENTIALS');
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
}

const validateUserDetails = async (inputs) => {
    const schema = joi.object().keys({
        username: joi.string().min(3).max(50).required(),
        email: joi.string().email({ tlds: { allow: false } }).required(),
        companyName: joi.string().min(2).max(100).required(),
        location: joi.string().min(2).max(100).required(),
        avatar: joi.string().optional().allow(null),
        logo: joi.string().optional().allow(null),
        productCategories: joi.array().items(joi.string().min(1).required()).min(1).required(),
        keyProducts: joi.array().items(Joi.string().min(1).required()).min(1).required(),
        targetMarket: joi.string().min(2).max(200).required(),
        annualRevenue: joi.string().pattern(/^\$?[0-9,]+(\.[0-9]{1,2})?$/).required(),
        websiteUrl: joi.string().uri().required(),
        countryCode: joi.string().pattern(/^\+[1-9]\d{0,2}$/).optional().allow(''),
        phone: joi.string().pattern(/^\+?[1-9]\d{1,14}(?:\s|-|\(|\))?[0-9\s-]{0,15}$/).optional().allow(''),
    });

    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details ? validationError.details.map(detail => detail.message).join(', ') : 'Invalid input';
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
};

const validateLogin = async (inputs) => {
    let schema = {}
    schema = joi.object().keys({
        email: joi.string().email().allow("", null).required(),
        //    countryCode: joi.string().allow("", null).optional(),
        //    phone: joi.string().pattern(/^[0-9\-\(\)\s]+$/).optional(),
        password: joi.string().min(6).pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required(),
    })
    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details ? validationError.details.map(detail => detail.message).join(', ') : "Invalid input";
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
}

const validatePostContent = async (inputs) => {
    let schema = {}
    schema = joi.object({
        topics: joi.array().items(joi.string().trim().min(7).required()).required()
    });

    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details
            ? validationError.details.map((detail) => detail.message).join(', ')
            : 'Invalid input';
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
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
        status: joi.string().valid("pending", "error", "success").default("pending")
    });

    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details
            ? validationError.details.map((detail) => detail.message).join(', ')
            : 'Invalid input';
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
};

const validateCarouselContent = async (inputs) => {
    const contentSchema = joi.object({
        tagline: joi.string().allow('').empty('').optional(),
        title: joi.string().allow('').empty('').optional(),
        description: joi.string().allow('').empty('').optional(),
    });

    const schema = joi.object({
        postContentId: joi.string().required(),
        topic: joi.string().trim().min(1).required(),
        templateId: joi.string().trim().min(1).required(),
        content: joi.array().items(contentSchema).optional(),
        status: joi.string().valid("pending", "error", "success").default("pending")
    });

    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details
            ? validationError.details.map((detail) => detail.message).join(', ')
            : 'Invalid input';
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
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
        status: joi.string().valid("pending", "error", "success").default("pending")
    });

    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details
            ? validationError.details.map((detail) => detail.message).join(', ')
            : 'Invalid input';
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
};

const validateSavePost = async (inputs) => {
    let schema = {}
    schema = joi.object({
        postContentId: joi.string().required(),
        contentId: joi.string().required(),
        contentType: joi.string().valid('ImageContent', 'CarouselContent', 'DYKContent').required(),
        topic: joi.string().trim().min(1).optional(),
        type: joi.string().valid('image', 'carousel', 'doyouknow').optional(),
        status: joi.string().valid('pending', 'error', 'success').default('success'),
        images: joi.array()
            .items(
                joi.object({
                    url: joi.string().trim().uri().required(),
                    label: joi.string().trim().min(1).required(),
                })
            )
            .optional(),
    });

    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details
            ? validationError.details.map((detail) => detail.message).join(', ')
            : 'Invalid input';
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
};

const validateUpdatePost = async (inputs) => {
    let schema = {}
    schema = joi.object({
        contentType: joi.string().valid('ImageContent', 'CarouselContent', 'DYKContent').required(),
        images: joi.array()
            .items(
                joi.object({
                    url: joi.string().trim().uri().required(),
                    label: joi.string().trim().min(1).required(),
                })
            )
            .optional(),
    });

    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details
            ? validationError.details.map((detail) => detail.message).join(', ')
            : 'Invalid input';
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
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
    validateUserDetails
}

export default UserValidation;