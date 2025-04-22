import { Router } from "express"
import {Signup, Login, SavePosts, PostContent, GetPostContent, SaveImageContent, SaveCarouselContent, SaveDYKContent, GetSavePosts, GetImageContent, GetCarouselContent, UserDetails, UpdatePost, GetDYKContent} from "../controllers/user.js"
import { AuthMiddleware } from "../middlewares/auth.js"
import { upload } from "../middlewares/multer.js"

// import AuthMiddleware from "../middlewares/auth.js"
// import { upload } from "../middlewares/multer.js"

const userRouter = Router()
userRouter.post("/signup", Signup)
// userRouter.post("/otp_verification", UserControllers.VerifyOTP)
// userRouter.post("/resend", UserControllers.ResendOTP)
// userRouter.post("/forget-password", UserControllers.ForgetPassword)
userRouter.post("/user-details", upload.fields([{ name: 'avatar' }, { name: 'logo' }]), AuthMiddleware, UserDetails)
userRouter.post("/signin", Login)
userRouter.post("/save-topics", AuthMiddleware, PostContent)
userRouter.get("/get-topics/:postcontentid", AuthMiddleware, GetPostContent)
userRouter.post("/image-content", AuthMiddleware, SaveImageContent)
userRouter.post("/carousel-content", AuthMiddleware, SaveCarouselContent)
userRouter.post("/dyk-content", AuthMiddleware, SaveDYKContent)
userRouter.post("/save-posts", AuthMiddleware, SavePosts)
userRouter.get("/get-posts/:postcontentid", AuthMiddleware, GetSavePosts)
userRouter.get("/get-image-content/:contentid", AuthMiddleware, GetImageContent)
userRouter.get("/get-carousel-content/:contentid", AuthMiddleware, GetCarouselContent)
userRouter.get("/get-dyk-content/:contentid", AuthMiddleware, GetDYKContent)
userRouter.put("/update-posts/:postid", AuthMiddleware, UpdatePost)
// userRouter.post("/update-profile", AuthMiddleware, upload.single("avatar"), UserControllers.UpdateProfile)
// userRouter.get("/get-profile", AuthMiddleware, UserControllers.GetProfile)
// userRouter.post("/logout", AuthMiddleware, UserControllers.Logout)
// userRouter.post("/reset-password", AuthMiddleware, UserControllers.ResetPassword)

export {
    userRouter
}