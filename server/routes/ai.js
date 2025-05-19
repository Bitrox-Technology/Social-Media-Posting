import { Router } from "express";
import { upload } from '../middlewares/multer.js';
import PostControllers from "../controllers/controller.js";
import { authenticateInstagram } from "../services/insta.js";   
const aiRouters = Router();

aiRouters.post('/content', PostControllers.Content)
aiRouters.post('/ideas', PostControllers.Ideas)
aiRouters.post('/topics', PostControllers.GenerateTopics)
aiRouters.post("/generate-image", PostControllers.GenerateImage)
aiRouters.post('/post', upload.single('image'), PostControllers.Post )
aiRouters.post("/generate-carousel", PostControllers.GenerateCarousel)
aiRouters.post('/auth/instagram', authenticateInstagram);
aiRouters.post('/upload-carousel',upload.array('images'), PostControllers.UploadCarouselImages);
aiRouters.post('/upload-single', upload.single('image'), PostControllers.UploadSingleImage);
aiRouters.post('/generate-doyouknow', PostControllers.GenerateDoYouKnow);
aiRouters.post('/image-content', PostControllers.GenerateImageContent);
aiRouters.post('/blog-post', PostControllers.BlogPost);
aiRouters.post('/generate-blog', PostControllers.GenerateBlog);
aiRouters.post("/generate-code",upload.single('image'), PostControllers.GenerateCode)

export default aiRouters;