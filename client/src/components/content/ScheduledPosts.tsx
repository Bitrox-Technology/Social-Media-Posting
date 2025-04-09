import React from 'react';

interface Post {
    title: string;
    date: string;
    platforms: string[];
}

export const ScheduledPosts: React.FC = () => {
    const posts: Post[] = [
        { title: "Digital Transformation in Finance", date: "Apr 26, 2024 9:00 AM", platforms: ["linkedin", "facebook", "instagram"] },
        { title: "ESG Investing", date: "Apr 26, 2024 12:00 PM", platforms: ["linkedin", "facebook", "instagram"] },
        { title: "Regulatory Tech (FinTech) Innovations", date: "Apr 26, 2024 3:00 PM", platforms: ["linkedin", "facebook", "instagram"] },
        { title: "Economic Forecasting and Analysis", date: "Apr 26, 2024 6:00 PM", platforms: ["linkedin", "facebook", "instagram"] },
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-3xl font-bold text-yellow-400 mb-6">Scheduled Posts</h1>
            <div className="bg-gray-800 rounded-lg shadow-lg p-4">
                {posts.map((post, index) => (
                    <div key={index} className="flex justify-between items-center border-b border-gray-700 py-3">
                        <span className="text-lg">{post.title}</span>
                        <span className="text-md text-gray-400">{post.date}</span>
                        <div className="flex space-x-2">
                            {post.platforms.map((platform, idx) => (
                                <span
                                    key={idx}
                                    className={`text-${platform === 'linkedin' ? 'blue-500' : platform === 'facebook' ? 'blue-600' : 'pink-500'
                                        }`}
                                >
                                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
