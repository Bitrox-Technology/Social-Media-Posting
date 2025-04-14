import axios from 'axios';
import { ApiError } from '../utils/apiError.js';

async function postBlog(postData) {
    const wpUrl = process.env.WORDPRESS_URL; // Replace with your domain

    // Authentication (use Application Password for security)
    const username = process.env.WORDPRESS_USERNAME;
    const password = process.env.WORDPRESS_PASSWORD;
    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    console.log("Sending to WordPress with Auth:", `Basic ${auth}`);

   try {
     const wpResponse = await axios.post(wpUrl, postData, {
         headers: {
           "Authorization": `Basic ${auth}`,
           "Content-Type": "application/json"
         }
       });
   
       console.log("WordPress Post Created:", wpResponse.data);
 
     return wpResponse.data;
   } catch (error) {
    throw new ApiError(500, `Error posting to WordPress: ${error.message}`);
   }
}

export { postBlog }