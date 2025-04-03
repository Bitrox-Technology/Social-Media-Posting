import { postToInsta, schedulePost } from "../services/insta.js";
import { Ollama } from "ollama";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import fs from "fs/promises";
import { generateImage } from "../services/imageGenerator.js";
import path from "path";
import { fileURLToPath } from "url";
import { carouselUploadOnCloudinary, uploadOnClodinary } from "../utils/cloudinary.js";
import { generateCarouselContent, generateDoYouKnow, generateTopics, generateImageContent } from "../services/generateCarousel.js";

const ollama = new Ollama({ host: "http://localhost:11434" });

const Content = async (req, res, next) => {
  const { topic } = req.body;

  if (!topic || typeof topic !== "string") {
    throw new ApiError(400, "Please provide a valid topic as a string");
  }

  try {
    const prompt = `Write a short paragraph (50-70 words) about ${topic}. Make it engaging, friendly, and highlight efficiency or innovation. Format the response with "**Title:** [Your Title]" on the first line, then the paragraph with 5 business ideas  without extra newlines or bold markers in the description, and end with hashtags on a new line starting with "#". Exclude any <think> sections.`;

    const response = await ollama.chat({
      model: "deepseek-r1:7b",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    if (!response || !response.message) {
      throw new ApiError(500, "Failed to generate content");
    }
    const generatedContent = response.message.content.trim();
    console.log("Generated content:", generatedContent);

    // Remove <think> section if present
    const thinkStart = generatedContent.indexOf("<think>");
    const thinkEnd = generatedContent.indexOf("</think>");
    let cleanedContent = generatedContent;
    if (thinkStart !== -1 && thinkEnd !== -1) {
      cleanedContent =
        generatedContent.slice(0, thinkStart) +
        generatedContent.slice(thinkEnd + 8);
    }
    cleanedContent = cleanedContent.trim();

    // Extract title
    const titleMatch = cleanedContent.match(/\*\*Title:\*\*\s*(.+)/i);
    const title = titleMatch
      ? titleMatch[1].trim()
      : `5 Innovative Ideas for ${topic}`;

    // Extract hashtags
    const hashtagMatch = cleanedContent.match(/#\w+(?:\s*#?\w+)*/g);
    let hashtags = ["#AI", "#Blockchain", "#Robotics"];
    if (hashtagMatch) {
      const hashtagString = hashtagMatch[hashtagMatch.length - 1];
      hashtags = hashtagString
        .split(/\s+/)
        .filter((tag) => tag.startsWith("#"))
        .map((tag) => tag.trim());
    }

    // Extract content (text between title and hashtags)
    let contentStart = titleMatch
      ? cleanedContent.indexOf(title) + title.length
      : 0;
    let contentEnd = hashtagMatch
      ? cleanedContent.lastIndexOf(hashtagMatch[hashtagMatch.length - 1])
      : cleanedContent.length;
    let contentBody = cleanedContent.slice(contentStart, contentEnd).trim();

    // Clean up content: remove \n\n, **, and extra whitespace
    contentBody = contentBody
      .replace(/\n\n/g, " ") // Replace double newlines with a space
      .replace(/\*\*/g, "") // Remove bold markers
      .replace(/\s+/g, " ") // Normalize multiple spaces to single
      .trim();

    if (!contentBody || contentBody.length < 20) {
      contentBody = `Discover how ${topic} boosts efficiency and innovation in exciting ways!`;
    }

    // Construct the response object
    const contentResponse = {
      title: title,
      content: contentBody,
      hashtags: hashtags,
    };
    return res
      .status(200)
      .json(
        new ApiResponse(200, contentResponse, "Content generated successfully!")
      );
  } catch (error) {
    console.error("Error generating content:", error.message);
    next(error);
  }
};

const Ideas = async (req, res, next) => {
  const { topic } = req.body;

  if (!topic || typeof topic !== "string") {
    throw new ApiError(400, "Please provide a valid topic as a string");
  }

  try {
    const prompt = `
      Generate 5 distinct business ideas about "${topic}" in 50-70 words each. Return the response as a JSON array of 5 objects, where each object has the following fields:
      - "title": a unique title for the idea (string),
      - "content": a short paragraph without extra newlines or bold markers (string),
      - "hashtags": an array of relevant hashtags starting with "#" (string array).
      Example format:
      [
        {
          "title": "Idea 1",
          "content": "This is a short paragraph about the idea.",
          "hashtags": ["#Tag1", "#Tag2"]
        },
        ...
      ]
      Exclude any <think> sections or non-JSON text outside the array.
    `;

    const response = await ollama.chat({
      model: "deepseek-r1:7b",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    if (!response || !response.message) {
      throw new ApiError(500, "Failed to generate content");
    }

    const generatedContent = response.message.content.trim();
    console.log("Generated content:", generatedContent);

    // Remove <think> section and any text before the JSON array
    const jsonStart = generatedContent.indexOf("[");
    const jsonEnd = generatedContent.lastIndexOf("]") + 1;
    let jsonContent = generatedContent;
    if (jsonStart !== -1 && jsonEnd !== -1) {
      jsonContent = generatedContent.slice(jsonStart, jsonEnd);
    } else {
      throw new ApiError(500, "No valid JSON array found in generated content");
    }

    // Parse the JSON array
    let contentArray;
    try {
      contentArray = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError.message);
      throw new ApiError(500, "Generated content is not valid JSON");
    }

    // Validate that it's an array with at least some elements
    if (!Array.isArray(contentArray) || contentArray.length === 0) {
      throw new ApiError(500, "Generated content is not an array or is empty");
    }

    // Ensure exactly 5 ideas (fill with defaults if fewer, truncate if more)
    while (contentArray.length < 5) {
      contentArray.push({
        title: `Fallback Idea ${contentArray.length + 1} for ${topic}`,
        content: `Unlock the potential of ${topic} with this innovative approach to efficiency and growth.`,
        hashtags: ["#Fallback", "#Innovation", `#${topic.replace(/\s+/g, "")}`],
      });
    }
    const finalResponses = contentArray.slice(0, 5);

    // Validate each object has required fields
    for (const idea of finalResponses) {
      if (!idea.title || !idea.content || !Array.isArray(idea.hashtags)) {
        console.warn("Invalid idea object:", idea);
        idea.title = idea.title || `Idea for ${topic}`;
        idea.content =
          idea.content ||
          `Explore how ${topic} drives innovation with this fresh idea!`;
        idea.hashtags = idea.hashtags || ["#AI", "#Innovation", "#Business"];
      }
    }

    // Return the array of content responses
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          finalResponses,
          "Content ideas generated successfully!"
        )
      );
  } catch (error) {
    console.error("Error generating content:", error.message);
    next(error);
  }
};

const Post = async (req, res, next) => {
  let filePath;
  try {
    console.log("Received FormData:", req.body, req.file);

    if (
      !req.file ||
      !req.body.title ||
      !req.body.content ||
      !req.body.hashtags
    ) {
      throw new ApiError(
        400,
        "Missing required fields: title, content, hashtags, and media file"
      );
    }

    const file = req.file;
    const mediaType = file.mimetype.startsWith("image")
      ? "photo"
      : file.mimetype.startsWith("video")
      ? "video"
      : null;
    if (!mediaType)
      throw new ApiError(
        400,
        "Unsupported media type. Use photo (JPEG) or video (MP4)"
      );

    const fileSizeMB = file.size / (1024 * 1024);
    if (mediaType === "photo" && fileSizeMB > 10) {
      throw new ApiError(400, "Photo size exceeds 10MB limit");
    } else if (mediaType === "video" && fileSizeMB > 15) {
      throw new ApiError(400, "Video size exceeds 15MB limit");
    }

    filePath = file.path;
    console.log(
      "Media details:",
      filePath,
      mediaType,
      fileSizeMB.toFixed(2) + "MB"
    );

    const { title, content, hashtags, scheduleTime } = req.body;
    let parsedHashtags;
    try {
      parsedHashtags = JSON.parse(hashtags);
    } catch (e) {
      parsedHashtags = hashtags.split(",");
    }

    const finalCaption = `${title}\n\n${content}${
      parsedHashtags && Array.isArray(parsedHashtags)
        ? "\n\n" + parsedHashtags.map((tag) => `${tag.trim()}`).join(" ")
        : ""
    }`;

    // Log the final caption to verify title inclusion
    console.log("Final caption to be posted:", finalCaption);

    console.log(filePath, finalCaption, mediaType);

    if (scheduleTime) {
      const result = await schedulePost(
        filePath,
        finalCaption,
        mediaType,
        scheduleTime
      );
      return res
        .status(200)
        .json(
          new ApiResponse(200, result, `Post scheduled for ${scheduleTime}`)
        );
    } else {
      const instagramPostId = await postToInsta(
        filePath,
        finalCaption,
        mediaType
      );
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { postId: instagramPostId },
            "Media posted successfully!"
          )
        );
    }
  } catch (error) {
    console.error("Error posting media:", error);
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    next(error);
  }
};

const queue = [];
let isProcessing = false;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const processQueue = async () => {
  if (isProcessing || queue.length === 0) return;
  isProcessing = true;

  const { prompt, negativePrompt, res } = queue.shift();
  try {
    console.log("Generating image...");
    const base64Image = await generateImage(prompt, negativePrompt);
    if (!base64Image) throw new ApiError(500, "Failed to generate image");

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Image, "base64");

    // Save the image to a file
    const imageDir = path.join(__dirname, "../public/images");
    await fs.mkdir(imageDir, { recursive: true }); // Ensure the directory exists
    const imageName = `output_${Date.now()}.png`;
    const imagePath = path.join(imageDir, imageName);
    await fs.writeFile(imagePath, imageBuffer);
    console.log("Image saved to:", imagePath);

    const upload = await uploadOnClodinary(imagePath);
    if (!upload)
      throw new ApiError(500, "Failed to upload image to Cloudinary");
    console.log("Image uploaded to Cloudinary:", upload.secure_url);
    return res
      .status(200)
      .json(
        new ApiResponse(200, upload.secure_url, `Image generated successfully`)
      );
  } catch (error) {
    console.error("Error in processQueue:", error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to generate image",
    });
  } finally {
    isProcessing = false;
    processQueue(); // Process next in queue
  }
};

const GenerateImage = async (req, res, next) => {
  const { prompt } = req.body;
  console.log("Received prompt:", prompt);
  if (!prompt) throw new ApiError(400, "Prompt is required");

  queue.push({
    prompt: `A highly detailed, photorealistic scene of ${prompt}, showcasing futuristic innovation, ultra-sharp details, realistic lighting with soft highlights, intricate textures, vibrant yet professional color palette, visually striking composition, modern and optimistic tone`,
    negativePrompt:
      "cartoon, anime, blurry, low detail, unrealistic, dark, dystopian, overly saturated, chaotic composition, amateurish, dull colors, distorted proportions",
    res,
  });
  try {
    processQueue();
  } catch (err) {
    next(err);
  }
};

const GenerateCarousel = async (req, res, next) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  try {
    const normalizedTopic = topic.toLowerCase().trim();
    const generatedContent = await generateCarouselContent(normalizedTopic);

    return res.status(200).json(new ApiResponse(200, generatedContent, "Successfully generated carousel content"));
  } catch (error) {
    next(error);
  }
};

const UploadCarouselImages = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "No images provided");
  }
  console.log("Received images:", req.files);
  try {
    const imageUrls = await carouselUploadOnCloudinary(req.files);
    console.log("Image URLs:", imageUrls);
    return res.status(200).json(new ApiResponse(200, imageUrls, "Images uploaded successfully"));
  } catch (error) {
    next(error);
  }
};

const UploadSingleImage = async (req, res, next) => {
  if (!req.file) {
    throw new ApiError(400, "No image file provided");
  }

  console.log("Received image:", req.file);

  try {
    const result = await uploadOnClodinary(req.file.path);
    
    return res.status(200).json(new ApiResponse(200, result, "Image uploaded successfully"));
  } catch (error) {
    next(error);
  }
};

const GenerateDoYouKnow = async (req, res, next) => {
  
  const { topic } = req.body;

  if (!topic) {
    throw new ApiError(400, "Topic is required");
  }
  try {
    const result = await generateDoYouKnow(topic);
    return res.status(200).json(new ApiResponse(200, result, "Content genrated successfully"));
  } catch (error) {
    next(error);
  }
};

const GenerateTopics = async (req, res, next) => {
  
  const { business } = req.body;

  if (!business) {
    throw new ApiError(400, "business is required");
  }
  try {
    const result = await generateTopics(business);
    return res.status(200).json(new ApiResponse(200, result, "Topics genrated successfully"));
  } catch (error) {
    next(error);
  }
};
const GenerateImageContent = async (req, res, next) => {
  
  const { topic } = req.body;

  if (!topic) {
    throw new ApiError(400, "Topic is required");
  }
  try {
    const result = await generateImageContent(topic);
    return res.status(200).json(new ApiResponse(200, result, "Content genrated successfully"));
  } catch (error) {
    next(error);
  }
};



export { Post, Content, Ideas, GenerateImage, GenerateCarousel, UploadCarouselImages , UploadSingleImage, GenerateDoYouKnow, GenerateTopics, GenerateImageContent};
