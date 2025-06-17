import VALIDATE_SCHEMA from "./validateSchema.js";
import joi from "joi"



const validatePaymentInitaite = async (inputs) => {
    let schema = {}
    schema = joi.object({
        orderId: joi, amount, customerId, email, mobileNumber
    });

    VALIDATE_SCHEMA(schema, inputs);
};

const validatePhonePePaymentInitiate = async (inputs) => {
    let schema = {}
    schema = joi.object({
        phone: joi.string().pattern(/^[0-9]{10}$/).required(),
        amount: joi.number().positive().required(),
        name: joi.string().min(2).required(),
        email: joi.string().email().required()
    });

    VALIDATE_SCHEMA(schema, inputs);
};

const PaymentValidation = {
    validatePaymentInitaite,
    validatePhonePePaymentInitiate
}

export default PaymentValidation;