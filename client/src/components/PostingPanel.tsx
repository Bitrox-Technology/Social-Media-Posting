import React, { useState } from 'react';
import { Instagram, Facebook, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import axios from 'axios';

interface PostingPanelProps {
  contentType: 'post' | 'reel';
  topic: string;
  content: string;
  image: File;
  onBack: () => void;
}

export const PostingPanel: React.FC<PostingPanelProps> = ({
  contentType,
  topic,
  content,
  image,
  onBack,
}) => {
  console.log("Data----", contentType, topic, content, image);
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isScheduled, setIsScheduled] = useState(false); // Toggle for scheduling
  const [scheduleDateTime, setScheduleDateTime] = useState(''); // DateTime input
  const parsedContent = JSON.parse(content);

  console.log("Parsed Content---", parsedContent, scheduleDateTime);

  const handlePost = async (platform: string) => {
    if (platform !== 'instagram') {
      setPosting(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPosted(prev => [...prev, platform]);
      setPosting(false);
      return;
    }

    setPosting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', parsedContent.title);
      formData.append('content', parsedContent.content);
      formData.append('hashtags', JSON.stringify(parsedContent.hashtags));
      formData.append('image', image);

      // Add scheduleTime only if scheduling is selected and a date is provided
      if (isScheduled && scheduleDateTime) {
        console.log("Schedule Time---", scheduleDateTime);
        formData.append('scheduleTime', scheduleDateTime);
      }

      const response = await axios.post(
        'http://localhost:4000/api/v1/post',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Post response:', response.data);
      setPosted(prev => [...prev, 'instagram']);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Error posting to Instagram:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Failed to post to Instagram');
      } else {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      }
    } finally {
      setPosting(false);
    }
  };

  const isImage = contentType === 'post';

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <button
          onClick={onBack}
          className="flex items-center text-yellow-500 hover:text-yellow-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <h2 className="text-2xl font-semibold text-white ml-4">Ready to Post</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 space-y-6">
        <div className="aspect-video rounded-lg overflow-hidden relative">
          {isImage ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Selected content"
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={URL.createObjectURL(image)}
              controls
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 px-2 py-1 rounded">
            <span className="text-white font-bold">Bitrox</span>
            <span className="text-yellow-500 font-bold">AI</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">{parsedContent.title}</h3>
          <p className="text-gray-300">{parsedContent.content}</p>
          <div className="flex flex-wrap gap-2">
            {parsedContent.hashtags.map((tag: string, i: number) => (
              <span
                key={i}
                className="text-sm text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Scheduling Toggle and Input */}
        <div className="space-y-4">
          <label className="flex items-center space-x-2 text-white">
            <input
              type="checkbox"
              checked={isScheduled}
              onChange={(e) => setIsScheduled(e.target.checked)}
              className="form-checkbox text-yellow-500"
            />
            <span>Schedule Post</span>
          </label>

          {isScheduled && (
            <input
              type="datetime-local"
              value={scheduleDateTime}
              onChange={(e) => setScheduleDateTime(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              min={new Date().toISOString().slice(0, 16)} // Prevent past dates
            />
          )}
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="flex justify-center space-x-4 pt-4">
          <button
            onClick={() => handlePost('instagram')}
            disabled={posting || posted.includes('instagram') || (isScheduled && !scheduleDateTime)}
            className="flex items-center space-x-2 px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Instagram className="w-5 h-5" />
            <span>
              {posted.includes('instagram')
                ? 'Posted to Instagram'
                : posting
                ? 'Posting...'
                : isScheduled
                ? 'Schedule Post'
                : 'Post to Instagram'}
            </span>
            {posting && <Loader2 className="w-5 h-5 animate-spin" />}
            {posted.includes('instagram') && <CheckCircle className="w-5 h-5" />}
          </button>

          <button
            onClick={() => handlePost('facebook')}
            disabled={posting || posted.includes('facebook')}
            className="flex items-center space-x-2 px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Facebook className="w-5 h-5" />
            <span>
              {posted.includes('facebook')
                ? 'Posted to Facebook'
                : posting
                ? 'Posting...'
                : 'Post to Facebook'}
            </span>
            {posting && <Loader2 className="w-5 h-5 animate-spin" />}
            {posted.includes('facebook') && <CheckCircle className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};