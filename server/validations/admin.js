import { ApiError } from "../utils/ApiError.js";
import { BAD_REQUEST } from "../utils/apiResponseCode.js"
import joi from "joi"

const validateSignup = async (inputs) => {
    let schema = {}
    schema = joi.object().keys({
        email: joi.string().email().required(),
        password: joi.string().min(6).pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required(),
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

const validateAdminProfile = async (inputs) => {
    const schema = joi.object({
        userName: joi.string().trim().required(),
        email: joi.string().email().trim().lowercase().required(),
        countryCode: joi.string().trim().required(),
        phone: joi.string().trim().pattern(/^[0-9]{10}$/).optional(),
        location: joi.string().trim().optional(),
        companyName: joi.string().trim().optional(),
        profileImage: joi.string().trim().optional(),
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

const validateLogin = async (inputs) => {
    let schema = {}
    schema = joi.object().keys({
        email: joi.string().email().allow("", null).required(),
        password: joi.string().min(6).pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required(),
    })
    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details ? validationError.details.map(detail => detail.message).join(', ') : "Invalid input";
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
}


const AdnminValidation = {
    validateSignup,
    validateLogin,
    validateOTP,
    validateResendOTP,
    validateforgetPassword,
    validateAdminProfile
}
export default AdnminValidation;