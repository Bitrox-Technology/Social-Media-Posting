import { Router } from "express";
import userRouter  from "./user.js";
import socialRouter from "./social.js";
import adminRouter from "./admin.js";
import aiRouters from "./ai.js";
import csrfRouter from "./csrf.js";

const router = Router()
router.use("/csrf", csrfRouter)
router.use("/user", userRouter)
router.use("/admin", adminRouter)
router.use("/social", socialRouter)
router.use("/", aiRouters)

export default router