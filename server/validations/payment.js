import { BILLING_TYPES, PLAN_TITLE_TYPES } from "../config/constant.js";
import VALIDATE_SCHEMA from "./validateSchema.js";
import joi from "joi"



const validatePaymentInitaite = async (inputs) => {
    let schema = {}
    schema = joi.object({
        mobileNumber: joi.string().pattern(/^[0-9]{10}$/).required(),
        amount: joi.number().positive().required(),
        customerId: joi.string().required(),
        email: joi.string().email().required(),
        orderId: joi.string().required()
    })
    VALIDATE_SCHEMA(schema, inputs);
};

const validatePhonePePaymentInitiate = async (inputs) => {
  const schema = joi.object({
    phone: joi.string().pattern(/^[0-9]{10}$/).required(),
    amount: joi.number().positive().required(),
    name: joi.string().min(2).required(),
    email: joi.string().email().required(),
    planTitle: joi.string().valid(...PLAN_TITLE_TYPES).required(),
    billing: joi.string().valid(...BILLING_TYPES).required(),
    transactionId: joi.string().optional(),
    subscriptionId: joi.string().required()
  });

  VALIDATE_SCHEMA(schema, inputs);
};
const PaymentValidation = {
    validatePaymentInitaite,
    validatePhonePePaymentInitiate
}

export default PaymentValidation;