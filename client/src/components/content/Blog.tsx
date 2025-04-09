import React, { useState } from 'react';
import { useAppSelector } from '../../store/hooks';

export const Blog: React.FC = () => {
  const contentType = useAppSelector((state) => state.app.contentType);
  const [topic, setTopic] = useState<string>('');
  const [generatedBlog, setGeneratedBlog] = useState<{ title: string; content: string } | null>(null);

  const suggestedTopics = [
    'The Future of Technology in 2025',
    'How to Boost Your Productivity',
    'Exploring Hidden Travel Destinations',
    'A Beginner’s Guide to Healthy Living',
    'The Impact of AI on Everyday Life',
  ];

  const handleGenerateBlog = () => {
    if (!topic.trim()) {
      alert('Please enter or select a topic!');
      return;
    }

    // Simulated AI generation (replace with actual API call if needed)
    const generated = {
      title: `${topic}`,
      content: `## ${topic}\n\nHere’s a blog post about ${topic}. Imagine a world where this topic shapes our daily lives. Let’s dive in!\n\n### Why It Matters\nThe essence of ${topic} lies in its ability to inspire and transform. Whether it’s a new idea, a lifestyle change, or a technological leap, it starts with curiosity. For instance, exploring this topic can lead to unexpected discoveries that enrich our understanding.\n\n### Taking Action\nWhat can you do today? Start small—read up, experiment, or share your thoughts. Every step forward builds momentum. Over time, ${topic} becomes less of a mystery and more of a passion.\n\n### Looking Ahead\nThe future of ${topic} is bright. As we embrace it, we’ll find new ways to connect, grow, and thrive. What’s your take on it? Let’s keep the conversation going!`,
    };
    setGeneratedBlog(generated);
  };

  const handleSave = () => {
    if (!generatedBlog) {
      alert('Please generate a blog first!');
      return;
    }
    console.log('Blog Saved:', generatedBlog);
    alert('Blog saved! (This is a placeholder action)');
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-white mb-8">
        Create Your Blog {contentType && `(${contentType})`}
      </h1>

      <div className="w-full max-w-2xl space-y-6">
        <div>
          <label htmlFor="topic" className="block text-lg font-medium text-white mb-2">
            Blog Topic
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter your blog topic"
            className="w-full p-4 bg-gray-800 text-white rounded-xl border-2 border-gray-700 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div>
          <p className="text-lg font-medium text-white mb-2">Suggested Topics:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedTopics.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setTopic(suggestion)}
                className="px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-700 border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerateBlog}
          className="w-full py-4 bg-yellow-500 text-gray-900 font-semibold rounded-xl hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Generate Blog
        </button>

        {generatedBlog && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">{generatedBlog.title}</h2>
            <div className="p-4 bg-gray-800 text-white rounded-xl border-2 border-gray-700">
              {generatedBlog.content.split('\n').map((line, index) => (
                <p key={index} className="mb-2">
                  {line}
                </p>
              ))}
            </div>
            <button
              onClick={handleSave}
              className="w-full py-4 bg-yellow-500 text-gray-900 font-semibold rounded-xl hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Save Blog
            </button>
          </div>
        )}
      </div>
    </div>
  );
};