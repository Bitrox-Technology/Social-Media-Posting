import { Ollama } from "ollama";
import { ApiError } from "../utils/ApiError.js";
import fs from 'fs'


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
        { "title": "${topic.toUpperCase()}", "description": "...", "hashtags": ["#${topic.replace(/\s/g, '')}", "#Topic"] }
      ]

      **Important Instructions:**
      - Return ONLY the JSON array with no additional text, comments, or explanations before or after the JSON.
      - Ensure the JSON is valid and properly formatted.
      - Hashtags must be unique within each slide, relevant to the topic, and start with "#".
      - Do not include markdown, HTML tags, or other non-JSON content in the response.
    `;

    const response = await ollama.chat({
      model: 'gemma3:latest',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });


    const jsonMatch = response.message.content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON array found in response');
    }
    const generatedContent = JSON.parse(jsonMatch[0]);
    console.log('Generated carousel content:', generatedContent);


    return generatedContent;
  } catch (error) {
    throw new ApiError(400, `Failed to generate carousel content: ${error.message}`);
  }
};

const generateDoYouKnow = async (topic) => {
  try {
    const prompt = `
      Generate a "Did You Know?" fact about the topic "${topic}" in JSON format. The JSON must have three fields:
      - "title": "DID YOU KNOW?" (exact text, uppercase).
      - "description": A concise, interesting fact (1-2 sentences, 15-25 words, max 30 words).
      - "hashtags": A list of 5-10 relevant hashtags (e.g., ["#${topic.replace(/\s/g, '')}", "#Topic"], no duplicates, start with "#").
      
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
      model: 'gemma3:latest',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Clean and parse the response
    const cleanedResponse = response.message.content
      .replace(/```json|```/g, '')
      .trim();
    console.log('Do You Know response:', cleanedResponse);

    const generatedContent = JSON.parse(cleanedResponse);
    console.log('Parsed Do You Know content:', generatedContent);

    return generatedContent;
  } catch (error) {
    throw new ApiError(400, `Failed to generate Do You Know content: ${error.message}`);
  }
};

const generateImageContent = async (topic) => {
  try {
    const prompt = `
      Generate content for a social media post about the topic "${topic}" in JSON format. The JSON must have three fields:
      - "title": A short, engaging title in uppercase (2-5 words, e.g., "ENCOURAGING WORDS").
      - "description": A brief description or quote (1-2 sentences, 15-25 words, max 30 words).
      - "hashtags": A list of 5-10 relevant hashtags (e.g., ["#${topic.replace(/\s/g, '')}", "#Topic"], no duplicates, start with "#").
      
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
      model: 'gemma3:latest',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Clean and parse the response
    const cleanedResponse = response.message.content
      .replace(/```json|```/g, '')
      .trim();
    console.log('Image content response:', cleanedResponse);

    const generatedContent = JSON.parse(cleanedResponse);
    console.log('Parsed image content:', generatedContent);

    return generatedContent;
  } catch (error) {
    throw new ApiError(400, `Failed to generate image content: ${error.message}`);
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
    const jsonStart = cleanedResponse.indexOf('{');
    const jsonEnd = cleanedResponse.lastIndexOf('}') + 1;

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new ApiError(400, 'No valid JSON object found in the response');
    }

    cleanedResponse = cleanedResponse.slice(jsonStart, jsonEnd).trim();

    // Step 3: Remove code fences if they are still present (e.g., ```json or ```)
    cleanedResponse = cleanedResponse
      .replace(/```json|```/g, "")
      .trim();

    // Step 4: Validate that the cleaned response is a proper JSON string
    if (!cleanedResponse.startsWith('{') || !cleanedResponse.endsWith('}')) {
      throw new ApiError(400, 'Invalid JSON format: Response does not appear to be a valid JSON object');
    }

    // Step 5: Parse the cleaned JSON response
    const generatedContent = JSON.parse(cleanedResponse);

    // Step 6: Validate the structure of the parsed JSON
    const expectedKeys = Array.from({ length: 10 }, (_, i) => `topic${i + 1}`);
    const hasAllKeys = expectedKeys.every(key => key in generatedContent && typeof generatedContent[key] === 'string');

    if (!hasAllKeys) {
      throw new ApiError(400, 'Invalid JSON structure: Missing or invalid topic keys/values');
    }

    console.log(generatedContent);
    return generatedContent;
  } catch (error) {
    console.error('Error generating topics:', error);
    throw new ApiError(400, "Failed to generate topics content");
  }
};

const generateBlog = async (topic) => {
  try {
    // Handle topic as string or object
    const topicString = typeof topic === 'object' && topic.topic ? topic.topic.trim() : topic.trim();
    console.log("Processed Topic:", topicString);

    const prompt = `Generate content for a blog post strictly about the topic "${topicString}". Do not deviate to unrelated topics like the metaverse unless explicitly part of "${topicString}". Provide the following in JSON format:
      - "title": A compelling and descriptive title directly related to "${topicString}" (e.g., "The Future of Technologies: What Lies Ahead").
      - "content": A detailed blog post (400-500 words) in an engaging tone, structured as follows:
        - Introduction: Briefly introduce "${topicString}" and its importance (2-3 sentences).
        - Why It Matters: Explain key reasons "${topicString}" is impactful with 1-2 sentences per point.
        - Applications: List 3-4 specific examples of "${topicString}" in action across industries (1-2 sentences each).
        - Key Benefits: Highlight 3-5 benefits of "${topicString}" in concise points (1 sentence each).
        - Challenges: Mention 2-3 challenges or limitations of "${topicString}" (1-2 sentences each).
        - Future Outlook: Discuss the future potential or trends of "${topicString}" (2-3 sentences).
        - Conclusion: Wrap up with a summary and forward-looking statement about "${topicString}" (2-3 sentences).
      Ensure the content is informative, structured, and avoids excessive repetition. Return only the JSON object with all special characters (e.g., newlines, tabs, quotes) properly escaped in the "content" string to ensure valid JSON.`;

    const response = await ollama.chat({
      model: "gemma3:latest",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // console.log("Raw Response:", response.message.content);   

    // Extract JSON between first '{' and last '}'
    const jsonStart = response.message.content.indexOf('{');
    const jsonEnd = response.message.content.lastIndexOf('}') + 1;
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No valid JSON object found in response");
    }
    let jsonString = response.message.content.substring(jsonStart, jsonEnd)
      .replace(/```json|```/g, "") // Remove code fences
      .trim();

    // console.log("Initial Extracted JSON:", jsonString);

    // Extract and escape the content field
    const contentMatch = jsonString.match(/"content"\s*:\s*"((?:[^"\\]|\\.)*?)"/s);
    if (contentMatch && contentMatch[1]) {
      const rawContent = contentMatch[1];
      const escapedContent = rawContent
        .replace(/\n/g, "\\n") // Escape newlines
        .replace(/\t/g, "\\t") // Escape tabs
        .replace(/\r/g, "\\r") // Escape carriage returns
        .replace(/"/g, "\\\"") // Escape double quotes within content
        .replace(/\\(?![nrt"])/g, "\\\\"); // Escape lone backslashes
      jsonString = jsonString.replace(`"${rawContent}"`, `"${escapedContent}"`);
    } else {
      throw new Error("Failed to extract or escape content field");
    }

    // console.log("Fixed JSON:", jsonString);

    const generatedContent = JSON.parse(jsonString);
    console.log("Parsed Content:", generatedContent);

    // Return only the { title, content } object
    return {
      title: generatedContent.title,
      content: generatedContent.content
    };
  } catch (error) {
    console.error("Error:", error);
    throw new ApiError(400, error.message || "Failed to generate blog content");
  }
};


const generateCode = async (input, file) => {
  if (!file) throw new ApiError(400, "Image is required")

   console.log(file)
  const imageBuffer = fs.readFileSync(file.path);
  const base64Image = imageBuffer.toString('base64');
  let prompt= input.code;
  const response = await ollama.chat({
    model: 'llava:13b',
    messages: [
      {
        role: 'user',
        content: prompt,
        images: [base64Image] 
      }
    ],
    options: {
      temperature: 0.7,
      max_tokens: 2000, 
    }
  });
   
  console.log("Response", response)
  // Extract and return the generated code
  const generatedCode = response.message.content;

  return generatedCode;

}
export {
  generateCarouselContent,
  generateDoYouKnow,
  generateTopics,
  generateImageContent,
  generateBlog,
  generateCode
};
