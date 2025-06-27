import { ApiError } from "../utils/apiError.js";
import axios from "axios";

const SD_API_URL = process.env.SD_API_URL || "http://127.0.0.1:7860";

// Generate image with base model and hires fix
async function generateImage(prompt, negativePrompt) {
  const payload = {
    prompt: prompt,
    negative_prompt: negativePrompt,
    steps: 20, // Increased for better detail in base image
    width: 576, // Slightly higher than 512 for more detail
    height: 576, // Matches width for consistent scaling
    sampler_name: 'DPM++ 2M',
    cfg_scale: 7.0, // Slightly increased for sharper features
    batch_size: 1,
    override_settings: {
      sd_model_checkpoint: 'realisticVisionV60B1_v51HyperVAE.safetensors',
      // sd_vae: 'sdxl_vae.safetensors', // Uncomment if sharper VAE helps
    },
    enable_hr: true,
    hr_scale: 1.5, // Upscale to ~864x864 (still under 1024x1024)
    hr_upscaler: 'Latent', // Switch to Lanczos for sharper upscaling
    hr_second_pass_steps: 0, // Increased slightly for refinement
    denoising_strength: 0.7, // Lowered to preserve base details
    // refiner_checkpoint: 'lumina_2.safetensors', // Uncomment if refiner improves sharpness
    // refiner_switch_at: 0.8,
  };



  try {
    const response = await axios.post(
      `${SD_API_URL}/sdapi/v1/txt2img`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
        timeout: 300000, // Add timeout (5 minutes) to prevent hanging
      }
    );

    if (response.data && response.data.images && response.data.images.length > 0) {
      return response.data.images[0];
    } else {
      throw new ApiError(500, "No images returned from API");
    }
  } catch (error) {
    console.error("Image generation failed:", error.message);
    if (error.response) {
      console.error("API Response:", error.response.data);
    }
    throw new ApiError(500, `Error generating image: ${error.message}`);
  }
}

// // Generate image with base model and hires fix
// async function generateImage(prompt, negativePrompt) {
//   const payload = {
//     prompt: prompt,
//     negative_prompt: negativePrompt,
//     steps: 12, // Reduced for speed
//     width: 512, // Lower base resolution
//     height: 512,
//     sampler_name: 'DPM++ SDE Karras', // Faster sampler
//     cfg_scale: 5.0, // Reduced for speed
//     batch_size: 1, // Generate one image at a time
//     override_settings: {
//       sd_model_checkpoint: 'sd_xl_base_1.0.safetensors',
//       sd_vae: 'sdxl_vae.safetensors',
//     },
//     enable_hr: true,
//     hr_scale: 1.3, // Smaller upscale factor
//     hr_upscaler: 'R-ESRGAN 4x+',
//     hr_second_pass_steps: 10, // Reduced for speed
//     denoising_strength: 0.3,
//   };
//   try {
//     const response = await axios.post(
//       `${SD_API_URL}/sdapi/v1/txt2img`,
//       payload,
//       {
//         headers: { "Content-Type": "application/json" },
//       }
//     );

//     console.log("Image data: ", response.data);
//     return response.data.images[0];
//   } catch (error) {
//     console.error(error);

//     throw new ApiError(500, "Error generating image");
//   }
// }

export { generateImage };
