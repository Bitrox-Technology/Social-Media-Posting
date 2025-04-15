import { ApiError } from "../utils/apiError.js";
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
            title: joi.string().trim().min(1).required(),
            description: joi.string().trim().min(1).required(),
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
        tagline: joi.string().trim().min(1).optional(),
        title: joi.string().trim().min(1).optional(),
        description: joi.string().trim().min(1).optional(),
    });

    const schema = joi.object({
        postContentId: joi.string().required(),
        topic: joi.string().trim().min(1).required(),
        templateId: joi.string().trim().min(1).required(),
        content: joi.array().items(contentSchema).min(1).optional(),
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
            title: joi.string().trim().min(1).optional(),
            fact: joi.string().trim().min(1).optional(),
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

export {
    validateSignup,
    validateLogin,
    validatePostContent,
    validateImageContent,
    validateCarouselContent,
    validateDYKContent,
    validateSavePost
}