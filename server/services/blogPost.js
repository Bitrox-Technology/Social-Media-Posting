import axios from 'axios';
import { ApiError } from '../utils/apiError.js';
import { BAD_REQUEST } from '../utils/apiResponseCode.js';
import { convertToCron } from '../utils/utilities.js';
import { v4 as uuidv4 } from "uuid";
import cron from 'node-cron';
import i18n from 'i18n';
import UserScheduledTask from '../models/userSchesuledTask.js';
import fetch from 'node-fetch'; // Ensure you have node-fetch installed
import { Buffer } from 'buffer'; // For Node.js environments, use Buffer for Base64 encoding
import sharp from 'sharp'; // Ensure you have sharp installed
import slugify from 'slugify'


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


const uploadImage = async (imageUrl, altText, title, description) => {
  try {
    const imageResponse = await fetch(imageUrl);


    if (imageResponse.status !== 200) {
      throw new ApiError(400, `Failed to fetch image: ${imageResponse.status}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const optimizedImage = await sharp(Buffer.from(imageBuffer))
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Step 4: Create a File object from the blob
    const filename = imageUrl.split('/').pop() || 'featured-image.jpg';
    const imageFile = new File([optimizedImage], filename, { type: 'image/jpeg' });

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('title', title);
    formData.append('alt_text', altText);
    formData.append('caption', `Featured image for ${title}`);
    formData.append('description', description);

    const response = await axios.post('https://bitrox.tech/wp-json/wp/v2/media', formData, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.WORDPRESS_USERNAME}:${process.env.WORDPRESS_PASSWORD}`).toString('base64')}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error.message || error);
    throw new ApiError(400, error.message || 'Failed to upload image to WordPress');
  }
}


const publishBlogPost = async (inputs) => {
  const categories = await Promise.all(
    inputs.categories.map(async (categoryName) => {
      const response = await axios.get(`https://bitrox.tech/wp-json/wp/v2/categories?search=${encodeURIComponent(categoryName)}`, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${process.env.WORDPRESS_USERNAME}:${process.env.WORDPRESS_PASSWORD}`).toString('base64')}`,
        },
      });
      if (response.data.length > 0) {
        return response.data[0].id;
      }
      const newCategory = await axios.post(
        'https://bitrox.tech/wp-json/wp/v2/categories',
        { name: categoryName },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${process.env.WORDPRESS_USERNAME}:${process.env.WORDPRESS_PASSWORD}`).toString('base64')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return newCategory.data.id;
    })
  );

  // Create or fetch tags
  const tags = await Promise.all(
    inputs.tags.map(async (tagName) => {
      const response = await axios.get(`https://bitrox.tech/wp-json/wp/v2/tags?search=${encodeURIComponent(tagName)}`, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${process.env.WORDPRESS_USERNAME}:${process.env.WORDPRESS_PASSWORD}`).toString('base64')}`,
        },
      });
      if (response.data.length > 0) {
        return response.data[0].id;
      }
      const newTag = await axios.post(
        'https://bitrox.tech/wp-json/wp/v2/tags',
        { name: tagName },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${process.env.WORDPRESS_USERNAME}:${process.env.WORDPRESS_PASSWORD}`).toString('base64')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return newTag.data.id;
    })
  );
  let featuredImageId = null;
  if (inputs.imageUrl) {
    const featuredImage = await uploadImage(inputs.imageUrl, inputs.imageAltText, inputs.title, inputs.imageDescription);
    featuredImageId = featuredImage.id;
  }

  const postData = await createPost(
    inputs.title,
    inputs.content,
    categories,
    tags,
    featuredImageId,
    inputs.excerpt,
    inputs.metaDescription,
    inputs.slug,
    inputs.focusKeyword,
    inputs.scheduleTime,
  );
  await triggerSitemapUpdate();
  return postData.id;
}

const triggerSitemapUpdate = async () => {
  try {
    // Check if sitemap exists
    const sitemapResponse = await axios.get('https://bitrox.tech/sitemap.xml', {
      timeout: 5000,
    });
    if (sitemapResponse.status !== 200) {
      throw new ApiError(500, 'Sitemap not found at https://bitrox.tech/sitemap.xml');
    }

    // Trigger Yoast SEO sitemap cache clear (requires Yoast SEO REST API or admin action)
    // Note: Yoast Free doesn’t expose a direct API for this, so we rely on WordPress behavior
    // If using a custom sitemap plugin, replace with its API endpoint
    await axios.get('https://bitrox.tech/wp-json/yoast/v1/settings/reset_cache', {
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.WORDPRESS_USERNAME}:${process.env.WORDPRESS_PASSWORD}`).toString('base64')}`,
      },
      timeout: 5000,
    });
  } catch (error) {
    console.warn('Sitemap update warning:', error.message);
    // Non-critical error; log but don’t throw
  }
};

const createPost = async (title, content, categories, tags, featuredImageId, excerpt, metaDescription, slug, focusKeyword, scheduleTime) => {
  try {
    const postData = {
      title,
      content,
      status: scheduleTime ? 'future' : 'publish',
      date: scheduleTime || undefined,
      categories,
      tags,
      featured_media: featuredImageId,
      excerpt: excerpt || metaDescription?.slice(0, 160),
      slug: slug || slugify(title, { lower: true }),
      meta: {
        _yoast_wpseo_metadesc: metaDescription,
        _yoast_wpseo_focuskw: focusKeyword || '',
        _yoast_wpseo_title: `${title} | Bitrox Tech`,
        _yoast_wpseo_opengraph_title: `${title} - Share on Bitrox Tech`,
        _yoast_wpseo_opengraph_description: metaDescription,
        _yoast_wpseo_twitter_title: `${title} - Tweet`,
        _yoast_wpseo_twitter_description: metaDescription,

        schema: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description: metaDescription,
          image: featuredImageId ? `image_url_here_or_fetch_later` : undefined,
          author: { '@type': 'Person', name: 'Bitrox Tech Team' },
          publisher: { '@type': 'Organization', name: 'Bitrox Tech' },
          datePublished: scheduleTime || new Date().toISOString(),
        }),
      },
    };

    const blog = await axios.post('https://bitrox.tech/wp-json/wp/v2/posts', postData, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.WORDPRESS_USERNAME}:${process.env.WORDPRESS_PASSWORD}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });

    // const schema = {
    //   '@context': 'https://schema.org',
    //   '@type': 'Article',
    //   headline: title,
    //   description: metaDescription,
    //   image: featuredImageId ? blog.data.featured_image_src : undefined,
    //   author: { '@type': 'Person', name: 'Bitrox Tech Team' },
    //   publisher: { '@type': 'Organization', name: 'Bitrox Tech' },
    //   datePublished: scheduleTime || new Date().toISOString(),
    // };
    // const data = await axios.post(
    //   `https://bitrox.tech/wp-json/wp/v2/posts/${blog.data.id}`,
    //   { meta: { schema: JSON.stringify(schema) } },
    //   {
    //     headers: {
    //       Authorization: `Basic ${Buffer.from(`${process.env.WORDPRESS_USERNAME}:${process.env.WORDPRESS_PASSWORD}`).toString('base64')}`,
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // );

    return blog.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new ApiError(500, `Error creating post: ${error.message}`);

  }
}


const scheduledBlogPosts = async (inputs, user) => {
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
      task: "Post to Blog",
      platform: "wordpress",
      imageUrl: inputs.imageUrl,
      title: inputs.title,
      description: inputs.content,
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
          postResult = await publishBlogPost(inputs);
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
    postResult = await publishBlogPost(inputs);
    console.log(`Post executed immediately with post ID: ${postResult}`);
    if (!postResult) throw new ApiError(BAD_REQUEST, i18n.__("POST_FAILED"));
    return {
      message: "Post published immediately",
      postId: postResult,
    };
  }
};


const uploadImage1 = async (imageUrl, altText, title, description, wordpress_username, wordpress_password) => {
  try {
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 10000 });
    if (imageResponse.status !== 200) {
      throw new ApiError(400, `Failed to fetch image: ${imageResponse.status}`);
    }

    const imageBuffer = Buffer.from(imageResponse.data);
    const optimizedImage = await sharp(imageBuffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    const filename = `${uuidv4()}-${imageUrl.split('/').pop()?.replace(/[^a-z0-9.]/gi, '-') || 'featured-image.jpg'}`;
    const formData = new FormData();
    formData.append('file', new Blob([optimizedImage], { type: 'image/jpeg' }), filename);
    formData.append('title', title);
    formData.append('alt_text', altText);
    formData.append('caption', `Featured image for ${title}`);
    formData.append('description', description);

    const response = await axios.post('https://bitrox.tech/wp-json/wp/v2/media', formData, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${wordpress_username}:${wordpress_password}`).toString('base64')}`,
      },
      timeout: 10000,
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error.message || error);
    throw new ApiError(500, error.message || 'Failed to upload image to WordPress');
  }
};

const createPost1 = async (
  title,
  content,
  categories = [],
  tags = [],
  featuredImageId,
  excerpt,
  metaDescription,
  slug,
  focusKeyword,
  scheduleTime,
  section,
  wordpress_username, 
  wordpress_password
) => {
  try {
    if (!title || !content || !excerpt || !metaDescription || !section) {
      throw new ApiError(400, 'Required fields missing');
    }

    const getCategoryIds = async (categoryNames) => {
      const responses = await Promise.all(
        categoryNames.map(name =>
          axios.get('https://bitrox.tech/wp-json/wp/v2/categories', {
            params: { search: name },
            headers: {
              Authorization: `Basic ${Buffer.from(`${wordpress_username}:${wordpress_password}`).toString('base64')}`,
            },
            timeout: 5000,
          })
        )
      );
      const ids = responses.flatMap(res => res.data.map((cat) => cat.id)).filter(id => id !== 1); // Exclude Uncategorized
      const sectionCategory = await axios.get('https://bitrox.tech/wp-json/wp/v2/categories', {
        params: { slug: section },
        headers: { Authorization: `Basic ${Buffer.from(`${wordpress_username}:${wordpress_password}`).toString('base64')}` },
        timeout: 5000,
      });
      if (sectionCategory.data.length) {
        ids.push(sectionCategory.data[0].id);
      } else {
        const newCategory = await axios.post(
          'https://bitrox.tech/wp-json/wp/v2/categories',
          { name: section.charAt(0).toUpperCase() + section.slice(1), slug: section },
          {
            headers: {
              Authorization: `Basic ${Buffer.from(`${wordpress_username}:${wordpress_password}`).toString('base64')}`,
              'Content-Type': 'application/json',
            },
          }
        );
        ids.push(newCategory.data.id);
      }
      return [...new Set(ids)];
    };

    const generateUniqueSlug = async (baseSlug) => {
      let slug = baseSlug;
      let counter = 1;
      while (true) {
        const response = await axios.get('https://bitrox.tech/wp-json/wp/v2/posts', {
          params: { slug },
          headers: { Authorization: `Basic ${Buffer.from(`${wordpress_username}:${wordpress_password}`).toString('base64')}` },
          timeout: 5000,
        });
        if (!response.data.length) return slug;
        slug = `${baseSlug}-${++counter}`;
      }
    };

    const postData = {
      title,
      content,
      status: scheduleTime ? 'future' : 'publish',
      date: scheduleTime ? new Date(scheduleTime).toISOString() : undefined,
      categories: await getCategoryIds([...categories, section.charAt(0).toUpperCase() + section.slice(1)]),
      tags,
      featured_media: featuredImageId || 0,
      excerpt,
      slug: await generateUniqueSlug(slug || slugify(title, { lower: true })),
      meta: {
        _bitrox_seo_meta_description: metaDescription,
        _bitrox_seo_focus_keyword: focusKeyword || '',
        _bitrox_seo_title: `${title} | Bitrox Tech`,
        _bitrox_seo_opengraph_title: `${title} - Share on Bitrox Tech`,
        _bitrox_seo_opengraph_description: metaDescription,
        _bitrox_seo_twitter_title: `${title} - Tweet`,
        _bitrox_seo_twitter_description: metaDescription,
        _bitrox_seo_schema: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description: metaDescription,
          image: featuredImageId ? undefined : undefined, // Fetch later if needed
          author: { '@type': 'Person', name: 'Bitrox Tech Team' },
          publisher: { '@type': 'Organization', name: 'Bitrox Tech' },
          datePublished: scheduleTime || new Date().toISOString(),
        }),
      },
    };

    const blog = await axios.post('https://bitrox.tech/wp-json/wp/v2/posts', postData, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${wordpress_username}:${wordpress_password}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    return blog.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new ApiError(500, `Error creating post: ${error.message || 'Unknown error'}`);
  }
};

const publishContent1 = async (inputs) => {
  try {
    if (!inputs.title || !inputs.content || !inputs.excerpt || !inputs.metaDescription) {
      throw new ApiError(400, 'Required fields missing');
    }

    const categories = await Promise.all(
      inputs.categories.map(async (categoryName) => {
        const response = await axios.get(`https://bitrox.tech/wp-json/wp/v2/categories?search=${encodeURIComponent(categoryName)}`, {
          headers: {
            Authorization: `Basic ${Buffer.from(`${inputs.wordpress_username}:${inputs.wordpress_password}`).toString('base64')}`,
          },
          timeout: 5000,
        });
        if (response.data?.length > 0) {
          return response.data[0].id;
        }
        const newCategory = await axios.post(
          'https://bitrox.tech/wp-json/wp/v2/categories',
          { name: categoryName, slug: categoryName.toLowerCase().replace(/\s+/g, '-') },
          {
            headers: {
              Authorization: `Basic ${Buffer.from(`${inputs.wordpress_username}:${inputs.wordpress_password}`).toString('base64')}`,
              'Content-Type': 'application/json',
            },
          }
        );
        return newCategory.data.id;
      })
    );

    const tags = await Promise.all(
      inputs.tags.map(async (tagName) => {
        const response = await axios.get(`https://bitrox.tech/wp-json/wp/v2/tags?search=${encodeURIComponent(tagName)}`, {
          headers: {
            Authorization: `Basic ${Buffer.from(`${inputs.wordpress_username}:${inputs.wordpress_password}`).toString('base64')}`,
          },
          timeout: 5000,
        });
        if (response.data?.length > 0) {
          return response.data[0].id;
        }
        const newTag = await axios.post(
          'https://bitrox.tech/wp-json/wp/v2/tags',
          { name: tagName, slug: tagName.toLowerCase().replace(/\s+/g, '-') },
          {
            headers: {
              Authorization: `Basic ${Buffer.from(`${inputs.wordpress_username}:${inputs.wordpress_password}`).toString('base64')}`,
              'Content-Type': 'application/json',
            },
          }
        );
        return newTag.data.id;
      })
    );

    let featuredImageId = null;
    if (inputs.imageUrl && inputs.imageAltText && inputs.imageDescription) {
      const featuredImage = await uploadImage1(inputs.imageUrl, inputs.imageAltText, inputs.title, inputs.imageDescription, inputs.wordpress_username, inputs.wordpress_password);
      featuredImageId = featuredImage.id;
    }

    const postData = await createPost1(
      inputs.title,
      inputs.content,
      categories,
      tags,
      featuredImageId,
      inputs.excerpt,
      inputs.metaDescription,
      inputs.slug,
      inputs.focusKeyword,
      inputs.scheduleTime,
      inputs.section,
      inputs.wordpress_username,
      inputs.wordpress_password
    );

    await triggerSitemapUpdate();
    return postData.id;
  } catch (error) {
    console.error('Error publishing content:', error);
    throw new ApiError(500, `Error publishing content: ${error.message || 'Unknown error'}`);
  }
};


export { postBlog, scheduledBlogPosts, uploadImage, publishBlogPost, createPost, publishContent1 };