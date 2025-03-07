import { IgApiClient } from "instagram-private-api";
import fs from "fs-extra";
import { ApiError } from "../utils/ApiError.js";
import cron from "node-cron";
import { convertToCron } from "../utils/utilities.js";
import { ApiResponse } from "../utils/ApiResponse.js";

let scheduledPosts = [];

const postToInsta = async (filePath, caption, mediaType) => {
  try {
    const ig = new IgApiClient();
    ig.state.generateDevice(process.env.IG_USERNAME);

    console.log("Logging in to Instagram...");
    const loggedInUser = await ig.account.login(
      process.env.IG_USERNAME,
      process.env.IG_PASSWORD
    );
    if (!loggedInUser) throw new ApiError(400, "Failed to login to Instagram");

    console.log("Successfully logged in!");
    console.log("Posting to Instagram...");

    if (mediaType === "photo") {
      const photoBuffer = fs.readFileSync(filePath);
      console.log("photoBuffer", photoBuffer);
      const post = await ig.publish.photo({
        file: photoBuffer,
        caption: caption || "New photo",
      });
      if (!post) throw new ApiError(400, "Failed to post to Instagram");
      console.log("Photo posted successfully!", post);
      return post.media.id;
    } else if (mediaType === "video") {
      const videoBuffer = fs.readFileSync(filePath);
      const coverBuffer = fs.readFileSync("./coverImage.png");
      console.log("videoBuffer", videoBuffer);
      console.log("Video buffer length:", videoBuffer.length);
      const post = await ig.publish.video({
        video: videoBuffer,
        coverImage: coverBuffer,
        caption: caption || "New video",
      });
      if (!post) throw new ApiError(400, "Failed to post to Instagram");
      console.log("Video posted successfully!", post);
      return post.media.id;
    }
    return null;
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

const schedulePost = async (filePath, caption, mediaType, scheduleTime) => {
  console.log("Scheduling post for:", scheduleTime);

  const cronExpression = convertToCron(scheduleTime);
  console.log("Generated cron expression:", cronExpression);

  const scheduledDate = new Date(scheduleTime);
  const now = new Date();
  if (scheduledDate <= now) {
    throw new ApiError(400, "Scheduled time must be in the future");
  }

  const task = cron.schedule(
    cronExpression,
    async () => {
      try {
        console.log(
          `Executing scheduled post at ${new Date().toISOString()} for file: ${filePath}`
        );
        if (!fs.existsSync(filePath)) {
          console.error("File not found at scheduled time:", filePath);
          throw new ApiError(400, "Media file not found at scheduled time");
        }

        const postId = await postToInsta(filePath, caption, mediaType);
        console.log(`Scheduled post executed successfully with ID: ${postId}`);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log("File cleaned up:", filePath);
        }

        const index = scheduledPosts.findIndex(
          (post) => post.filePath === filePath
        );
        if (index !== -1) scheduledPosts.splice(index, 1);
        console.log("Post removed from scheduled list");
      } catch (error) {
        console.error("Scheduled post failed:", error.message);
      }
    },
    {
      scheduled: true,
      timezone: 'Asia/Kolkata', // Adjust to your timezone if needed
    }
  );

  scheduledPosts.push({ filePath, caption, mediaType, scheduleTime, task });
  console.log("Scheduled posts:", scheduledPosts);

  return { scheduled: true, filePath, scheduleTime };
};

const authenticateInstagram = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new ApiError(400, 'Username and password are required'));
  }

  try {
    const ig = new IgApiClient();
    ig.state.generateDevice(username);

    console.log('Logging in to Instagram...');
    const loggedInUser = await ig.account.login(username, password);
    if (!loggedInUser) throw new ApiError(400, 'Failed to login to Instagram');

    // Serialize and store the session
    const serializedState = await ig.state.serialize();
    req.session.instagram = {
      username,
      loggedIn: true,
      state: serializedState,
    };

    console.log('Instagram authenticated successfully');
    return res.status(200).json(new ApiResponse(200, { username }, 'Instagram authenticated successfully'));
  } catch (error) {
    console.error('Instagram auth error:', error.message);
    return next(new ApiError(400, 'Invalid Instagram credentials or login failed'));
  }
};

export { postToInsta, schedulePost, authenticateInstagram };
