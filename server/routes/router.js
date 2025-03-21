import { Router } from "express";
import { upload } from '../middlewares/multer.js';
import { Content, Post, Ideas, GenerateImage, GenerateCarousel, UploadCarouselImages, UploadSingleImage } from "../controllers/controller.js";
import { authenticateInstagram } from "../services/insta.js";   
const router = Router();

router.post('/content', Content)
router.post('/ideas', Ideas)
router.post("/generate-image", GenerateImage)
router.post('/post',  upload.single('image'), Post )
router.post("/generate-carousel", GenerateCarousel)
router.post('/auth/instagram', authenticateInstagram);
router.post('/upload-carousel',upload.array('images'), UploadCarouselImages);
router.post('/upload-single', upload.single('image'), UploadSingleImage)

export default router;