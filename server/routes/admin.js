import {Router } from "express"
import AdminControllers from "../controllers/admin.js"
import {AuthMiddleware} from "../middlewares/auth.js"

const adminRouter = Router()
adminRouter.post("/signup", AdminControllers.Signup)
adminRouter.post("/otp-verification", AdminControllers.VerifyOTP)
adminRouter.post("/resend", AdminControllers.ResendOTP)
adminRouter.post("/login", AdminControllers.Login)
adminRouter.post("/forget-password", AdminControllers.ForgetPassword)


adminRouter.get("/get-profile", AuthMiddleware, AdminControllers.GetAdminProfile)
adminRouter.post("/logout", AuthMiddleware, AdminControllers.Logout)
// adminRouter.post("/reset-password", AuthMiddleware, AdminControllers.ResetPassword)

export {
    adminRouter
}
