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
        { "tagline": "Welcome to the Journey", "title": "${topic.toUpperCase()} OVERVIEW", "description": "..." },
        { "title": "Why ${topic} Matters", "description": "..." },
        { "title": "Top Tips for ${topic}", "description": "..." },
        { "title": "Future of ${topic}", "description": "..." },
        { "tagline": "Thanks for Watching", "title": "THANK YOU!", "description": "..." }
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

export { generateCarouselContent };