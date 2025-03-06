import React, { useState } from 'react';
import { Sparkles, Hash, ArrowLeft } from 'lucide-react';
import axios from 'axios';

interface ContentIdeasProps {
  topic: string;
  onSelect: (idea: string) => void;
  onBack: () => void;
}

export const ContentIdeas: React.FC<ContentIdeasProps> = ({ topic, onSelect, onBack }) => {
  console.log("Topic-----", topic);
  const [ideas, setIdeas] = useState<{ title: string; content: string; hashtags: string[] }[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchContentIdeas = async () => {
    setLoading(true);
    setIdeas([]);
    try {
      const response = await axios.post(
        'http://localhost:4000/api/v1/ideas', // Adjust endpoint if needed
        { topic },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const generatedIdeas = response.data.data; // Array of ideas directly from response.data.data
      console.log("Generated Ideas:", generatedIdeas);

      // Set the ideas directly from the response
      setIdeas(generatedIdeas);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching content ideas:', error.message);
      } else {
        console.error('Error fetching content ideas:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="flex items-center text-yellow-500 hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h2 className="text-2xl font-semibold text-white ml-4">
            Content Ideas for "{topic}"
          </h2>
        </div>
        <button
          onClick={fetchContentIdeas}
          disabled={loading}
          className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Generating...' : 'Generate Ideas'}
        </button>
      </div>

      <div className="grid gap-6">
        {ideas.length === 0 ? (
          <p className="text-gray-300">
            {loading ? 'Loading content ideas...' : 'Click "Generate Ideas" to get started!'}
          </p>
        ) : (
          ideas.map((idea, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl p-6 border border-yellow-500/50 hover:border-yellow-500 transition-colors cursor-pointer"
              onClick={() => onSelect(JSON.stringify(idea))}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
                    {idea.title}
                  </h3>
                  <p className="text-gray-300 mb-4">{idea.content}</p>
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-yellow-500" />
                    <div className="flex flex-wrap gap-2">
                      {idea.hashtags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-sm text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};