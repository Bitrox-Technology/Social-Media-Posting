import axios from "axios";
import { ApiError } from "../utils/ApiError.js";
import { BAD_REQUEST } from "../utils/apiResponseCode.js";
import querystring from "querystring";

const linkedInAuthentication = () => {
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.LINKEDIN_CLIENT_ID,
      redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
      scope: 'r_liteprofile w_member_social',
    });
    return authUrl; 
}

const linkedInCallback = async (code) => {
    if (!code) {
        throw new ApiError(BAD_REQUEST, "Authorization code is required");
    }
    console.log("LinkedIn Callback Code:", code);
    const tokenResponse = await axios.post(
        'https://www.linkedin.com/oauth/v2/accessToken',
        querystring.stringify({
          grant_type: 'authorization_code',
          code,
          redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
          client_id: process.env.LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );
    if (tokenResponse.status !== 200) {
        throw new ApiError(BAD_REQUEST, "Failed to get access token from LinkedIn");
    }

    const accessToken = tokenResponse.data.access_token;

    console.log("Access Token:", accessToken);

    const profileRes = await axios.get(`https://api.linkedin.com/v2/me`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    
    if (profileRes.status !== 200) {
        throw new ApiError(BAD_REQUEST, "Failed to get user profile from LinkedIn");
    }

    return profileRes.data;
}

const linkedInPost = async (inputs) => {
    let post;

    post = await axios.post(
        "https://api.linkedin.com/v2/ugcPosts",
        {
            author: inputs.authorUrn,
            lifecycleState: "PUBLISHED",
            specificContent: {
                "com.linkedin.ugc.ShareContent": {
                    shareCommentary: {
                        text: inputs.message,
                    },
                    shareMediaCategory: "NONE",
                },
            },
            visibility: {
                "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
            },
        },
        {
            headers: {
                Authorization: `Bearer ${inputs.accessToken}`,
                "X-Restli-Protocol-Version": "2.0.0",
                "Content-Type": "application/json",
            },
        }
    );

    return post.data;
}

const SocialServices = {
    linkedInAuthentication,
    linkedInCallback,
    linkedInPost
}

export default SocialServices;