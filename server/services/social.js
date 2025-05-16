import axios from "axios";
import { ApiError } from "../utils/ApiError.js";
import { BAD_REQUEST } from "../utils/apiResponseCode.js";
import querystring from "querystring";
import { downloadImage } from "../utils/postUtils.js";
import { createReadStream } from "fs";
import { promises as fs } from 'fs';
import cron from "node-cron"
import { convertToCron } from "../utils/utilities.js";

const linkedInAuthentication = () => {
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
        querystring.stringify({
            response_type: 'code',
            client_id: process.env.LINKEDIN_CLIENT_ID,
            redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
            scope: 'openid profile email w_member_social',
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

    console.log("query", query.code)

    const tokenResponse = await axios.post(
        'https://www.linkedin.com/oauth/v2/accessToken',
        querystring.stringify({
            grant_type: 'authorization_code',
            code: query.code,
            redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
            client_id: process.env.LINKEDIN_CLIENT_ID,
            client_secret: process.env.LINKEDIN_CLIENT_SECRET,
            display: 'popup',
        }),
        {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
    ).catch(error => {
        throw new ApiError(
            error.response?.status || BAD_REQUEST,
            `Failed to get access token from LinkedIn: ${error.response?.data?.error_description || error.message}`
        );
    });
    if (tokenResponse.status !== 200) {
        throw new ApiError(BAD_REQUEST, "Failed to get access token from LinkedIn");
    }

    const accessToken = tokenResponse.data.access_token;

    console.log("Access Token:", accessToken, tokenResponse.data);

    const profileRes = await axios.get('https://api.linkedin.com/v2/userinfo', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    }).catch(error => {
        throw new ApiError(
            error.response?.status || BAD_REQUEST,
            `Failed to get LinkedIn profile: ${error.response?.data?.error_description || error.message}`
        );
    });



    const profileData = profileRes.data

    return { profileData, accessToken };
}



const linkedInPost = async (inputs) => {
    let post;

    let PERSON_URN = 'urn:li:person:5mrk23kx86'
    let ACCESS_TOKEN = 'AQVxEM_roHvTrj66D6lsIrX-lHePZ5NMF6pge5fVp1hzLbE_B4PlhsGaFRpySurTONIS4Dxcc-BChSt5CZLG46Yp1hc91qGro6DddZimFppgSw4fwp44JMnsXAaTv7cF7UMNsNglOaYml0FiMocoSd8NFlhtqR9d3Pu89IFdPVQ6MFNKvOOJEZ2fE5ADq89YJSywpt2Fm2373WvoEbaxOFq-2KtpdMh6rbUGQTsEXwyZsQHNuaJn0We2Mv2M-UHwg7BjaM0RtgAd4PkiFpg5FfVyGgT9Qmp-LcIDowhx1CmX91pZqsFtfkkuqOhPTkhg_VPp7gAdy7wAdVvZxFrpAV1X0L4vyg'


    const TEMP_IMAGE_PATH = `./uploads/temp_image_${Date.now()}.png`;
    await downloadImage(inputs.imageUrl, TEMP_IMAGE_PATH);

    const registerPayload = {
        registerUploadRequest: {
            recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
            owner: PERSON_URN,
            serviceRelationships: [
                { relationshipType: 'OWNER', identifier: 'urn:li:userGeneratedContent' },
            ],
        },
    }

    let response;

    try {
        response = await axios.post(
            'https://api.linkedin.com/v2/assets?action=registerUpload',
            registerPayload,
            {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    'X-Restli-Protocol-Version': '2.0.0',
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error) {

    }


    let uploadUrl = response.data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
    let asset = response.data.value.asset;


    try {
        const fileStream = createReadStream(TEMP_IMAGE_PATH);

        // Send PUT request with binary data
        await axios.put(uploadUrl, fileStream, {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'image/png', // Adjust based on file type (e.g., image/jpeg, video/mp4)
            },
        });
        console.log('Image uploaded successfully');
    } catch (error) {
        throw new ApiError(
            error.response?.status || BAD_REQUEST,
            `Failed to upload image: ${error.response?.data?.message || error.message}`
        );
    }


    const sharePayload = {
        "author": PERSON_URN,
        "lifecycleState": 'PUBLISHED',
        "specificContent": {
            'com.linkedin.ugc.ShareContent': {
                "shareCommentary": { "text": inputs.title + "\n" + inputs.description },
                "shareMediaCategory": 'IMAGE',
                "media": [
                    {
                        "status": 'READY',
                        "description": {
                            "text": inputs.description,
                        },
                        "media": asset,
                        'title': {
                            "text": inputs.title
                        },
                    },
                ],
            },
        },
        "visibility": {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
    };

    try {
        response = await axios.post('https://api.linkedin.com/v2/ugcPosts', sharePayload, {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                'X-Restli-Protocol-Version': '2.0.0',
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        throw new ApiError(
            error.response?.status || BAD_REQUEST,
            `Failed to create share: ${error.response?.data?.message || error.message}`
        );
    }
    post = response.headers['x-restli-id'];

    await fs.unlink(TEMP_IMAGE_PATH).catch(() => { });

    return post

}

const scheduledLinkedPosts = async (inputs) => {
    let cronExpression;

   if (scheduleTime && scheduleTime !== ''){
        cronExpression = convertToCron(inputs.scheduleTime);

        console.log('Generated cron expression:', cronExpression);

        const scheduledDate = new Date(inputs.scheduleTime);
        const now = new Date();
        if (scheduledDate <= now) {
            throw new ApiError(BAD_REQUEST, 'Scheduled time must be in the future');
        }

        let task = cron.schedule(
            cronExpression,
            async () => {
                try {

                    const postResult = await linkedInPost(inputs);
                    console.log(`Scheduled post executed successfully with post ID: ${postResult}`);

                    
                } catch (error) {
                    console.error('Scheduled LinkedIn post failed:', error.message);
                }
            },
            {
                scheduled: true,
                timezone: 'Asia/Kolkata',
            }
        );

        
    }





}


const facebookAuthentication = () => {
    const fbAuthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.FB_APP_ID}&redirect_uri=${process.env.FB_REDIRECT_URI}&scope=email`;
    return fbAuthUrl;
}

const facebookCallback = async (query) => {
    if (query.error) {
        throw new ApiError(BAD_REQUEST, "LinkedIn authentication error: " + query.error_description);
    }

    if (!query.code) {
        throw new ApiError(BAD_REQUEST, "Authorization code is required");
    }


    const tokenResponse = await axios.get('https://graph.facebook.com/v19.0/oauth/access_token', {
        params: {
            client_id: process.env.FB_APP_ID,
            client_secret: process.env.FB_APP_SECRET,
            redirect_uri: process.env.FB_REDIRECT_URI,
            code: query.code
        }
    }).catch(error => {
        throw new ApiError(
            error.response?.status || BAD_REQUEST,
            `Failed to get access token from facebook: ${error.response?.data?.error_description || error.message}`
        );
    });;

    const data = tokenResponse.data;
    const pagesResponse = await axios.get('https://graph.facebook.com/v19.0/me/accounts', {
        params: {
            access_token: data.access_token
        }
    }).catch(error => {
        throw new ApiError(
            error.response?.status || BAD_REQUEST,
            `Failed to get pages from facebook: ${error.response?.data?.error_description || error.message}`
        );
    });

    const pages = pagesResponse.data.data;
    return pages
}

const facebookPost = async (inputs) => {
    let post;

    post = await axios.post(`https://graph.facebook.com/${inputs.pageId}/feed`, {
        message: inputs.message,
        access_token: inputs.pageAccessToken,
    }).catch(error => {
        throw new ApiError(
            error.response?.status || BAD_REQUEST,
            `Failed to get Post on facebook: ${error.response?.data?.error_description || error.message}`
        );
    });

    return post.data;
}

const instagramAuthentication = () => {
    const InstaAuthUrl = `https://www.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_APP_ID}&redirect_uri=${process.env.INSTAGRAM_REDIRECT_URI}&response_type=code&scope=instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish`;
    return InstaAuthUrl;
}

const instagramCallback = async (query) => {
    if (query.error) {
        throw new ApiError(BAD_REQUEST, "LinkedIn authentication error: " + query.error_description);
    }

    if (!query.code) {
        throw new ApiError(BAD_REQUEST, "Authorization code is required");
    }


    const tokenResponse = await axios.get('https://api.instagram.com/oauth/access_token', {
        params: {
            client_id: process.env.INSTAGRAM_APP_ID,
            client_secret: process.env.INSTAGRAM_APP_SECRET,
            grant_type: 'authorization_code',
            redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
            code: query.code
        }
    }).catch(error => {
        throw new ApiError(
            error.response?.status || BAD_REQUEST,
            `Failed to get access token from Instagarm: ${error.response?.data?.error_description || error.message}`
        );
    });;

    console.log("Token Response", tokenResponse)

    const data = tokenResponse.data;

    const longLivedToken = await axios.get(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_APP_SECRET}&access_token=${data.access_token}`)
        .catch(error => {
            throw new ApiError(
                error.response?.status || BAD_REQUEST,
                `Failed to long Lived Token from Instagarm: ${error.response?.data?.error_description || error.message}`
            );
        });;

    console.log("Long Lived", longLivedToken)
}
const getIGAccount = async (pageId, pageAccessToken) => {

    const igResponse = await axios.get(`https://graph.facebook.com/v19.0/${pageId}`, {
        params: {
            fields: 'instagram_business_account',
            access_token: pageAccessToken
        }
    }).catch(error => {
        throw new ApiError(
            error.response?.status || BAD_REQUEST,
            `Failed to get Instagram account: ${error.response?.data?.error_description || error.message}`
        );
    });

    if (igResponse.status !== 200) {
        throw new ApiError(BAD_REQUEST, "Failed to get Instagram account from Facebook");
    }

    return igResponse.data.instagram_business_account.id;
}

const instagramCreateMedia = async (inputs) => {
    const mediaRes = await axios.post(
        `https://graph.facebook.com/v19.0/${inputs.instagramAccountId}/media`,
        null,
        {
            params: {
                image_url: inputs.imageUrl,
                caption: inputs.caption || '',
                access_token: inputs.pageAccessToken
            }
        }
    );

    return mediaRes.data;
}

const instagramPublishMedia = async (inputs) => {

    // Step 2: Publish the container
    const publishResponse = await axios.post(
        `https://graph.facebook.com/v19.0/${inputs.instagramAccountId}/media_publish`,
        null,
        {
            params: {
                creation_id: inputs.containerId,
                access_token: inputs.pageAccessToken
            }
        }
    );
    return publishResponse.data;
}

const SocialServices = {
    linkedInAuthentication,
    linkedInCallback,
    linkedInPost,
    facebookAuthentication,
    facebookCallback,
    facebookPost,
    instagramAuthentication,
    instagramCallback,
    getIGAccount,
    instagramCreateMedia,
    instagramPublishMedia,
}

export default SocialServices;