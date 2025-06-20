import PaymentServices from "../services/payment.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { CREATED } from "../utils/apiResponseCode.js";
import { RevokeToken } from "../utils/csrf.js";
import i18n from "../utils/i18n.js";
import PaymentValidation from "../validations/payment.js";


const PaymentInitiate = async (req, res, next) => {
  const { orderId, amount, customerId, email, mobileNumber } = req.body;

  try {
    await PaymentValidation.validatePaymentInitaite(req.body)
    let result = await PaymentServices.paymentInitiate(req.body, req.user)
    const { newCsrfToken, expiresAt } = RevokeToken(req);
    return res.status(CREATED).json(new ApiResponse(CREATED, { result, csrfToken: newCsrfToken, expiresAt: expiresAt }, i18n.__("PAYMENT_INITIATE_SUCCESSS")))
  } catch (error) {
    next(error)
  }
}

const PaymentCallback = async (req, res, next) => {
  const paymentResponse = req.body;

  try {
    let result = await PaymentServices.paymentCallback(req.body, req.user)
    const { newCsrfToken, expiresAt } = RevokeToken(req);
    return res.status(CREATED).json(new ApiResponse(CREATED, { result, csrfToken: newCsrfToken, expiresAt: expiresAt }, i18n.__('PAYMENT_CALLBACK_SUCCESS')))
  } catch (error) {
    next(error)
  }
}

const VerifyPayment = async (req, res, next) => {
  const { orderId } = req.query;

  try {
    const result = await PaymentServices.paymentCallback({ ORDERID: orderId }, req.user);
    const { newCsrfToken, expiresAt } = RevokeToken(req);
    return res
      .status(OK)
      .json(
        new ApiResponse(OK, { result, csrfToken: newCsrfToken, expiresAt }, i18n.__('PAYMENT_VERIFY_SUCCESS'))
      );
  } catch (error) {
    next(error);
  }
};


const PhonePePaymentInitaite = async (req, res, next) => {
  const { phone, amount, name, email } = req.body;

  try {
    await PaymentValidation.validatePhonePePaymentInitiate(req.body)
    const result = await PaymentServices.phonePePaymentInitiate(req.body, req.user);
    const { newCsrfToken, expiresAt } = RevokeToken(req);
    return res
      .status(OK)
      .json(
        new ApiResponse(OK, { result, csrfToken: newCsrfToken, expiresAt }, i18n.__('PHONE_PE_PAYMENT_INITIATE_SUCCESS'))
      );
  } catch (error) {
    next(error);
  }
}

const PhonePeStatus = async (req, res, next) => {
  const { transactionId } = req.query;

  try {
    const result = await PaymentServices.phonePeStatus(req.query);
    if (result.success && result.status === 'SUCCESS') {
      return res.redirect(result.redirectUrl);
    } else {
      return res.redirect(result.redirectUrl);
    }
  } catch (error) {
    next(error);
  }
}
const PaymentController = {
  PaymentInitiate,
  PaymentCallback,
  VerifyPayment,
  PhonePePaymentInitaite,
  PhonePeStatus
}

export default PaymentController;