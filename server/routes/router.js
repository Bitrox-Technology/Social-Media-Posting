import { Router } from "express";
import { upload } from '../middlewares/multer.js';
import { Content, Post, Ideas, GenerateImage, GenerateCarousel, UploadCarouselImages, GenerateBlog, UploadSingleImage, GenerateDoYouKnow, GenerateTopics, GenerateImageContent, BlogPost } from "../controllers/controller.js";
import { authenticateInstagram } from "../services/insta.js";   
const router = Router();

router.post('/content', Content)
router.post('/ideas', Ideas)
router.post('/topics', GenerateTopics)
router.post("/generate-image", GenerateImage)
router.post('/post', upload.single('image'), Post )
router.post("/generate-carousel", GenerateCarousel)
router.post('/auth/instagram', authenticateInstagram);
router.post('/upload-carousel',upload.array('images'), UploadCarouselImages);
router.post('/upload-single', upload.single('image'), UploadSingleImage);
router.post('/generate-doyouknow', GenerateDoYouKnow);
router.post('/image-content', GenerateImageContent);
router.post('/blog-post', BlogPost);
router.post('/generate-blog', GenerateBlog);

export default router;