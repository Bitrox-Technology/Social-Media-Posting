import i18n from "../utils/i18n.js"
import { BAD_REQUEST } from "../utils/apiResponseCode.js";
import { ApiError } from "../utils/ApiError.js";

const VALIDATE_SCHEMA = async(schema, inputs) => {

     try {
          await schema.validateAsync(inputs, { abortEarly: false });
     } catch (validationError) {
          const errorMessage = validationError.details ? validationError.details.map(detail => detail.message).join(', ') : i18n.__('INVALID_CREDENTIALS');
          throw new ApiError(BAD_REQUEST, errorMessage);
     }

} 

export default VALIDATE_SCHEMA;