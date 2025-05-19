import joi from "joi"
import VALIDATE_SCHEMA from "./validateSchema.js"


const validateSignup = async (inputs) => {
    let schema = {}
    schema = joi.object().keys({
        email: joi.string().email().lowercase().required(),
        password: joi.string().min(6).pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required(),
    })

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

const validateAdminProfile = async (inputs) => {
    const schema = joi.object({
        username: joi.string().trim().required(),
        email: joi.string().email().trim().lowercase().required(),
        countryCode: joi.string().trim().required(),
        phone: joi.string().trim().pattern(/^[0-9]{10}$/).optional(),
        location: joi.string().trim().optional(),
        companyName: joi.string().trim().optional(),
        profileImage: joi.string().trim().optional(),
        bio: joi.string().trim().optional(),
        website: joi.string().trim().optional(),
        twitter: joi.string().trim().optional(),
        linkedin: joi.string().trim().optional(),
    });

     VALIDATE_SCHEMA(schema, inputs);
};

const validateLogin = async (inputs) => {
    let schema = {}
    schema = joi.object().keys({
        email: joi.string().email().lowercase().allow("", null).required(),
        password: joi.string().min(6).pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required(),
    })
     VALIDATE_SCHEMA(schema, inputs);
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