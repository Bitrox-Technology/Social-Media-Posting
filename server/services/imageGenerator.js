import { ApiError } from "../utils/ApiError.js";
import axios from "axios";

const SD_API_URL = "http://127.0.0.1:7860";

// Generate image with base model and hires fix
async function generateImage(prompt, negativePrompt) {
  const payload = {
    prompt: prompt,
    negative_prompt: negativePrompt,
    steps: 20,
    width: 1024, // Lower base resolution for hires fix
    height: 1024,
    sampler_name: 'DPM++ 2M',
    cfg_scale: 7.0,
    batch_size: 1,
    override_settings: {
      sd_model_checkpoint: 'lumina_2.safetensors',
      sd_vae: 'sdxl_vae.safetensors',
    },
    enable_hr: true, // Enable hires fix
    hr_scale: 1.5,   // Upscale to ~1024x1024
    hr_upscaler: 'R-ESRGAN 4x+',
    hr_second_pass_steps: 15, // Use hr_second_pass_steps instead of hr_steps
    denoising_strength: 0.4,  // Correct parameter name
    // refiner_checkpoint: 'lumina_2.safetensors',
    // refiner_switch_at: 0.8,
  };
  try {
    const response = await axios.post(
      `${SD_API_URL}/sdapi/v1/txt2img`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.images[0];
  } catch (error) {
    console.error(error);

    throw new ApiError(500, "Error generating image");
  }
}

export { generateImage };
