import { postToInsta, schedulePost } from "../services/insta.js";
import { Ollama } from "ollama";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import fs from "fs/promises";
import { generateImage } from "../services/imageGenerator.js";
import path from "path";
import { fileURLToPath } from "url";
import { carouselUploadOnCloudinary, uploadOnClodinary } from "../utils/cloudinary.js";
import { generateCarouselContent, generateDoYouKnow, generateTopics, generateImageContent, generateBlog, generateCode } from "../services/generateCarousel.js";
import { postBlog, scheduledBlogPosts } from "../services/blogPost.js";


const ollama = new Ollama({ host: "http://localhost:11434" });

const Content = async (req, res, next) => {
  const { topic } = req.body;

  if (!topic || typeof topic !== "string") {
    throw new ApiError(400, "Please provide a valid topic as a string");
  }

  try {
    const prompt = `Write a short paragraph (50-70 words) about ${topic}. Make it engaging, friendly, and highlight efficiency or innovation. Format the response with "**Title:** [Your Title]" on the first line, then the paragraph with 5 business ideas  without extra newlines or bold markers in the description, and end with hashtags on a new line starting with "#". Exclude any <think> sections.`;

    const response = await ollama.chat({
      model: "deepseek-r1:14b",
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
      model: "deepseek-r1:14b",
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

    const finalCaption = `${title}\n\n${content}${parsedHashtags && Array.isArray(parsedHashtags)
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
      "cartoon, anime, blurry, unrealistic, dark, dystopian, overly saturated, chaotic composition, amateurish",
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


const BlogPost = async (req, res, next) => {

  const postData = {
    title: 'Exploring the Universe with AI: The Future of Space Exploration',
    content: `The universe has always been a source of wonder and mystery for humanity. From ancient civilizations gazing at the stars to modern-day telescopes peering into the farthest reaches of space, our quest to understand the cosmos has never waned. However, as we delve deeper into the vastness of the universe, the challenges grow more complex. Enter Artificial Intelligence (AI), a transformative technology that is revolutionizing how we explore space. In this blog, we’ll explore how AI is helping us unlock the secrets of the universe and what the future holds for this exciting intersection of science and technology.

1. AI in Astronomy: A New Era of Discovery
Astronomy has traditionally relied on human observation and manual data analysis. However, modern telescopes like the Hubble Space Telescope and the James Webb Space Telescope generate an overwhelming amount of data—terabytes every day. Sorting through this data manually would be impossible, but AI is stepping in to help.

Data Processing and Pattern Recognition : Machine learning algorithms excel at identifying patterns in large datasets. For example, AI systems can detect exoplanets by analyzing light curves from distant stars, spotting tiny dips in brightness caused by planets passing in front of them. NASA’s Kepler mission used AI to discover thousands of exoplanets, some of which may harbor conditions suitable for life.
Classifying Celestial Objects : AI models can classify galaxies, stars, and other celestial objects with remarkable accuracy. Tools like Google’s TensorFlow have been used to categorize millions of galaxies based on their shapes, aiding astronomers in understanding galaxy formation and evolution.
2. Autonomous Space Missions: Letting AI Take the Wheel
Space exploration often involves sending probes and rovers to distant planets or moons. These missions operate in environments where real-time communication with Earth is impossible due to signal delays. This is where AI-powered autonomy becomes crucial.

Mars Rovers : NASA’s Perseverance rover uses AI to navigate Martian terrain independently. Its onboard computer processes images of the landscape to avoid obstacles and find the safest path forward. Similarly, the Ingenuity helicopter relies on AI for autonomous flight in Mars’ thin atmosphere.
Satellite Operations : AI enables satellites to make decisions without waiting for commands from Earth. For instance, ESA’s Earth Observation satellites use AI to prioritize imaging tasks during natural disasters, ensuring critical data reaches emergency responders quickly.
3. Searching for Extraterrestrial Life
One of humanity’s greatest questions is whether we are alone in the universe. AI is playing a pivotal role in this search by enhancing our ability to analyze signals and chemical signatures that might indicate life.

Signal Detection : Projects like SETI (Search for Extraterrestrial Intelligence) use AI to sift through radio signals from space, looking for patterns that could suggest intelligent communication. Algorithms trained to distinguish between noise and potential signals increase the chances of detecting alien broadcasts.
Biosignature Analysis : On missions to icy moons like Europa and Enceladus, AI will help analyze subsurface oceans for signs of microbial life. By identifying specific chemical compounds or anomalies in spectral data, AI can guide scientists toward promising locations for further investigation.
4. Simulating Cosmic Phenomena
Understanding the universe requires modeling its most complex phenomena, such as black holes, supernovae, and galaxy collisions. AI-driven simulations allow researchers to create highly detailed models that were previously computationally expensive or even unfeasible.

Neural Networks for Physics Simulations : AI tools like neural networks can simulate gravitational interactions and particle dynamics faster and more accurately than traditional methods. This helps astrophysicists test theories about dark matter, dark energy, and the early universe.
Predictive Modeling : AI can predict outcomes of cosmic events, such as asteroid impacts or solar flares, helping us prepare for potential threats to Earth.
5. Challenges and Ethical Considerations
While AI offers immense potential, it also presents challenges:

Bias in Data : If training datasets are incomplete or biased, AI models may produce inaccurate results. Ensuring diverse and representative data is essential for reliable discoveries.
Overreliance on Automation : As AI takes over more aspects of space exploration, there’s a risk of losing human intuition and creativity, which have historically driven groundbreaking discoveries.
Ethics of Exploration : As we venture deeper into space, ethical questions arise about resource extraction, colonization, and the impact of human activities on extraterrestrial ecosystems. AI must be developed responsibly to address these concerns.

Conclusion
Artificial Intelligence is not just a tool; it’s a partner in humanity’s journey to explore the universe. From discovering new worlds to simulating cosmic events and searching for extraterrestrial life, AI is reshaping how we interact with the cosmos. While challenges remain, the synergy between human ingenuity and machine intelligence promises to accelerate our understanding of the universe—and perhaps one day answer the ultimate question: Are we alone?

As we continue to push the boundaries of knowledge, one thing is clear: AI will play a central role in writing the next chapter of space exploration. So, the next time you look up at the night sky, remember that AI is out there, helping us uncover the mysteries hidden among the stars.`,
    status: 'publish',
  };


  try {
    const result = await postBlog(postData);
    return res.status(200).json(new ApiResponse(200, result, "Blog posted successfully"));
  } catch (error) {
    next(error);
  }
};


const GenerateBlog = async (req, res, next) => {

  const { topic } = req.body;
  if (!topic) {
    throw new ApiError(400, "Topic is required");
  }
  try {
    const result = await generateBlog(topic);
    return res.status(200).json(new ApiResponse(200, result, "Blog generated successfully"));
  } catch (error) {
    next(error);
  }
};

const GenerateCode = async (req, res, next) => {
  try {
    const result = await generateCode(req.body, req.file);
    return res.status(200).json(new ApiResponse(200, result, "Blog generated successfully"));
  } catch (error) {
    next(error);
  }
};


const PostControllers = {
  Post, Content, Ideas, GenerateImage, GenerateCarousel, GenerateBlog,
  UploadCarouselImages, UploadSingleImage, GenerateDoYouKnow, GenerateTopics, GenerateImageContent,
  BlogPost, GenerateCode
};
export default PostControllers;
