import joi from "joi"
import VALIDATE_SCHEMA from "./validateSchema.js";

const validateFacebookPostOnPage = async (inputs) => {
    let schema = {};
    schema = joi.object().keys({
        title: joi.string().trim().required(),
        description: joi.string().trim().required(),
        hashTags: joi.string().allow('').optional(),
        scheduleTime: joi.date().iso().optional().allow(''),
        pageAccessToken: joi.string().required(),
        imagesUrl: joi.array().items(joi.string().trim()).optional(),
        pageId: joi.string().required()
    });

    VALIDATE_SCHEMA(schema, inputs);
}


const SocialValidation = {
validateFacebookPostOnPage
}

export default SocialValidation;