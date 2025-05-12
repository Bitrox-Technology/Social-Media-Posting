import { Router } from "express";
import { upload } from '../middlewares/multer.js';
import PostControllers from "../controllers/controller.js";
import { authenticateInstagram } from "../services/insta.js";   
const router = Router();

router.post('/content', PostControllers.Content)
router.post('/ideas', PostControllers.Ideas)
router.post('/topics', PostControllers.GenerateTopics)
router.post("/generate-image", PostControllers.GenerateImage)
router.post('/post', upload.single('image'), PostControllers.Post )
router.post("/generate-carousel", PostControllers.GenerateCarousel)
router.post('/auth/instagram', authenticateInstagram);
router.post('/upload-carousel',upload.array('images'), PostControllers.UploadCarouselImages);
router.post('/upload-single', upload.single('image'), PostControllers.UploadSingleImage);
router.post('/generate-doyouknow', PostControllers.GenerateDoYouKnow);
router.post('/image-content', PostControllers.GenerateImageContent);
router.post('/blog-post', PostControllers.BlogPost);
router.post('/generate-blog', PostControllers.GenerateBlog);
router.post("/generate-code",upload.single('image'), PostControllers.GenerateCode)

export default router;