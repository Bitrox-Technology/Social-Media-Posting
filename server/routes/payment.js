import { Router } from "express"
import {AuthMiddleware} from "../middlewares/auth.js"
import PaymentController from "../controllers/payment.js";

const paymentRouter = Router()

paymentRouter.post("/paymeny-initiate", AuthMiddleware, PaymentController.PaymentInitiate)
paymentRouter.post("/callback", AuthMiddleware, PaymentController.PaymentCallback)

export default paymentRouter;