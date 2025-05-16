import { ApiError } from './ApiError.js';
import { BAD_REQUEST } from './apiResponseCode.js';
import { promises as fs } from 'fs'; // Use fs.promises
import { createWriteStream } from 'fs';
import https from 'https';

const downloadImage = async (imageUrl, TEMP_IMAGE_PATH) => {
  try {

    // Make HTTPS request
    const response = await new Promise((resolve, reject) => {
      https.get(imageUrl, resolve).on('error', reject);
    });

    // Check for successful response
    if (response.statusCode !== 200) {
      throw new ApiError(BAD_REQUEST, `Failed to download image: ${response.statusCode}`);
    }

    // Create write stream and pipe response
    const file = createWriteStream(TEMP_IMAGE_PATH);
    response.pipe(file);

    // Wait for the file to finish writing
    await new Promise((resolve, reject) => {
      file.on('finish', resolve);
      file.on('error', reject);
    });

    // Close the file
    file.close();
  } catch (error) {
    // Clean up temporary file if it exists
    try {
      await fs.unlink(TEMP_IMAGE_PATH).catch(() => {}); // Ignore cleanup errors
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError.message);
      // Don't throw cleanup error; prioritize original error
    }
    // Re-throw the original error, preserving its type if it's an ApiError
    throw error instanceof ApiError ? error : new ApiError(BAD_REQUEST, error.message);
  }
};

export { downloadImage }