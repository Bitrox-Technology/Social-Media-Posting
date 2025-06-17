import { Router } from "express"
import {AuthMiddleware} from "../middlewares/auth.js"
import PaymentController from "../controllers/payment.js";

const paymentRouter = Router()

paymentRouter.post("/paymeny-initiate", AuthMiddleware, PaymentController.PaymentInitiate)
paymentRouter.post("/callback", AuthMiddleware, PaymentController.PaymentCallback)

paymentRouter.post("/phone-pe/payment-initiate", AuthMiddleware, PaymentController.PhonePePaymentInitaite)
paymentRouter.post("/phone-pe/status", AuthMiddleware, PaymentController.PhonePeStatus  )

export default paymentRouter;