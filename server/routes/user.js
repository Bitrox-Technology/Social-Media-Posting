import { Router } from "express"
import {Signup, Login, SavePosts} from "../controllers/user.js"
// import AuthMiddleware from "../middlewares/auth.js"
// import { upload } from "../middlewares/multer.js"

const userRouter = Router()
userRouter.post("/signup", Signup)
// userRouter.post("/otp_verification", UserControllers.VerifyOTP)
// userRouter.post("/resend", UserControllers.ResendOTP)
// userRouter.post("/forget-password", UserControllers.ForgetPassword)
userRouter.post("/signin", Login)
userRouter.post("/save-posts", AuthMiddleware, SavePosts)
// userRouter.post("/update-profile", AuthMiddleware, upload.single("avatar"), UserControllers.UpdateProfile)
// userRouter.get("/get-profile", AuthMiddleware, UserControllers.GetProfile)
// userRouter.post("/logout", AuthMiddleware, UserControllers.Logout)
// userRouter.post("/reset-password", AuthMiddleware, UserControllers.ResetPassword)

export {
    userRouter
}