import axios from 'axios';

async function postBlog(postData) {
    const wpUrl = process.env.WORDPRESS_URL; // Replace with your domain

    // Authentication (use Application Password for security)
    const username = process.env.WORDPRESS_USERNAME;
    const password = process.env.WORDPRESS_PASSWORD;
    const auth = Buffer.from(`${username}:${password}`).toString('base64');

    const wpResponse = await axios.post(wpUrl, postData, {
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/json"
        }
      });
  
      console.log("WordPress Post Created:", wpResponse.data);

    return wpResponse.data;
}

export { postBlog }