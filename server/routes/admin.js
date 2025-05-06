import {Router } from "express"
import AdminControllers from "../controllers/admin.js"
import {AuthMiddleware} from "../middlewares/auth.js"
import {upload} from "../middlewares/multer.js"

const adminRouter = Router()
adminRouter.post("/signup", AdminControllers.Signup)
adminRouter.post("/verify-otp", AdminControllers.VerifyOTP)
adminRouter.post("/resend", AdminControllers.ResendOTP)
adminRouter.post("/signin", AdminControllers.Login)
adminRouter.post("/forget-password", AdminControllers.ForgetPassword)
adminRouter.put("/update-profile", AuthMiddleware, upload.single("profileImage"), AdminControllers.UpdateAdminProfile)

adminRouter.get("/get-profile", AuthMiddleware, AdminControllers.GetAdminProfile)
adminRouter.post("/logout", AuthMiddleware, AdminControllers.Logout)
adminRouter.get("/get-all-users", AuthMiddleware, AdminControllers.GetAllUsers)
adminRouter.get("/get-user/:userId", AuthMiddleware, AdminControllers.GetUserById)
// adminRouter.post("/reset-password", AuthMiddleware, AdminControllers.ResetPassword)

export {
    adminRouter
}
