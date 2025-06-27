import { Router } from "express"
import GoogleControllers from "../controllers/google.js"

const googleRouter = Router()


googleRouter.get("/auth", GoogleControllers.GoogleAuth)
googleRouter.get("/authoauth2callback", GoogleControllers.GoogleAuthOAuth2Callback)

googleRouter.post('/google-business/post', GoogleControllers.GoogleBusinessPost);

export default googleRouter