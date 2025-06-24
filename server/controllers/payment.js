import PaymentServices from "../services/payment.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { CREATED, OK } from "../utils/apiResponseCode.js";
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

  try {
    await PaymentValidation.validatePhonePePaymentInitiate(req.body)
    const result = await PaymentServices.phonePePaymentInitiate(req.body, req.user, { updatePaymentStatus: req.app.get('updatePaymentStatus') });
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
  const { transactionId } = req.body;

  try {
    const result = await PaymentServices.phonePeStatus(req.body, req.user, { updatePaymentStatus: req.app.get('updatePaymentStatus') });
    const { newCsrfToken, expiresAt } = RevokeToken(req);
    return res.status(OK).json( new ApiResponse(OK, { result, csrfToken: newCsrfToken, expiresAt }, i18n.__('PAYMENT_STATUS')))
  } catch (error) {
    next(error);
  }
}

const PhonePePaymentCallback = async (req, res, next) => {

  try {
    const result = await PaymentServices.phonePePaymentCallback(req.params, req.body, { updatePaymentStatus: req.app.get('updatePaymentStatus') });
    const { newCsrfToken, expiresAt } = RevokeToken(req);
    return res.status(OK).json( new ApiResponse(OK, { result, csrfToken: newCsrfToken, expiresAt }, i18n.__('CALLBACK_PROCCESSED')))
  } catch (error) {
    next(error);
  }
}

const GetPaymentById = async (req, res, next) => {

  try {
    const result = await PaymentServices.getPayemntById(req.params, req.user);
    return res.status(OK).json( new ApiResponse(OK, result, i18n.__('PAYMENT_FETCHED_SUCCESS')))
  } catch (error) {
    next(error);
  }
}
const PaymentController = {
  PaymentInitiate,
  PaymentCallback,
  VerifyPayment,
  PhonePePaymentInitaite,
  PhonePeStatus,
  PhonePePaymentCallback,
  GetPaymentById
}

export default PaymentController;