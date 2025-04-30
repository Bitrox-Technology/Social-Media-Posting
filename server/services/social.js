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
            scope: 'openid profile email',
        });
    return authUrl;
}

const linkedInCallback = async (query) => {
    if (query.error) {
        throw new ApiError(BAD_REQUEST, "LinkedIn authentication error: " + query.error_description);
    }

    if (!query.code) {
        throw new ApiError(BAD_REQUEST, "Authorization code is required");
    }

    const tokenResponse = await axios.post(
        'https://www.linkedin.com/oauth/v2/accessToken',
        querystring.stringify({
            grant_type: 'authorization_code',
            code: query.code,
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

const facebookAuthentication = () => {
    const fbAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.FB_APP_ID}&redirect_uri=${process.env.FB_REDIRECT_URI}&scope=pages_show_list,pages_manage_posts,publish_to_groups,pages_read_engagement,instagram_basic,instagram_content_publish`;
    return fbAuthUrl;
}

const facebookCallback = async (query) => {
    if (query.error) {
        throw new ApiError(BAD_REQUEST, "LinkedIn authentication error: " + query.error_description);
    }

    if (!query.code) {
        throw new ApiError(BAD_REQUEST, "Authorization code is required");
    }

    const tokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${process.env.FB_APP_ID}&redirect_uri=${process.env.FB_REDIRECT_URI}&client_secret=${process.env.FB_APP_SECRET}&code=${query.code}`;

    const tokenRes = await axios.get(tokenUrl);
    const accessToken = tokenRes.data.access_token;

    // Fetch user pages (FB & Instagram business accounts)
    const pages = await axios.get(`https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`);

    if (pages.status !== 200) {
        throw new ApiError(BAD_REQUEST, "Failed to get user pages from Facebook");
    }
    return pages.data
}

const facebookPost = async (inputs) => {
    let post;

    post = await axios.post(`https://graph.facebook.com/${inputs.pageId}/feed`, {
        message: inputs.message,
        access_token: inputs.pageAccessToken,
    });

    return post.data;
}

const getIGAccount = async (pageId, pageAccessToken) => {
    const igAccountRes = await axios.get(`https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`);

    if (igAccountRes.status !== 200) {
        throw new ApiError(BAD_REQUEST, "Failed to get Instagram account from Facebook");
    }

    return igAccountRes.data.instagram_business_account.id;
}

const instagramCreateMedia = async (inputs) => {
    const mediaRes = await axios.post(
        `https://graph.facebook.com/v18.0/${inputs.igUserId}/media`,
        {
            image_url: inputs.imageUrl,
            caption: inputs.caption,
            access_token: inputs.accessToken,
        }
    );

    return mediaRes.data;
}

const instagramPublishMedia = async (inputs) => {
    const publishRes = await axios.post(
        `https://graph.facebook.com/v18.0/${inputs.igUserId}/media_publish`,
        {
            creation_id: inputs.creation_id,
            access_token: inputs.accessToken,
        }
    );
    return publishRes.data;
}

const SocialServices = {
    linkedInAuthentication,
    linkedInCallback,
    linkedInPost,
    facebookAuthentication,
    facebookCallback,
    facebookPost,
    getIGAccount,
    instagramCreateMedia,
    instagramPublishMedia,
}

export default SocialServices;