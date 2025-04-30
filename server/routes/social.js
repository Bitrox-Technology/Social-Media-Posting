import { Router } from "express"
import SocailMediaControllers from "../controllers/social.js"

const socialRouter = Router()
socialRouter.get("/linkedin/auth", SocailMediaControllers.LinkedInAuthentication)
socialRouter.get("/linkedin/callback", SocailMediaControllers.LinkedInCallback) 
socialRouter.post("/linkedin/post", SocailMediaControllers.LinkedInPost)

socialRouter.get("/facebook/auth", SocailMediaControllers.FacebookAuthentication)
socialRouter.get("/facebook/callback", SocailMediaControllers.FacebookCallback) 
socialRouter.post("/facebook/post", SocailMediaControllers.FacebookPost)

socialRouter.get("/instagram/get-ig-account", SocailMediaControllers.GetIGAccount )
socialRouter.post("/instagram/media-create", SocailMediaControllers.InstagramCreateMedia )
socialRouter.post("/instagram/media-publish", SocailMediaControllers.InstagramPublishMedia )


export default socialRouter