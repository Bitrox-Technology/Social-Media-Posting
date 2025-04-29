import { Router } from "express"
import SocailMediaControllers from "../controllers/social.js"

const socialRouter = Router()
socialRouter.get("/linkedin/auth", SocailMediaControllers.LinkedInAuthentication)
socialRouter.get("/linkedin/callback", SocailMediaControllers.LinkedInCallback) 
socialRouter.post("/linkedin/post", SocailMediaControllers.LinkedInPost)


export default socialRouter