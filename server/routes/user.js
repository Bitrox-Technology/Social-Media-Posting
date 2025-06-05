import { Router } from "express"
import UserControllers from "../controllers/user.js"
import { AuthMiddleware } from "../middlewares/auth.js"
import { upload, uploadMemory } from "../middlewares/multer.js"
import { otpGeneratorRateLimiter } from "../middlewares/rateLimiter.js"

const userRouter = Router()
userRouter.post("/signup", otpGeneratorRateLimiter, UserControllers.Signup)
userRouter.post("/verify-otp", UserControllers.VerifyOTP)
userRouter.post("/resend", UserControllers.ResendOTP)
userRouter.post("/forget-password", UserControllers.ForgetPassword)
userRouter.post('/user-details', AuthMiddleware, uploadMemory.any(), UserControllers.UserDetails);
userRouter.get("/get-user-profile", AuthMiddleware, UserControllers.GetUserProfile)
userRouter.post("/signin", UserControllers.Login)
userRouter.post("/logout", AuthMiddleware, UserControllers.Logout)
userRouter.post("/provider", UserControllers.SignupSigninByProvider)

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
userRouter.get("/get-scheduled-posts", AuthMiddleware, UserControllers.GetUserScheduledPosts)
userRouter.post("/product-info", AuthMiddleware,uploadMemory.single('image'), UserControllers.SaveProductInfo)
userRouter.post("/save-blog", AuthMiddleware, UserControllers.SaveBlog)
userRouter.get("/get-all-blogs", AuthMiddleware, UserControllers.GetAllBlogs)
userRouter.get("/get-blog/:blogid", AuthMiddleware, UserControllers.GetBlogById)
userRouter.post("/blog-post", AuthMiddleware, UserControllers.BlogPost)
// userRouter.post("/update-profile", AuthMiddleware, upload.single("avatar"), UserControllers.UpdateProfile)
// userRouter.get("/get-profile", AuthMiddleware, UserControllers.GetProfile)
// userRouter.post("/logout", AuthMiddleware, UserControllers.Logout)
// userRouter.post("/reset-password", AuthMiddleware, UserControllers.ResetPassword)

export default userRouter;