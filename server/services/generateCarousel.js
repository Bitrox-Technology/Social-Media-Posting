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
        - A title that is an overview of the topic in uppercase (e.g., "${topic.toUpperCase()} OVERVIEW")
        - A description (1-2 sentences introducing the topic)
      - Slide 2:
        - A title in the format "Why ${topic} Matters"
        - A description (1-2 sentences explaining the importance of the topic)
      - Slide 3:
        - A title in the format "Top Tips for ${topic}"
        - A description (1-2 sentences providing 2-3 expert tips related to the topic)
      - Slide 4:
        - A title in the format "Future of ${topic}"
        - A description (1-2 sentences exploring future trends or developments related to the topic)
      - Slide 5:
        - A tagline (a short closing phrase)
        - A title that is "THANK YOU!" in uppercase
        - A description (1-2 sentences encouraging the audience to follow for more content)

      Return the data as a JSON array with 5 objects, each containing the appropriate fields (tagline, title, description). For example:
      [
        { "tagline": "Welcome to the Journey", "title": "${topic.toUpperCase()}", "description": "..." },
        { "title": "Why ${topic} Matters", "description": "..." },
        { "title": "Top Tips for ${topic}", "description": "..." },
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
      model: "deepseek-r1:7b",
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
        model: "deepseek-r1:7b",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });
  
      const cleanedResponse = response.message.content.replace(/<think>[\s\S]*<\/think>/g, '').replace(/```json|```/g, '').trim();
      console.log(cleanedResponse);

      const generatedContent = JSON.parse(cleanedResponse);
      console.log(generatedContent);
  
      return generatedContent;
  } catch (error) {
    throw new ApiError(400, "Failed to generate do you know content");
  }
}


const generateTopics = async (topic) => {
  try {
    const prompt = `Generate 10 topics related to "${topic}" in JSON format. The JSON must have keys "topic1" through "topic10", each with a string value representing a topic. Example: {"topic1": "Example Topic 1", "topic2": "Example Topic 2", ...}`;

    const response = await ollama.chat({
      model: "deepseek-r1:7b",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const cleanedResponse = response.message.content
      .replace(/<think>[\s\S]*<\/think>/g, '') // Remove <think> tags and their content
      .replace(/```json|```/g, '') // Remove code fences if present
      .trim();
   console.log(cleanedResponse);
    // Parse the cleaned JSON response
    const generatedContent = JSON.parse(cleanedResponse);

    console.log(generatedContent);

    return generatedContent;
} catch (error) {
  throw new ApiError(400, "Failed to generate topics content");
}
}

export { generateCarouselContent, generateDoYouKnow, generateTopics };