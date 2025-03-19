import { Router } from "express";
import { upload } from '../middlewares/multer.js';
import { Content, Post, Ideas, GenerateImage } from "../controllers/controller.js";
import { authenticateInstagram } from "../services/insta.js";   
const router = Router();

router.post('/content', Content)
router.post('/ideas', Ideas)
router.post("/generate-image", GenerateImage)
router.post('/post',  upload.single('image'), Post )
router.post('/auth/instagram', authenticateInstagram);

export default router;