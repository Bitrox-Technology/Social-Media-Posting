import { IgApiClient } from 'instagram-private-api';
import fs from 'fs-extra';
import {ApiError} from '../utils/ApiError.js'

const postToInsta = async (filePath, caption, mediaType) => {
    try {
        const ig = new IgApiClient();
        ig.state.generateDevice(process.env.IG_USERNAME);

        console.log('Logging in to Instagram...');

        const loggedInUser = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
        if (!loggedInUser) throw new ApiError(400, "Failed to login to Instagram")   

        console.log('Successfully logged in!');
        console.log('Posting to Instagram...');

        if (mediaType === 'photo') {
            // Post photo (JPEG required)
            const photoBuffer = fs.readFileSync(filePath);
            console.log("photoBuffer", photoBuffer)
            const post = await ig.publish.photo({
                file: photoBuffer,
                caption: caption || 'New photo',
            });
            if (!post) throw new ApiError(400, "Failed to post to Instagram");

            console.log('Photo posted successfully!', post);
            return post.media.id;
        } else if (mediaType === 'video') {
            // Post video (MP4, under 60 seconds, max 15MB)
            const videoBuffer = fs.readFileSync(filePath);
            const coverBuffer = fs.readFileSync("./coverImage.png");
            console.log("videoBuffer", videoBuffer)
            console.log('Video buffer length:', videoBuffer.length);
            const post = await ig.publish.video({
                video: videoBuffer,
                coverImage: coverBuffer,
                caption: caption || 'New video',
            });

            if (!post) throw new ApiError(400, "Failed to post to Instagram");
            console.log('Video posted successfully!', post);
            return post.media.id;
        }
        return null;
    } catch (error) {
        throw new ApiError(400, error.message)
    }
};

export {
    postToInsta
}