import { Router } from "express"
import UserControllers from "../controllers/user.js"
import { AuthMiddleware } from "../middlewares/auth.js"
import { upload } from "../middlewares/multer.js"

const userRouter = Router()
userRouter.post("/signup", UserControllers.Signup)
userRouter.post("/verify-otp", UserControllers.VerifyOTP)
userRouter.post("/resend", UserControllers.ResendOTP)
userRouter.post("/forget-password", UserControllers.ForgetPassword)
userRouter.post('/user-details', AuthMiddleware, upload.any(), UserControllers.UserDetails);
userRouter.get("/get-user-profile", AuthMiddleware, UserControllers.GetUserProfile)
userRouter.post("/signin", UserControllers.Login)
userRouter.post("/logout", AuthMiddleware, UserControllers.Logout)


userRouter.post("/save-topics", AuthMiddleware, UserControllers.PostContent)
userRouter.get("/get-pending-topics", AuthMiddleware, UserControllers.GetPendingTopics)
userRouter.get("/get-topics/:postcontentid", AuthMiddleware, UserControllers.GetPostContent)
userRouter.post("/image-content", AuthMiddleware, UserControllers.SaveImageContent)
userRouter.post("/carousel-content", AuthMiddleware, UserControllers.SaveCarouselContent)
userRouter.post("/dyk-content", AuthMiddleware, UserControllers.SaveDYKContent)
userRouter.post("/save-posts", AuthMiddleware, UserControllers.SavePosts)
userRouter.get("/get-posts/:postcontentid", AuthMiddleware, UserControllers.GetSavePosts)
userRouter.get("/get-image-content/:contentid", AuthMiddleware, UserControllers.GetImageContent)
userRouter.get("/get-carousel-content/:contentid", AuthMiddleware, UserControllers.GetCarouselContent)
userRouter.get("/get-dyk-content/:contentid", AuthMiddleware, UserControllers.GetDYKContent)
userRouter.put("/update-posts/:postid", AuthMiddleware, UserControllers.UpdatePost)
userRouter.put("/update-post-topic/:posttopicid", AuthMiddleware, UserControllers.UpdatePostTopicsStatus)
userRouter.get("/get-all-posts", AuthMiddleware, UserControllers.GetUserAllPosts)
userRouter.get("/get-user-post/:postid", AuthMiddleware, UserControllers.GetUserPostDetailById)
// userRouter.post("/update-profile", AuthMiddleware, upload.single("avatar"), UserControllers.UpdateProfile)
// userRouter.get("/get-profile", AuthMiddleware, UserControllers.GetProfile)
// userRouter.post("/logout", AuthMiddleware, UserControllers.Logout)
// userRouter.post("/reset-password", AuthMiddleware, UserControllers.ResetPassword)

export {
    userRouter
}