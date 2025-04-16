import { Ollama } from "ollama";
import { ApiError } from "../utils/ApiError.js";

const ollama = new Ollama({ host: "http://localhost:11434" });

const generateCarouselContent = async (topic) => {
  try {
    // Craft a single prompt for all five slides with strict instructions
    const prompt = `
      Generate content for a 5-slide carousel about "${topic}". Each slide should have specific content as follows:

      - Slide 1:
        - A tagline (a short, catchy phrase)
        - A title that is an overview of the topic in uppercase (e.g., "${topic.toUpperCase()}") (2-3 words )
      - Slide 2:
        - A title in the format "why ${topic}" (2-3 words )
        - A description (1-2 sentences explaining the importance of the topic)
      - Slide 3:
        - A title in the format "Improtance ${topic}" (2-3 words )
        - A description (1-2 sentences explaining the significance of the topic)
      - Slide 4:
        - A title in the format "Future of ${topic}" (2-3 words )
        - A description (1-2 sentences exploring future trends or developments related to the topic)
      - Slide 5:
        - A tagline (a short closing phrase)
        - A title that is "Connect With US!"
        - A description (1-2 sentences encouraging the audience to follow for more content)

      Return the data as a JSON array with 5 objects, each containing the appropriate fields (tagline, title, description). For example:
      [
        { "tagline": "Welcome to the Journey", "title": "${topic.toUpperCase()}" },
        { "title": "Why ${topic}", "description": "..." },
        { "title": "Improtance ${topic}", "description": "..." },
        { "title": "Future of ${topic}", "description": "..." },
        { "tagline": "Connect with use", "title": "Connect With US!", "description": "..." }
      ]

      **Important Instructions:**
      - Return ONLY the JSON array with no additional text, comments, or explanations before or after the JSON.
      - Ensure the JSON is valid and properly formatted.
      - Do not include any markdown, HTML tags (like <think>), or other non-JSON content in the response.
    `;

    // Call Ollama DeepSeek API once
    const response = await ollama.chat({
      model: "gemma3:latest",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    let generatedContent;
    const jsonMatch = response.message.content.match(/\[[\s\S]*\]/);
    generatedContent = JSON.parse(jsonMatch[0]);
    return generatedContent;
  } catch (error) {
    throw new ApiError(400, "Failed to generate carousel content");
  }
};

const generateDoYouKnow = async (topic) => {
  try {
    const prompt = `Generate a "Did You Know?" fact about the topic "${topic}" in JSON format. The JSON must have two fields: "title" and "description". The "title" must be "DID YOU KNOW?" in uppercase. The "description" must be a concise, interesting fact (1-2 sentences, 15-25 words, max 30 words). Example: {"title": "DID YOU KNOW?", "description": "Social media in digital marketing reaches billions, surpassing traditional ads with real-time engagement."}`;
    const response = await ollama.chat({
      model: "gemma3:latest",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const cleanedResponse = response.message.content
      .replace(/<think>[\s\S]*<\/think>/g, "")
      .replace(/```json|```/g, "")
      .trim();
    console.log(cleanedResponse);

    const generatedContent = JSON.parse(cleanedResponse);
    console.log(generatedContent);

    return generatedContent;
  } catch (error) {
    throw new ApiError(400, "Failed to generate do you know content");
  }
};

const generateImageContent = async (topic) => {
  try {
    const prompt = `Generate content for a social media post about the topic "${topic}". Provide the following in JSON format:
      - "title": A short, engaging title (e.g., "ENCOURAGING WORDS").
      - "description": A brief description or quote (1-2 sentences, 15-25 words, max 30 words), (e.g., "Is it too soon to say 'I love you'?").`;

    const response = await ollama.chat({
      model: "gemma3:latest",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const cleanedResponse = response.message.content
      .replace(/<think>[\s\S]*<\/think>/g, "") // Remove <think> tags and their content
      .replace(/```json|```/g, "") // Remove code fences if present
      .trim();
    console.log(cleanedResponse);
    const generatedContent = JSON.parse(cleanedResponse);

    console.log(generatedContent);

    return generatedContent;
  } catch (error) {
    throw new ApiError(400, "Failed to generate topics content");
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

export {
  generateCarouselContent,
  generateDoYouKnow,
  generateTopics,
  generateImageContent,
  generateBlog
};
