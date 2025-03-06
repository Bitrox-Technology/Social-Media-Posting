import { Router } from "express";
import { upload } from '../middlewares/multer.js';
import { Content, Post, Ideas } from "../controllers/controller.js";
const router = Router();

router.post('/content', Content)
router.post('/ideas', Ideas)
router.post('/post',  upload.single('image'), Post )

export default router;