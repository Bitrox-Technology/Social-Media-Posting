import { Router } from "express"
import SocailMediaControllers from "../controllers/social.js"
import {AuthMiddleware} from "../middlewares/auth.js"

const socialRouter = Router()
socialRouter.get("/linkedin/auth",AuthMiddleware, SocailMediaControllers.LinkedInAuthentication)
socialRouter.get("/linkedin/callback", AuthMiddleware, SocailMediaControllers.LinkedInCallback) 
socialRouter.post("/linkedin/post", AuthMiddleware,SocailMediaControllers.LinkedInPost)

socialRouter.get("/facebook/auth",AuthMiddleware, SocailMediaControllers.FacebookAuthentication)
socialRouter.get("/facebook/callback",  AuthMiddleware,SocailMediaControllers.FacebookCallback) 
socialRouter.post("/facebook/post", AuthMiddleware,SocailMediaControllers.FacebookPost)


socialRouter.get("/instagram/auth",AuthMiddleware, SocailMediaControllers.InstagramAuthentication)
socialRouter.get("/instagram/callback",SocailMediaControllers.InstagramCallback) 
socialRouter.get("/instagram/get-ig-account", AuthMiddleware,SocailMediaControllers.GetIGAccount )
socialRouter.post("/instagram/media-create",AuthMiddleware, SocailMediaControllers.InstagramCreateMedia )
socialRouter.post("/instagram/media-publish", AuthMiddleware,SocailMediaControllers.InstagramPublishMedia )

socialRouter.get("/auth/get-auth-detail", AuthMiddleware, SocailMediaControllers.GetSocialAuthDetail);


export default socialRouter