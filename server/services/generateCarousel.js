import { Ollama } from "ollama";
import { ApiError } from "../utils/ApiError.js";
import fs from "fs";

const ollama = new Ollama({ host: process.env.OLLAMA_API_URL });

const generateCarouselContent = async (topic) => {
  try {
    // Craft a single prompt for all five slides with hashtags and a sixth object
    const prompt = `
      Generate content for a 5-slide carousel about "${topic}", plus an additional summary slide. Return a JSON array with 6 objects, each containing the specified fields. The structure is as follows:

      - Slide 1:
        - "tagline": A short, catchy phrase (5-10 words).
        - "title": An overview of the topic in uppercase (2-3 words, e.g., "${topic.toUpperCase()}").
        
      - Slide 2:
        - "title": "Why ${topic}" (2-3 words).
        - "description": 1-2 sentences explaining the importance of the topic (15-25 words, max 30 words).
       
      - Slide 3:
        - "title": "Importance ${topic}" (2-3 words).
        - "description": 1-2 sentences explaining the significance of the topic (15-25 words, max 30 words).
        
      - Slide 4:
        - "title": "Future of ${topic}" (2-3 words).
        - "description": 1-2 sentences exploring future trends or developments (15-25 words, max 30 words).
       
      - Slide 5:
        - "tagline": A short closing phrase (5-10 words).
        - "title": "Connect With US!" (exact text).
        - "description": 1-2 sentences encouraging the audience to follow (15-25 words, max 30 words).
        
      - Slide 6 (Summary):
        - "title": The same title as Slide 1 (e.g., "${topic.toUpperCase()}").
        - "description": A brief summary of the carousel or Slide 1’s content (1-2 sentences, 15-25 words, max 30 words).
        - "hashtags": A list of 5-10 relevant hashtags (can overlap with Slide 1’s hashtags).

      Return the data as a JSON array with 6 objects. Example:
      [
        { "tagline": "Welcome to the Journey", "title": "${topic.toUpperCase()}" },
        { "title": "Why ${topic}", "description": "..." },
        { "title": "Importance ${topic}", "description": "..." },
        { "title": "Future of ${topic}", "description": "..." },
        { "tagline": "Stay Connected!", "title": "Connect With US!", "description": "..." },
        { "title": "${topic.toUpperCase()}", "description": "...", "hashtags": ["#${topic.replace(
      /\s/g,
      ""
    )}", "#Topic"] }
      ]

      **Important Instructions:**
      - Return ONLY the JSON array with no additional text, comments, or explanations before or after the JSON.
      - Ensure the JSON is valid and properly formatted.
      - Hashtags must be unique within each slide, relevant to the topic, and start with "#".
      - Do not include markdown, HTML tags, or other non-JSON content in the response.
    `;

    const response = await ollama.chat({
      model: "gemma3:latest",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const jsonMatch = response.message.content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No valid JSON array found in response");
    }
    const generatedContent = JSON.parse(jsonMatch[0]);
    console.log("Generated carousel content:", generatedContent);

    return generatedContent;
  } catch (error) {
    throw new ApiError(
      400,
      `Failed to generate carousel content: ${error.message}`
    );
  }
};

const generateDoYouKnow = async (topic) => {
  try {
    const prompt = `
      Generate a "Did You Know?" fact about the topic "${topic}" in JSON format. The JSON must have three fields:
      - "title": "DID YOU KNOW?" (exact text, uppercase).
      - "description": A concise, interesting fact (1-2 sentences, 15-25 words, max 30 words).
      - "hashtags": A list of 5-10 relevant hashtags (e.g., ["#${topic.replace(
      /\s/g,
      ""
    )}", "#Topic"], no duplicates, start with "#").
      
      Example:
      {
        "title": "DID YOU KNOW?",
        "description": "Social media reaches billions, surpassing traditional ads with real-time engagement.",
        "hashtags": ["#SocialMedia", "#Marketing", "#DigitalMarketing", "#Engagement", "#Online"]
      }

      **Important Instructions:**
      - Return ONLY the JSON object with no additional text, comments, or explanations.
      - Ensure the JSON is valid and properly formatted.
      - Do not include markdown, code fences (e.g., \`\`\`json), or other non-JSON content.
    `;

    const response = await ollama.chat({
      model: "gemma3:latest",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Clean and parse the response
    const cleanedResponse = response.message.content
      .replace(/```json|```/g, "")
      .trim();
    console.log("Do You Know response:", cleanedResponse);

    const generatedContent = JSON.parse(cleanedResponse);
    console.log("Parsed Do You Know content:", generatedContent);

    return generatedContent;
  } catch (error) {
    throw new ApiError(
      400,
      `Failed to generate Do You Know content: ${error.message}`
    );
  }
};

const generateImageContent = async (topic) => {
  try {
    const prompt = `
      Generate content for a social media post about the topic "${topic}" in JSON format. The JSON must have three fields:
      - "title": A short, engaging title in uppercase (2-5 words, e.g., "ENCOURAGING WORDS").
      - "description": A brief description or quote (1-2 sentences, 15-25 words, max 30 words).
      - "hashtags": A list of 5-10 relevant hashtags (e.g., ["#${topic.replace(
      /\s/g,
      ""
    )}", "#Topic"], no duplicates, start with "#").
      
      Example:
      {
        "title": "ENCOURAGING WORDS",
        "description": "Is it too soon to say 'I love you'?",
        "hashtags": ["#Love", "#Relationship", "#Dating", "#Advice", "#Encouragement"]
      }

      **Important Instructions:**
      - Return ONLY the JSON object with no additional text, comments, or explanations.
      - Ensure the JSON is valid and properly formatted.
      - Do not include markdown, code fences (e.g., \`\`\`json), or other non-JSON content.
    `;

    const response = await ollama.chat({
      model: "gemma3:latest",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Clean and parse the response
    const cleanedResponse = response.message.content
      .replace(/```json|```/g, "")
      .trim();
    console.log("Image content response:", cleanedResponse);

    const generatedContent = JSON.parse(cleanedResponse);
    console.log("Parsed image content:", generatedContent);

    return generatedContent;
  } catch (error) {
    throw new ApiError(
      400,
      `Failed to generate image content: ${error.message}`
    );
  }
};

const generateTopics = async (topic) => {
  try {
    // Use timestamp to make each prompt unique
    const timestamp = Date.now();
    const prompt = `Generate 10 unique and creative topics related to "${topic}" in JSON format. Each topic must be exactly 4 or 5 words long. The JSON must have keys "topic1" through "topic10", each with a string value representing a topic. Ensure the topics are diverse, fresh, and do not repeat any previously suggested topics. Example: {"topic1": "Digital Art Trends", "topic2": "NFT Market Growth", ...}. Request ID: ${timestamp}`;

    const response = await ollama.chat({
      model: "gemma3:latest",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Step 1: Remove <think> tags and their content
    let cleanedResponse = response.message.content
      .replace(/<think>[\s\S]*<\/think>/g, "")
      .trim();

    // Step 2: Extract the JSON part by finding the content between the first '{' and last '}'
    const jsonStart = cleanedResponse.indexOf("{");
    const jsonEnd = cleanedResponse.lastIndexOf("}") + 1;

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new ApiError(400, "No valid JSON object found in the response");
    }

    cleanedResponse = cleanedResponse.slice(jsonStart, jsonEnd).trim();

    // Step 3: Remove code fences if they are still present (e.g., ```json or ```)
    cleanedResponse = cleanedResponse.replace(/```json|```/g, "").trim();

    // Step 4: Validate that the cleaned response is a proper JSON string
    if (!cleanedResponse.startsWith("{") || !cleanedResponse.endsWith("}")) {
      throw new ApiError(
        400,
        "Invalid JSON format: Response does not appear to be a valid JSON object"
      );
    }

    // Step 5: Parse the cleaned JSON response
    const generatedContent = JSON.parse(cleanedResponse);

    // Step 6: Validate the structure of the parsed JSON
    const expectedKeys = Array.from({ length: 10 }, (_, i) => `topic${i + 1}`);
    const hasAllKeys = expectedKeys.every(
      (key) =>
        key in generatedContent && typeof generatedContent[key] === "string"
    );

    if (!hasAllKeys) {
      throw new ApiError(
        400,
        "Invalid JSON structure: Missing or invalid topic keys/values"
      );
    }

    console.log(generatedContent);
    return generatedContent;
  } catch (error) {
    console.error("Error generating topics:", error);
    throw new ApiError(400, "Failed to generate topics content");
  }
};

const generateBlog = async (topic) => {
  try {
    const topicString = topic && typeof topic === "object" ? topic.topic : topic;
    if (!topicString || typeof topicString !== "string") {
      throw new ApiError(400, "Invalid topic provided for blog generation");
    }

    const primaryKeyword = topicString.toLowerCase().replace(/\s+/g, "-"); // e.g., "rust-is-future-of-blockchain"
    const year = new Date().getFullYear(); // 2025
    //     const prompt = `
    // Generate a 600-800 word SEO-optimized blog post about "${topicString}" in JSON format:
    // - "title": 50-60 chars with "${primaryKeyword}" and "${year}".
    // "content": A 600-800 word blog post in an engaging, conversational tone, structured as follows:
    //        - Introduction: Introduce "${topicString}" and its relevance to the target audience, using "${primaryKeyword}" naturally (2-3 sentences).
    //       - Dynamic Sections: Include 3-4 sections tailored to "${topicString}" and its user intent (e.g., "Steps to Follow" for tutorials, "Latest Trends" for industry updates, "Product Features" for commercial topics). Each section should have a descriptive <h2> subheading, 150-200 words, and 1-2 sentences per key point or example. Choose section topics that best suit "${topicString}" (e.g., for "AI in Healthcare": "AI Diagnostic Tools", "Patient Care Innovations", "Ethical Considerations").
    //       - FAQ Section: Include 2-3 reader-focused FAQs about "${topicString}" with concise answers (1-2 sentences each) to address common search queries.
    //       - Conclusion: Summarize key points, include a strong call-to-action (e.g., "Share your thoughts in the comments!"), and encourage social sharing (2-3 sentences).
    //       Format the content with:
    //       - Short paragraphs (2-3 sentences).
    //       - Subheadings (e.g., <h2>Dynamic Section Title</h2>, <h3>FAQ</h3>).
    //       - Bullet points or numbered lists for key points or examples where appropriate.
    // - "metaDescription": 50-100 chars with "${primaryKeyword}".
    // - "categories": 2-3 categories.
    // - "tags": 4-6 tags .
    // - "image": { "altText": 80-100 chars, "description": 1-2 sentences }.
    // - "focusKeyword": "${primaryKeyword}".
    // - "excerpt": 100-160 chars with "${primaryKeyword}".
    // Use 1-2% "${primaryKeyword}" density, valid JSON, and avoid keyword stuffing.
    // `;
    const prompt = `
You are an expert content generator. Generate a 600-800 word SEO-optimized blog post about "${topicString}" in **valid JSON format** with the following structure:
{
  "title": "A 50-60 character title including '${primaryKeyword}' and '${year}'",
  "content": "<p>Introduction (2-3 sentences introducing '${topicString}' with '${primaryKeyword}').</p><h2>Section 1 Title</h2><p>150-200 words on a relevant subtopic.</p><h2>Section 2 Title</h2><p>150-200 words on another subtopic.</p><h2>Section 3 Title</h2><p>150-200 words on another subtopic.</p><h3>FAQ</h3><p><strong>Q1?</strong> 1-2 sentence answer.</p><p><strong>Q2?</strong> 1-2 sentence answer.</p><p><strong>Q3?</strong> 1-2 sentence answer.</p><p>Conclusion (2-3 sentences summarizing key points with a call-to-action, e.g., 'Share your thoughts!').</p>",
  "metaDescription": "50-100 character description with '${primaryKeyword}'",
  "categories": ["Category1", "Category2"],
  "tags": [ "tag3", "tag4"],
  "focusKeyword": "${primaryKeyword}",
  "excerpt": "100-160 character excerpt with '${primaryKeyword}'"
  "image": {
    "altText": "80-100 character alt text for an image related to '${topicString}'",
    "description": "1-2 sentence image description"
  },
}
Rules:
- Ensure 1-2% '${primaryKeyword}' density in 'content', avoiding keyword stuffing.
- Include HTML tags (<p>, <h2>, <h3>, <strong>) in the 'content' field, but **escape all HTML tags and special characters** in the JSON output (e.g., '<' as '\\\\<', '>' as '\\\\>', '"' as '\\\\"', '\n' as '\\\\n') to ensure the JSON is valid and can be parsed by JSON.parse().
- Use double backslashes for escaping to ensure proper JSON serialization (e.g., '\\\\<p\\\\>' for '<p>').
- Use short paragraphs (2-3 sentences) and bullet points/numbered lists where appropriate.
- Tailor section titles and FAQs to '${topicString}' (e.g., for 'Rust is Future of Blockchain': 'Latest Trends in Rust-Based Blockchain Development', 'Q: Why is Rust considered more secure than Solidity?').
- Output **only valid JSON** with no markdown (e.g., \`\`\`json), extra whitespace, or comments.
- Ensure the JSON is a single object starting with '{' and ending with '}'.
- **Test the output JSON for validity** before returning to ensure it can be parsed by JSON.parse(). If the JSON is invalid, attempt to fix it by properly escaping HTML tags and special characters.
`;


    const response = await ollama.chat({
      model: "gemma3:latest",
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      options: {
        temperature: 0.4, // Lowered for consistency
        max_tokens: 3000,
        timeout: 120000,
      },
    });

    console.log("Response from Ollama:", response.message.content);
    // Clean response
    let jsonString = response.message.content.trim();

    // Remove markdown code fences, if present
    jsonString = jsonString.replace(/^```json\s*|\s*```$/g, "");

    console.log("Cleaned JSON String:", jsonString);

    // Parse JSON string into an object
    let parsedResponse = JSON.parse(jsonString);

    console.log("Parsed Response:", parsedResponse);

    // Unescape HTML tags in content for rendering
    const unescapedContent = parsedResponse.content
      .replace(/\\</g, '<')
      .replace(/\\>/g, '>')
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
      .replace(/\\\\/g, '\\'); // Handle double backslashes

    return {
      title: parsedResponse?.title,
      content: unescapedContent,
      metaDescription: parsedResponse?.metaDescription,
      categories: parsedResponse?.categories,
      tags: parsedResponse?.tags,
      imageAltText: parsedResponse?.image?.altText,
      imageDescription: parsedResponse?.image?.description,
      excerpt: parsedResponse?.excerpt,
      focusKeyword: parsedResponse?.focusKeyword,
      slug: primaryKeyword,
    };

  } catch (error) {
    console.error("Error generating blog:", error);
    throw new ApiError(
      400,
      error.message || "Failed to generate SEO-optimized blog content"
    );
  }
}


const generateContent = async (topic, audience = 'general-public', tone = 'objective', section) => {
  try {
    const topicString = topic && typeof topic === 'object' ? topic.topic : topic;
    if (!topicString || typeof topicString !== 'string') {
      throw new ApiError(400, 'Invalid topic provided for content generation');
    }
    if (!['blog', 'news', 'article'].includes(section)) {
      throw new ApiError(400, 'Invalid section provided');
    }

    const primaryKeyword = topicString.toLowerCase().replace(/\s+/g, '-');
    const year = new Date().getFullYear(); // 2025

    const prompt = `
You are an expert content generator. Generate a ${section === 'blog' ? '600-800 word' : section === 'news' ? '300-600 word' : '500-1000 word'} SEO-optimized ${section} post about "${topicString}" for ${audience} in a ${tone} tone in **valid JSON format** with the following structure:
{
  "title": "A 50-60 character title including '${primaryKeyword}' and '${year}'",
  "content": "<p>Introduction (2-3 sentences introducing '${topicString}' with '${primaryKeyword}').</p>${section === 'blog' ? '<h2>Section 1 Title</h2><p>150-200 words on a tutorial or guide.</p><h2>Section 2 Title</h2><p>150-200 words on benefits or steps.</p><h2>Section 3 Title</h2><p>150-200 words on examples or use cases.</p>' : section === 'news' ? '<h2>Section 1 Title</h2><p>100-150 words on key facts.</p><h2>Section 2 Title</h2><p>100-150 words on implications.</p>' : '<h2>Section 1 Title</h2><p>150-200 words on trends.</p><h2>Section 2 Title</h2><p>150-200 words on analysis.</p><h2>Section 3 Title</h2><p>150-200 words on future outlook.</p>'}${section === 'news' ? '<h3>FAQ</h3><p><strong>Q1?</strong> 1-2 sentence answer.</p><p><strong>Q2?</strong> 1-2 sentence answer.</p>' : ''}<p>Conclusion (2-3 sentences summarizing key points with a call-to-action, e.g., 'Share your thoughts!').</p><p>Insert infographic: ${topicString} trends.</p><p><a href=\\"/${section}/related-${primaryKeyword}\\">Related ${section}</a></p><p><a href=\\"https://helium.com\\">Helium</a></p>",
  "metaDescription": "150-160 character description with '${primaryKeyword}'",
  "categories": ["${section.charAt(0).toUpperCase() + section.slice(1)}", "Blockchain"],
  "tags": ["${primaryKeyword}", "${section}", "${audience}", "${tone}", "blockchain", "${year}"],
  "focusKeyword": "${primaryKeyword}",
  "excerpt": "100-160 character excerpt with '${primaryKeyword}'",
  "image": {
    "altText": "80-100 character alt text for an image related to '${topicString}'",
    "description": "1-2 sentence image description"
  }
}
Rules:
- Ensure 1-2% '${primaryKeyword}' density in 'content', avoiding keyword stuffing.
- Include HTML tags (<p>, <h2>, <h3>, <strong>, <a>) in 'content', but **escape all HTML tags and special characters** in the JSON output (e.g., '<' as '\\\\<', '>' as '\\\\>', '"' as '\\\\"', '\n' as '\\\\n').
- Use double backslashes for escaping to ensure proper JSON serialization (e.g., '\\\\<p\\\\>' for '<p>').
- Use short paragraphs (2-3 sentences) and bullet points/numbered lists where appropriate.
- Tailor section titles and ${section === 'news' ? 'FAQs' : 'content'} to '${topicString}' (e.g., for 'Rust Blockchain': 'Rust Development Trends').
- Output **only valid JSON** with no markdown, extra whitespace, or comments.
- Ensure the JSON is a single object starting with '{' and ending with '}'.
- **Test the output JSON for validity** before returning to ensure it can be parsed by JSON.parse(). If invalid, fix by properly escaping HTML tags and special characters.
`;

    const response = await ollama.chat({
      model: 'gemma3:latest',
      messages: [{ role: 'user', content: prompt }],
      options: {
        temperature: 0.4,
        max_tokens: 4000,
        timeout: 120000,
      },
    });

    console.log('Response from Ollama:', response.message.content);
    let jsonString = response.message.content.trim().replace(/^```json\s*|\s*```$/g, '');
    console.log('Cleaned JSON String:', jsonString);

    let parsedResponse;

    parsedResponse = JSON.parse(jsonString);


    console.log('Parsed Response:', parsedResponse);

    // Unescape HTML tags in content
     const unescapedContent = parsedResponse.content
      .replace(/\\</g, '<')
      .replace(/\\>/g, '>')
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
      .replace(/\\\\/g, '\\');

    return {
      title: parsedResponse.title,
      content: unescapedContent,
      metaDescription: parsedResponse.metaDescription,
      categories: parsedResponse.categories,
      tags: parsedResponse.tags,
      imageAltText: parsedResponse.image?.altText,
      imageDescription: parsedResponse.image?.description,
      excerpt: parsedResponse.excerpt,
      focusKeyword: parsedResponse.focusKeyword,
      topic: topic,
      slug: primaryKeyword,
      audience,
      tone,
      section,
    };
  } catch (error) {
    console.error('Error generating content:', error);
    throw new ApiError(500, error.message || 'Failed to generate SEO-optimized content');
  }
};

const generateCode = async (input, file) => {
  if (!file) throw new ApiError(400, "Image is required");

  console.log(file);
  const imageBuffer = fs.readFileSync(file.path);
  const base64Image = imageBuffer.toString("base64");
  let prompt = input.code;
  const response = await ollama.chat({
    model: "llava:13b",
    messages: [
      {
        role: "user",
        content: prompt,
        images: [base64Image],
      },
    ],
    options: {
      temperature: 0.7,
      max_tokens: 2000,
    },
  });

  console.log("Response", response.message.content);
  // Extract and return the generated code
  const generatedCode = response.message.content;

  return generatedCode;
};
export {
  generateCarouselContent,
  generateDoYouKnow,
  generateTopics,
  generateImageContent,
  generateBlog,
  generateCode,
  generateContent
};
