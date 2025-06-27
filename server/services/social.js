import axios from "axios";
import { ApiError } from "../utils/apiError.js";
import { BAD_REQUEST } from "../utils/apiResponseCode.js";
import querystring from "querystring";
import { downloadImage } from "../utils/postUtils.js";
import { createReadStream } from "fs";
import { promises as fs } from "fs";
import {
  convertToCron,
  decryptToken,
  encryptToken,
} from "../utils/utilities.js";
import SocialAuth from "../models/socialAuth.js";
import i18n from "../utils/i18n.js";
import { v4 as uuidv4 } from "uuid";
import cron from "node-cron";
import UserScheduledTask from "../models/userSchesuledTask.js";



const linkedInAuthentication = (user) => {
  const authUrl =
    `https://www.linkedin.com/oauth/v2/authorization?` +
    querystring.stringify({
      response_type: "code",
      client_id: process.env.LINKEDIN_CLIENT_ID,
      redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
      scope: "openid profile email w_member_social",
      state: JSON.stringify({ platform: "linkedin", userId: user._id }),
    });
  return authUrl;
};


const linkedInCallback = async (query) => {
  if (query.error) {
    throw new ApiError(
      BAD_REQUEST,
      "LinkedIn authentication error: " + query.error_description
    );
  }

  if (!query.code) {
    throw new ApiError(BAD_REQUEST, "Authorization code is required");
  }

  let state;
  try {
    state = JSON.parse(query.state);
    console.log('Parsed state:', state);
  } catch (error) {
    throw new Error("Invalid state parameter");
  }

  console.log("query", query.code);

  const tokenResponse = await axios
    .post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      querystring.stringify({
        grant_type: "authorization_code",
        code: query.code,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        display: "popup",
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    )
    .catch((error) => {
      throw new ApiError(
        error.response?.status || BAD_REQUEST,
        `Failed to get access token from LinkedIn: ${error.response?.data?.error_description || error.message}`
      );
    });
  if (tokenResponse.status !== 200) {
    throw new ApiError(BAD_REQUEST, "Failed to get access token from LinkedIn");
  }

  const accessToken = tokenResponse.data.access_token;
  const expiresIn = tokenResponse.data.expires_in;
  const expiresAt = new Date(Date.now() + expiresIn * 1000);

  console.log("Access Token Response:", tokenResponse.data);

  const profileRes = await axios
    .get("https://api.linkedin.com/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .catch((error) => {
      throw new ApiError(
        error.response?.status || BAD_REQUEST,
        `Failed to get LinkedIn profile: ${error.response?.data?.error_description || error.message}`
      );
    });
  const profileData = profileRes.data;
  console.log("Profile Data:", profileData);

  let administeredPages = [];
  try {
    const requestHeaders = {
      Authorization: `Bearer ${accessToken}`,
      "X-Restli-Protocol-Version": "2.0.0",
      "Content-Type": "application/json",
      "LinkedIn-Version": "202407", // Try June 2024
    };
    console.log("Sending request to fetch administered pages with headers:", requestHeaders);

    const pagesResponse = await axios.get(
      "https://api.linkedin.com/rest/organizationalEntityAcls?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED&projection=(elements*(organizationalTarget~(vanityName,localizedName)))",
      {
        headers: requestHeaders,
      }
    );

    console.log("Administered Pages Response:", pagesResponse.data);

    administeredPages =
      pagesResponse.data.elements?.map((element) => ({
        urn: element["organizationalTarget"],
        vanityName: element["organizationalTarget~"]?.vanityName || "",
        localizedName: element["organizationalTarget~"]?.localizedName || "",
      })) || [];

    console.log("Mapped Administered Pages:", administeredPages);

    // Store the retrieved URNs for future use
    if (administeredPages.length > 0) {
      const newUrns = administeredPages.map(page => page.urn);
      await SocialAuth.updateOne(
        { userId: state.userId },
        { $set: { "linkedin.knownPageUrns": newUrns } }
      );
      console.log("Stored new URNs in SocialAuth:", newUrns);
    }
  } catch (error) {
    console.error("Error fetching administered pages:", error.response?.data || error.message);
    // Fallback: Direct fetch with known URNs
    const socialAuth = await SocialAuth.findOne({ userId: state.userId });
    const knownPageUrns = socialAuth?.linkedin?.knownPageUrns || [];
    console.log("Known Page URNs from SocialAuth:", knownPageUrns);

    if (knownPageUrns.length > 0) {
      for (const urn of knownPageUrns) {
        try {
          const orgId = urn.split(":").pop();
          const directHeaders = {
            Authorization: `Bearer ${accessToken}`,
            "X-Restli-Protocol-Version": "2.0.0",
            "Content-Type": "application/json",
          };
          console.log(`Sending direct fetch request for ${urn} with headers:`, directHeaders);

          const pageResponse = await axios.get(
            `https://api.linkedin.com/rest/organizations/${orgId}`,
            {
              headers: directHeaders,
              params: {
                projection: "(vanityName,localizedName)",
              },
            }
          );

          console.log(`Direct Page Fetch Response for ${urn}:`, pageResponse.data);

          administeredPages.push({
            urn: urn,
            vanityName: pageResponse.data.vanityName || "",
            localizedName: pageResponse.data.localizedName || "",
          });

          console.log("Updated Administered Pages after direct fetch:", administeredPages);
        } catch (fetchError) {
          console.error(
            `Error fetching specific page ${urn} directly:`,
            fetchError.response?.data || fetchError.message
          );
        }
      }
    } else {
      console.log("No known page URNs found for fallback.");
    }
  }

  const encrypt_accessToken = encryptToken(accessToken);
  console.log("Encrypted Access Token:", encrypt_accessToken);

  const updateData = {
    linkedin: {
      isAuthenticated: true,
      accessToken: {
        token: encrypt_accessToken,
        expiresAt: expiresAt,
      },
      profilePage: `urn:li:person:${profileData.sub}`,
      profileData,
      administeredPages,
    },
  };
  console.log("Data to be stored in SocialAuth:", updateData);

  const existingAuth = await SocialAuth.findOne({ userId: state.userId });
  if (existingAuth) {
    console.log("Existing SocialAuth record found:", existingAuth);
    await SocialAuth.updateOne(
      { userId: state.userId },
      { $set: updateData },
      { upsert: true }
    );
    console.log("SocialAuth record updated for userId:", state.userId);
  } else {
    await SocialAuth.create({
      userId: state.userId,
      ...updateData,
    });
    console.log("New SocialAuth record created for userId:", state.userId);
  }

  return { profileData, administeredPages };
};

const getSocialAuthDetail = async (user) => {
  const socialAuth = await SocialAuth.findOne({ userId: user._id }).lean();
  if (!socialAuth)
    throw new ApiError(BAD_REQUEST, i18n.__("SOCIAL_AUTH_DETAIL_NOT_FOUND"));

  return socialAuth;
};

// const fetchAdministeredPages = async (accessToken) => {
//   try {
//     const response = await axios.get(
//       "https://api.linkedin.com/rest/organizationalEntityAcls?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED&projection=(elements*(organizationalTarget~(vanityName,localizedName)))",
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "X-Restli-Protocol-Version": "2.0.0",
//           "Content-Type": "application/json",
//           "LinkedIn-Version": "202301", // Use latest version
//         },
//       }
//     );

//     const pages = response.data.elements.map((element) => ({
//       urn: element.organizationalTarget,
//       name: element["organizationalTarget~"].localizedName,
//       vanityName: element["organizationalTarget~"].vanityName,
//     }));

//     return pages;
//   } catch (error) {
//     throw new ApiError(
//       error.response?.status || BAD_REQUEST,
//       `Failed to fetch administered pages: ${error.response?.data?.message || error.message
//       }`
//     );
//   }
// };

const linkedInPagePost = async (inputs, accessToken, organizationUrn) => {
  let post;

  if (!organizationUrn) {
    throw new ApiError(BAD_REQUEST, "Organization URN is required");
  }

  const TEMP_IMAGE_PATH = `./Uploads/temp_image_${Date.now()}.png`;
  await downloadImage(inputs.imageUrl, TEMP_IMAGE_PATH);

  const registerPayload = {
    registerUploadRequest: {
      recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
      owner: organizationUrn, // Use organization URN instead of person URN
      serviceRelationships: [
        {
          relationshipType: "OWNER",
          identifier: "urn:li:userGeneratedContent",
        },
      ],
    },
  };

  let response;

  try {
    response = await axios.post(
      "https://api.linkedin.com/v2/assets?action=registerUpload",
      registerPayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
          "Content-Type": "application/json",
          "LinkedIn-Version": "202301", // Use latest version
        },
      }
    );
  } catch (error) {
    throw new ApiError(
      error.response?.status || BAD_REQUEST,
      `Failed to register upload: ${error.response?.data?.message || error.message
      }`
    );
  }

  let uploadUrl =
    response.data.value.uploadMechanism[
      "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
    ].uploadUrl;
  let asset = response.data.value.asset;

  try {
    const fileStream = createReadStream(TEMP_IMAGE_PATH);
    await axios.put(uploadUrl, fileStream, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "image/png",
      },
    });
    console.log("Image uploaded successfully");
  } catch (error) {
    throw new ApiError(
      error.response?.status || BAD_REQUEST,
      `Failed to upload image: ${error.response?.data?.message || error.message
      }`
    );
  }

  const sharePayload = {
    author: organizationUrn, // Use organization URN
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text: inputs.title + "\n" + inputs.description },
        shareMediaCategory: "IMAGE",
        media: [
          {
            status: "READY",
            description: { text: inputs.description },
            media: asset,
            title: { text: inputs.title },
          },
        ],
      },
    },
    visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
  };

  try {
    response = await axios.post(
      "https://api.linkedin.com/v2/ugcPosts",
      sharePayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
          "Content-Type": "application/json",
          "LinkedIn-Version": "202301",
        },
      }
    );
  } catch (error) {
    throw new ApiError(
      error.response?.status || BAD_REQUEST,
      `Failed to create page post: ${error.response?.data?.message || error.message
      }`
    );
  }

  post = response.headers["x-restli-id"];

  await fs.unlink(TEMP_IMAGE_PATH).catch(() => { });

  return post;
};

const linkedInPost = async (inputs) => {
  let post;

  inputs.accessToken = decryptToken(inputs.accessToken);

  // Array to store uploaded asset IDs and temporary file paths
  const mediaAssets = [];
  const tempImagePaths = [];

  // Validate imagesUrl
  if (!inputs.imagesUrl || !Array.isArray(inputs.imagesUrl) || inputs.imagesUrl.length === 0) {
    throw new ApiError(BAD_REQUEST, "At least one image URL is required");
  }

  // Upload each image
  for (const [index, imageUrl] of inputs.imagesUrl.entries()) {
    const TEMP_IMAGE_PATH = `./Uploads/temp_image_${Date.now()}_${index}.png`;
    tempImagePaths.push(TEMP_IMAGE_PATH);
    await downloadImage(imageUrl, TEMP_IMAGE_PATH);

    const registerPayload = {
      registerUploadRequest: {
        recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
        owner: inputs.person_urn,
        serviceRelationships: [
          {
            relationshipType: "OWNER",
            identifier: "urn:li:userGeneratedContent",
          },
        ],
      },
    };

    let response;
    try {
      response = await axios.post(
        "https://api.linkedin.com/v2/assets?action=registerUpload",
        registerPayload,
        {
          headers: {
            Authorization: `Bearer ${inputs.accessToken}`,
            "X-Restli-Protocol-Version": "2.0.0",
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      throw new ApiError(
        error.response?.status || BAD_REQUEST,
        `Failed to register upload for image ${index + 1}: ${
          error.response?.data?.message || error.message
        }`
      );
    }

    const uploadUrl =
      response.data.value.uploadMechanism[
        "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
      ].uploadUrl;
    const asset = response.data.value.asset;

    try {
      const fileStream = createReadStream(TEMP_IMAGE_PATH);
      await axios.put(uploadUrl, fileStream, {
        headers: {
          Authorization: `Bearer ${inputs.accessToken}`,
          "Content-Type": "image/png", // Adjust based on file type if needed
        },
      });
      console.log(`Image ${index + 1} uploaded successfully`);
      mediaAssets.push(asset);
    } catch (error) {
      throw new ApiError(
        error.response?.status || BAD_REQUEST,
        `Failed to upload image ${index + 1}: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  // Create share payload
  const sharePayload = {
    author: inputs.person_urn,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: {
          text: inputs.title + "\n" + inputs.description + "\n" + inputs.hashTags,
        },
        shareMediaCategory: "IMAGE",
        media: mediaAssets.map((asset, index) => ({
          status: "READY",
          description: {
            text: inputs.description,
          },
          media: asset,
          title: {
            text: inputs.imagesUrl.length === 1 ? inputs.title : `${inputs.title} ${index + 1}`,
          },
        })),
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  try {
    const response = await axios.post(
      "https://api.linkedin.com/v2/ugcPosts",
      sharePayload,
      {
        headers: {
          Authorization: `Bearer ${inputs.accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
          "Content-Type": "application/json",
        },
      }
    );
    post = response.headers["x-restli-id"];
  } catch (error) {
    throw new ApiError(
      error.response?.status || BAD_REQUEST,
      `Failed to create share: ${error.response?.data?.message || error.message}`
    );
  }

  // Clean up temporary files
  for (const tempPath of tempImagePaths) {
    await fs.unlink(tempPath).catch(() => {});
  }

  return post;
};
const scheduledLinkedPosts = async (inputs, user) => {
  let postResult;

  if (inputs.scheduleTime && inputs.scheduleTime !== "") {
    const cronExpression = convertToCron(inputs.scheduleTime);
    console.log("Generated cron expression:", cronExpression);

    const scheduledDate = new Date(inputs.scheduleTime);
    const now = new Date();
    if (scheduledDate <= now) {
      throw new ApiError(BAD_REQUEST, i18n.__("INVALID_SCHEDULED_TIME"));
    }

    const taskId = uuidv4();

    const scheduledTask = new UserScheduledTask({
      userId: user._id,
      taskId,
      task: "Post to LinkedIn",
      platform: "linkedin",
      imagesUrl: inputs.imagesUrl,
      title: inputs.title,
      description: inputs.description,
      scheduleTime: scheduledDate,
      cronExpression,
      status: "pending",
      postId: null,
    });

    await scheduledTask.save();

    // Schedule the task using node-cron
    const task = cron.schedule(
      cronExpression,
      async () => {
        try {
          postResult = await linkedInPost(inputs);
          console.log(
            `Scheduled post executed successfully with post ID: ${postResult}`
          );

          // Update the scheduled task with the postId and status
          await UserScheduledTask.updateOne(
            { taskId },
            {
              $set: {
                status: "completed",
                postId: postResult,
              },
            }
          );
        } catch (error) {
          console.error("Scheduled LinkedIn post failed:", error.message);

          // Update the scheduled task status to 'failed'
          await UserScheduledTask.updateOne(
            { taskId },
            {
              $set: {
                status: "failed",
              },
            }
          );
        }
      },
      {
        scheduled: true,
        timezone: "Asia/Kolkata", // Use IST timezone as per the current date
      }
    );

    return {
      message: `Post scheduled successfully for ${scheduledDate.toLocaleString(
        "en-IN",
        { timeZone: "Asia/Kolkata" }
      )}`,
      taskId,
      postId: null,
    };
  } else {
    postResult = await linkedInPost(inputs);
    console.log(`Post executed immediately with post ID: ${postResult}`);
    if (!postResult) throw new ApiError(BAD_REQUEST, i18n.__("POST_FAILED"));
    return {
      message: "Post published immediately",
      postId: postResult,
    };
  }
};

const facebookAuthentication = (user) => {
  const platform = "facebook"

  const fbAuthUrl =
    `https://www.facebook.com/v23.0/dialog/oauth?` +
    querystring.stringify({
      response_type: "code",
      client_id: process.env.FB_APP_ID,
      redirect_uri: process.env.FB_REDIRECT_URI,
      scope: "email,pages_show_list, pages_manage_metadata, pages_manage_posts,  pages_manage_engagement, pages_read_engagement, instagram_basic,instagram_content_publish",
      state: JSON.stringify({ platform, userId: user._id }),
    });
  console.log("Fb url", fbAuthUrl)
  return fbAuthUrl;
};

// const fetchPagesAlternative = async (userAccessToken, userId) => {
//   let managedPages = [];

//   try {
//     // Step 1: Fetch Business Accounts
//     const businessAccountsResponse = await axios.get(
//       `https://graph.facebook.com/v23.0/${userId}/businesses`,
//       {
//         params: {
//           fields: "id,name",
//           access_token: userAccessToken,
//         },
//       }
//     );
//     console.log("Business Accounts Response:", businessAccountsResponse.data);

//     if (businessAccountsResponse.data.data && businessAccountsResponse.data.data.length > 0) {
//       const businessAccounts = businessAccountsResponse.data.data;
//       for (const business of businessAccounts) {
//         const businessId = business.id;
//         try {
//           const pagesResponse = await axios.get(
//             `https://graph.facebook.com/v23.0/${businessId}/owned_pages`,
//             {
//               params: {
//                 fields: "id,name,access_token",
//                 access_token: userAccessToken,
//               },
//             }
//           );
//           console.log(`Pages for Business Account ${businessId}:`, pagesResponse.data);

//           if (pagesResponse.data.data && pagesResponse.data.data.length > 0) {
//             const pages = pagesResponse.data.data.map((page) => ({
//               id: page.id,
//               name: page.name,
//               accessToken: page.access_token,
//             }));
//             managedPages.push(...pages);
//           }
//         } catch (error) {
//           console.error(
//             `Error fetching Pages for Business Account ${businessId}:`,
//             error.response?.data?.error?.message || error.message
//           );
//         }
//       }
//     } else {
//       console.log("No Business Accounts found, trying direct Pages fetch...");
//     }

//     // Step 2: If still empty, try fetching Pages directly via /me/pages
//     if (managedPages.length === 0) {
//       try {
//         const directPagesResponse = await axios.get(
//           `https://graph.facebook.com/v23.0/me/pages`,
//           {
//             params: {
//               fields: "id,name,access_token",
//               access_token: userAccessToken,
//             },
//           }
//         );
//         console.log("Direct Pages Response:", directPagesResponse.data);

//         if (directPagesResponse.data.data && directPagesResponse.data.data.length > 0) {
//           managedPages = directPagesResponse.data.data.map((page) => ({
//             id: page.id,
//             name: page.name,
//             accessToken: page.access_token,
//           }));
//         }
//       } catch (error) {
//         console.error(
//           "Error fetching Pages directly:",
//           error.response?.data?.error?.message || error.message
//         );
//       }
//     }
//   } catch (error) {
//     console.error(
//       "Error fetching Business Accounts:",
//       error.response?.data?.error?.message || error.message
//     );
//   }

//   return managedPages;
// };

const fetchPagesAlternative = async (userAccessToken, userId) => {
  let managedPages = [];

  try {
    // Step 1: Fetch Business Accounts
    const businessAccountsResponse = await axios.get(
      `https://graph.facebook.com/v23.0/${userId}/businesses`,
      {
        params: {
          fields: "id,name",
          access_token: userAccessToken,
        },
      }
    );
    console.log("Business Accounts Response:", businessAccountsResponse.data);

    if (businessAccountsResponse.data.data && businessAccountsResponse.data.data.length > 0) {
      const businessAccounts = businessAccountsResponse.data.data;
      for (const business of businessAccounts) {
        const businessId = business.id;
        try {
          const pagesResponse = await axios.get(
            `https://graph.facebook.com/v23.0/${businessId}/owned_pages`,
            {
              params: {
                fields: "id,name,access_token",
                access_token: userAccessToken,
              },
            }
          );
          console.log(`Pages for Business Account ${businessId}:`, pagesResponse.data);

          if (pagesResponse.data.data && pagesResponse.data.data.length > 0) {
            const pages = pagesResponse.data.data.map((page) => ({
              id: page.id,
              name: page.name,
              accessToken: page.access_token,
            }));
            managedPages.push(...pages);
          }
        } catch (error) {
          console.error(
            `Error fetching Pages for Business Account ${businessId}:`,
            error.response?.data?.error?.message || error.message
          );
        }
      }
    } else {
      console.log("No Business Accounts found, trying direct Page fetch...");
    }

    // Step 2: If still empty, fetch known Pages
    if (managedPages.length === 0) {
      const socialAuth = await SocialAuth.findOne({ userId });
      const knownPageIds = socialAuth.knownPageIds || ["673762845815727"]; // Fallback to hardcoded ID if not set
      for (const pageId of knownPageIds) {
        try {
          const pageResponse = await axios.get(
            `https://graph.facebook.com/v23.0/${pageId}`,
            {
              params: {
                fields: "id,name,access_token",
                access_token: userAccessToken,
              },
            }
          );
          console.log(`Direct Page Fetch Response for ${pageId}:`, pageResponse.data);

          if (pageResponse.data.id) {
            managedPages.push({
              id: pageResponse.data.id,
              name: pageResponse.data.name,
              accessToken: pageResponse.data.access_token,
            });
          }
        } catch (error) {
          console.error(
            `Error fetching specific Page ${pageId} directly:`,
            error.response?.data?.error?.message || error.message
          );
        }
      }
    }
  } catch (error) {
    console.error(
      "Error fetching Business Accounts:",
      error.response?.data?.error?.message || error.message
    );
  }

  return managedPages;
};

const facebookCallback = async (query, user) => {
  console.log('Callback query:', query); // Log the entire query object

  let state;
  try {
    state = JSON.parse(query.state);
    console.log('Parsed state:', state); // Log the parsed state
  } catch (error) {
    throw new Error("Invalid state parameter");
  }

  if (query.error) {
    throw new ApiError(
      BAD_REQUEST,
      "Facebook authentication error: " + query.error_description
    );
  }

  if (!query.code) {
    throw new ApiError(BAD_REQUEST, "Authorization code is required");
  }

  console.log("Authorization Code:", query.code);

  // Exchange code for user access token
  const tokenResponse = await axios
    .get("https://graph.facebook.com/v23.0/oauth/access_token", {
      params: {
        client_id: process.env.FB_APP_ID,
        client_secret: process.env.FB_APP_SECRET,
        redirect_uri: process.env.FB_REDIRECT_URI,
        code: query.code,
      },
    })
    .catch((error) => {
      throw new ApiError(
        error.response?.status || BAD_REQUEST,
        `Failed to get access token from Facebook: ${error.response?.data?.error?.message || error.message
        }`
      );
    });

  console.log("Token response", tokenResponse.data)

  if (!tokenResponse.data.access_token) {
    throw new ApiError(BAD_REQUEST, "Failed to get access token from Facebook");
  }

  const userAccessToken = tokenResponse.data.access_token;
  const expiresIn = tokenResponse.data.expires_in || null; // Short-lived tokens may have expires_in
  const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000) : null;

  console.log("User Access Token:", userAccessToken);
  console.log("expiresIn:", expiresIn);
  console.log("User Access Token:", expiresAt);

  // Fetch user profile
  const profileRes = await axios
    .get("https://graph.facebook.com/v23.0/me", {
      params: {
        fields: "id,name,email",
        access_token: userAccessToken,
      },
    })
    .catch((error) => {
      throw new ApiError(
        error.response?.status || BAD_REQUEST,
        `Failed to get Facebook profile: ${error.response?.data?.error?.message || error.message
        }`
      );
    });
  const profileData = profileRes.data;
  console.log("Profile Data:", profileData);

  // Fetch managed pages
  let managedPages = [];
  try {
    const pagesResponse = await axios.get(
      `https://graph.facebook.com/v23.0/me/accounts`,
      {
        params: {
          fields: "id,name,access_token",
          access_token: userAccessToken,
        },
      }
    );
    console.log("PagesResponse", pagesResponse.data)
    if (pagesResponse.data.data && pagesResponse.data.data.length > 0) {
      managedPages = pagesResponse.data.data.map((page) => ({
        id: page.id,
        name: page.name,
        accessToken: page.access_token,
      }));
      console.log("Managed Pages:", managedPages);
    } else {
      console.log("Pages response is empty, trying alternative method...");
      // Call a fallback function to retrieve Pages
      managedPages = await fetchPagesAlternative(userAccessToken, profileData.id);
      console.log("Managed Pages from alternative method:", managedPages);
    }
  } catch (error) {
    console.error(
      "Error fetching managed pages:",
      error.response?.data?.error?.message || error.message
    );
    managedPages = []; // Continue with empty pages if request fails
  }

  // Encrypt tokens
  const encrypt_userAccessToken = encryptToken(userAccessToken);
  const encryptedManagedPages = managedPages.map((page) => ({
    id: page.id,
    name: page.name,
    accessToken: encryptToken(page.accessToken),
  }));
  let instagramAccounts = [];
  if (managedPages.length > 0) {
    for (const page of managedPages) {
      try {
        const igResponse = await axios.get(`https://graph.facebook.com/v23.0/${page.id}`, {
          params: {
            fields: "instagram_business_account{id,username}",
            access_token: page.accessToken,
          },
        });
        if (igResponse.data.instagram_business_account) {
          instagramAccounts.push({
            id: igResponse.data.instagram_business_account.id,
            username: igResponse.data.instagram_business_account.username,
            pageId: page.id,
            accessToken: page.accessToken,
          });
        }
        console.log(`Instagram account for page ${page.id}:`, igResponse.data.instagram_business_account || "None");
      } catch (error) {
        console.error(`Error fetching Instagram for page ${page.id}:`, error.response?.data || error.message);
      }
    }
  } else {
    console.log("No managed pages, skipping Instagram fetch");
  }
  console.log("Instagram Accounts:", instagramAccounts);

  const encryptedInstagramAccounts = instagramAccounts.map((account) => ({
    id: account.id,
    username: account.username,
    pageId: account.pageId,
    accessToken: encryptToken(account.accessToken),
  }));
  // Prepare update data for SocialAuth
  const updateData = {
    facebook: {
      isAuthenticated: true,
      accessToken: {
        token: encrypt_userAccessToken,
        expiresAt: expiresAt, // Null for long-lived tokens in business apps
      },
      profileData,
      managedPages: encryptedManagedPages,
    },
    instagram: {
      isAuthenticated: instagramAccounts.length > 0,
      accounts: encryptedInstagramAccounts,
    },
  };

  // Update or create SocialAuth record
  const existingAuth = await SocialAuth.findOne({ userId: state.userId });
  if (existingAuth) {
    await SocialAuth.updateOne(
      { userId: state.userId },
      { $set: updateData },
      { upsert: true }
    );
  } else {
    await SocialAuth.create({
      userId: state.userId,
      ...updateData,
    });
  }

  return { profileData, managedPages };
};


const uploadUnpublishedPhoto = async (pageId, accessToken, imageUrl, caption, index) => {
  const uploadEndpoint = `https://graph.facebook.com/v23.0/${pageId}/photos`;
  const postData = {
    access_token: accessToken,
    url: imageUrl,
    caption,
    published: false, // don't publish directly
  };

  try {
    console.log(`Uploading image ${index + 1} (unpublished):`, imageUrl);
    const response = await axios.post(uploadEndpoint, postData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data.id; // media_fbid
  } catch (error) {
    const errorMessage = error.response?.data?.error?.message || error.message;
    const errorCode = error.response?.status || BAD_REQUEST;
    console.error(`Failed to upload image ${index + 1}:`, error.response?.data || error);
    throw new ApiError(errorCode, `Image ${index + 1} upload failed: ${errorMessage}`);
  }
};

// Main function
const facebookPostOnPage = async (inputs) => {
  if (!inputs.pageId || !inputs.pageAccessToken) {
    throw new ApiError(BAD_REQUEST, "Page ID and access token are required");
  }

  const accessToken = decryptToken(inputs.pageAccessToken);
  const imagesUrl = Array.isArray(inputs.imagesUrl)
    ? inputs.imagesUrl
    : inputs.imagesUrl
    ? [inputs.imagesUrl]
    : [];

  const message = `${inputs.title || ''}\n\n${inputs.description || ''}\n\n${inputs.hashTags || ''}`.trim();

  // 🧩 Case 1: Carousel (multi-image)
  if (imagesUrl.length > 1) {
    const mediaFbids = [];

    for (const [index, imageUrl] of imagesUrl.entries()) {
      const mediaFbid = await uploadUnpublishedPhoto(
        inputs.pageId,
        accessToken,
        imageUrl,
        message,
        index
      );
      mediaFbids.push({ media_fbid: mediaFbid });
    }

    const feedEndpoint = `https://graph.facebook.com/v23.0/${inputs.pageId}/feed`;
    const postData = {
      access_token: accessToken,
      attached_media: JSON.stringify(mediaFbids),
      message,
    };

    try {
      console.log("Posting carousel to feed endpoint:", feedEndpoint);
      const post = await axios.post(feedEndpoint, postData, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log("Carousel post response:", post.data);
      return post.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message;
      const errorCode = error.response?.status || BAD_REQUEST;
      console.error("Facebook API Error (carousel):", error.response?.data || error);
      throw new ApiError(errorCode, `Failed to post carousel on Facebook: ${errorMessage}`);
    }
  }

  // 🧩 Case 2: Single image
  if (imagesUrl.length === 1) {
    const photoEndpoint = `https://graph.facebook.com/v23.0/${inputs.pageId}/photos`;
    const postData = {
      access_token: accessToken,
      url: imagesUrl[0],
      caption: message,
    };

    try {
      console.log("Posting single image to photo endpoint:", photoEndpoint);
      const post = await axios.post(photoEndpoint, postData, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log("Single image post response:", post.data);
      return post.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message;
      const errorCode = error.response?.status || BAD_REQUEST;
      console.error("Facebook API Error (single image):", error.response?.data || error);
      throw new ApiError(errorCode, `Failed to post image on Facebook: ${errorMessage}`);
    }
  }

  // 🧩 Case 3: Text-only post
  if (!message) {
    throw new ApiError(BAD_REQUEST, "Post content (title, description, or hashtags) is required");
  }

  const feedEndpoint = `https://graph.facebook.com/v23.0/${inputs.pageId}/feed`;
  const postData = {
    access_token: accessToken,
    message,
  };

  try {
    console.log("Posting text-only content to feed:", feedEndpoint);
    const post = await axios.post(feedEndpoint, postData, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log("Text post response:", post.data);
    return post.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error?.message || error.message;
    const errorCode = error.response?.status || BAD_REQUEST;
    console.error("Facebook API Error (text-only):", error.response?.data || error);
    throw new ApiError(errorCode, `Failed to post text on Facebook: ${errorMessage}`);
  }
};

const scheduledFacebookPosts = async (inputs, user) => {
  let postResult;

  if (inputs.scheduleTime && inputs.scheduleTime !== "") {
    const cronExpression = convertToCron(inputs.scheduleTime);
    console.log("Generated cron expression:", cronExpression);

    const scheduledDate = new Date(inputs.scheduleTime);
    const now = new Date();
    if (scheduledDate <= now) {
      throw new ApiError(BAD_REQUEST, i18n.__("INVALID_SCHEDULED_TIME"));
    }

    const taskId = uuidv4();

    const scheduledTask = new UserScheduledTask({
      userId: user._id,
      taskId,
      task: "Post to Facebook",
      platform: "facebook",
      imagesUrl: inputs.imagesUrl,
      title: inputs.title,
      description: inputs.description,
      scheduleTime: scheduledDate,
      cronExpression,
      status: "pending",
      postId: null,
    });

    await scheduledTask.save();

    // Schedule the task using node-cron
    const task = cron.schedule(
      cronExpression,
      async () => {
        try {
          postResult = await facebookPostOnPage(inputs);
          console.log(
            `Scheduled post executed successfully with post ID: ${postResult.id}`
          );

          // Update the scheduled task with the postId and status
          await UserScheduledTask.updateOne(
            { taskId },
            {
              $set: {
                status: "completed",
                postId: postResult.id,
              },
            }
          );
        } catch (error) {
          console.error("Scheduled Facebook post failed:", error.message);

          // Update the scheduled task status to 'failed'
          await UserScheduledTask.updateOne(
            { taskId },
            {
              $set: {
                status: "failed",
              },
            }
          );
        }
      },
      {
        scheduled: true,
        timezone: "Asia/Kolkata", // Use IST timezone as per the current date
      }
    );

    return {
      message: `Post scheduled successfully for ${scheduledDate.toLocaleString(
        "en-IN",
        { timeZone: "Asia/Kolkata" }
      )}`,
      taskId,
      postId: null,
    };
  } else {
    postResult = await facebookPostOnPage(inputs);
    console.log(`Post executed immediately with post ID: ${postResult}`);
    if (!postResult) throw new ApiError(BAD_REQUEST, i18n.__("POST_FAILED"));
    return {
      message: "Post published immediately",
      postId: postResult,
    };
  }
};


const instagramAuthentication = (user) => {
  const InstaAuthUrl = `https://www.instagram.com/oauth/authorize?` +
    querystring.stringify({
      response_type: "code",
      client_id: process.env.INSTAGRAM_APP_ID,
      redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
      scope: "instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments, instagram_business_content_publish",
      state: JSON.stringify({ platform: 'instagram', userId: user._id }),
    });

  console.log("Instagram url", InstaAuthUrl)

  return InstaAuthUrl;
};

const instagramCallback = async (query) => {
  if (query.error) {
    throw new ApiError(
      BAD_REQUEST,
      "LinkedIn authentication error: " + query.error_description
    );
  }

  if (!query.code) {
    throw new ApiError(BAD_REQUEST, "Authorization code is required");
  }

  const tokenResponse = await axios
    .get("https://api.instagram.com/oauth/access_token", {
      params: {
        client_id: process.env.INSTAGRAM_APP_ID,
        client_secret: process.env.INSTAGRAM_APP_SECRET,
        grant_type: "authorization_code",
        redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
        code: query.code,
      },
    })
    .catch((error) => {
      throw new ApiError(
        error.response?.status || BAD_REQUEST,
        `Failed to get access token from Instagarm: ${error.response?.data?.error_description || error.message
        }`
      );
    });

  console.log("Token Response", tokenResponse);

  const data = tokenResponse.data;

  const longLivedToken = await axios
    .get(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_APP_SECRET}&access_token=${data.access_token}`
    )
    .catch((error) => {
      throw new ApiError(
        error.response?.status || BAD_REQUEST,
        `Failed to long Lived Token from Instagarm: ${error.response?.data?.error_description || error.message
        }`
      );
    });

  console.log("Long Lived", longLivedToken);
};


const getIGAccount = async (inputs) => {
  console.log("Inputs: ----", inputs);
  if (!inputs.igBusinessId || !inputs.pageAccessToken) {
    throw new ApiError(BAD_REQUEST, "Instagram Business ID and access token are required");
  }

  const accessToken = decryptToken(inputs.pageAccessToken);
  let creationId;

  // Validate inputs
  if (!accessToken || !inputs.igBusinessId.match(/^\d+$/)) {
    throw new ApiError(BAD_REQUEST, "Invalid access token or Instagram Business ID");
  }

  // Determine if it's a carousel (multiple images) or single image
  const imagesUrl = Array.isArray(inputs.imagesUrl) ? inputs.imagesUrl : inputs.imageUrl ? [inputs.imageUrl] : [];
  const caption = `${inputs.title || ''}\n\n${inputs.description || ''}\n\n${inputs.hashTags || ''}`;
  if (caption.length > 2200) {
    throw new ApiError(BAD_REQUEST, "Caption exceeds 2,200 character limit");
  }

  // Utility function to check media status
  const checkMediaStatus = async (mediaId) => {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/v23.0/${mediaId}`,
        { params: { access_token: accessToken, fields: 'status_code,status' } }
      );
      const status = response.data.status || response.data.status_code || 'IN_PROGRESS';
      console.log(`Media ${mediaId} status: ${status}`);
      return status;
    } catch (error) {
      console.error(`Error checking status for ${mediaId}:`, error.response?.data?.error);
      throw new Error(`Status check failed: ${error.response?.data?.error?.message || error.message}`);
    }
  };

  // Utility function to delay
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  if (imagesUrl.length === 1) {
    // Single image post
    const postData = {
      image_url: imagesUrl[0],
      access_token: accessToken,
      caption: caption
    
    };
    const igResponse = await axios.post(
      `https://graph.facebook.com/v23.0/${inputs.igBusinessId}/media`,
      postData,
      {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
      }
    ).catch((error) => {
      console.error("Single media creation error response:", error.response?.data);
      throw new ApiError(
        error.response?.status || BAD_REQUEST,
        `Failed to create Instagram media: ${error.response?.data?.error_description || error.message}`
      );
    });
    creationId = igResponse.data.id;
    console.log("Single media created:", igResponse.data);
    
  } else if (imagesUrl.length > 1 && imagesUrl.length <= 10) {
    // Carousel post
    // Step 1: Create children (images)
    const childrenCreationIds = [];
    for (const imageUrl of imagesUrl) {
      const childData = {
        image_url: imageUrl,
      };
      const childResponse = await axios.post(
        `https://graph.facebook.com/v23.0/${inputs.igBusinessId}/media`,
        childData,
        {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        }
      ).catch((error) => {
        console.error("Child media creation error response:", error.response?.data);
        throw new ApiError(
          error.response?.status || BAD_REQUEST,
          `Failed to create child media for ${imageUrl}: ${error.response?.data?.error_description || error.message}`
        );
      });
      const childId = childResponse.data.id;
      console.log("Child id: ", childId)
      childrenCreationIds.push(childId);
      console.log(`Child media created for ${imageUrl}:`, childId);

      // Poll status for each child
    }
    
    console.log("Carousel ids", childrenCreationIds)
    // Step 2: Create carousel container
    const containerData = {
      access_token: accessToken,
      media_type: 'CAROUSEL',
      caption: caption,
      children: childrenCreationIds, // Array of child IDs
    };
    console.log("Container request data:", containerData);
    const containerResponse = await axios.post(
      `https://graph.facebook.com/v23.0/${inputs.igBusinessId}/media`,
      containerData,
      { headers: { 'Content-Type': 'application/json' } }
    ).catch((error) => {
      console.error("Carousel container creation error response:", error.response?.data);
      throw new ApiError(
        error.response?.status || BAD_REQUEST,
        `Failed to create Instagram carousel container: ${error.response?.data?.error_description || error.message}`
      );
    });
    creationId = containerResponse.data.id;
    console.log("Carousel container created:", containerResponse.data);
    
  } else if (imagesUrl.length === 0) {
    throw new ApiError(BAD_REQUEST, "At least one image URL is required for Instagram post");
  } else {
    throw new ApiError(BAD_REQUEST, "Maximum 10 images allowed for Instagram carousel");
  }

  // Step 3: Publish the media (carousel or single image)
  const publishData = {
    creation_id: creationId,
    access_token: accessToken,
  };
  const publishResponse = await axios.post(
    `https://graph.facebook.com/v23.0/${inputs.igBusinessId}/media_publish`,
    publishData,
    { headers: { 'Content-Type': 'application/json' } }
  ).catch((error) => {
    console.error("Publish error response:", error.response?.data);
    throw new ApiError(
      error.response?.status || BAD_REQUEST,
      `Failed to publish on Instagram account: ${error.response?.data?.error_description || error.message}`
    );
  });
  console.log("Instagram Post Published:", publishResponse.data);

  return publishResponse.data;
};
const scheduledInstagramPosts = async (inputs, user) => {
  let postResult;

  if (inputs.scheduleTime && inputs.scheduleTime !== "") {
    const cronExpression = convertToCron(inputs.scheduleTime);
    console.log("Generated cron expression:", cronExpression);

    const scheduledDate = new Date(inputs.scheduleTime);
    const now = new Date();
    if (scheduledDate <= now) {
      throw new ApiError(BAD_REQUEST, i18n.__("INVALID_SCHEDULED_TIME"));
    }

    const taskId = uuidv4();

    const scheduledTask = new UserScheduledTask({
      userId: user._id,
      taskId,
      task: "Post to Instagram",
      platform: "instagram",
      imagesUrl: inputs.imagesUrl,
      title: inputs.title,
      description: inputs.description,
      scheduleTime: scheduledDate,
      cronExpression,
      status: "pending",
      postId: null,
    });

    await scheduledTask.save();

    // Schedule the task using node-cron
    const task = cron.schedule(
      cronExpression,
      async () => {
        try {
          postResult = await getIGAccount(inputs);
          console.log(
            `Scheduled post executed successfully with post ID: ${postResult}`
          );

          // Update the scheduled task with the postId and status
          await UserScheduledTask.updateOne(
            { taskId },
            {
              $set: {
                status: "completed",
                postId: postResult.id,
              },
            }
          );
        } catch (error) {
          console.error("Scheduled Instagram post failed:", error.message);

          // Update the scheduled task status to 'failed'
          await UserScheduledTask.updateOne(
            { taskId },
            {
              $set: {
                status: "failed",
              },
            }
          );
        }
      },
      {
        scheduled: true,
        timezone: "Asia/Kolkata", // Use IST timezone as per the current date
      }
    );

    return {
      message: `Post scheduled successfully for ${scheduledDate.toLocaleString(
        "en-IN",
        { timeZone: "Asia/Kolkata" }
      )}`,
      taskId,
      postId: null,
    };
  } else {
    postResult = await getIGAccount(inputs);
    console.log(`Post executed immediately with post ID: ${postResult}`);
    if (!postResult) throw new ApiError(BAD_REQUEST, i18n.__("POST_FAILED"));
    return {
      message: "Post published immediately",
      postId: postResult,
    };
  }
};


const instagramCreateMedia = async (inputs) => {
  const mediaRes = await axios.post(
    `https://graph.facebook.com/v19.0/${inputs.instagramAccountId}/media`,
    null,
    {
      params: {
        image_url: inputs.imageUrl,
        caption: inputs.caption || "",
        access_token: inputs.pageAccessToken,
      },
    }
  );

  return mediaRes.data;
};

const instagramPublishMedia = async (inputs) => {
  // Step 2: Publish the container
  const publishResponse = await axios.post(
    `https://graph.facebook.com/v19.0/${inputs.instagramAccountId}/media_publish`,
    null,
    {
      params: {
        creation_id: inputs.containerId,
        access_token: inputs.pageAccessToken,
      },
    }
  );
  return publishResponse.data;
};

const SocialServices = {
  linkedInAuthentication,
  linkedInCallback,
  linkedInPost,
  scheduledLinkedPosts,
  facebookAuthentication,
  facebookCallback,
  facebookPostOnPage,
  instagramAuthentication,
  instagramCallback,
  getIGAccount,
  instagramCreateMedia,
  instagramPublishMedia,
  getSocialAuthDetail,
  scheduledFacebookPosts,
  scheduledInstagramPosts
};

export default SocialServices;
