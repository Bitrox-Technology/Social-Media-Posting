import VALIDATE_SCHEMA from "./validateSchema.js";


const validatePaymentInitaite = async (inputs) => {
    let schema = {}
    schema = joi.object({
        orderId:joi, amount, customerId, email, mobileNumber
    });

    VALIDATE_SCHEMA(schema, inputs);
};


const PaymentValidation = {
    validatePaymentInitaite
}

export default PaymentValidation;