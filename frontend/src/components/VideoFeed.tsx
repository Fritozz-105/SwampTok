import React, { useState } from 'react';
import PostCard from './PostCard';

interface Post {
  _id: string;
  userId: {
    _id: string;
    displayName: string;
    photoURL?: string;
  };
  videoUrl: string;
  caption: string;
  tags: string[];
  likes: string[];
  comments: Array<{ userId: string; text: string; createdAt: string }>;
  createdAt: string;
}

interface VideoFeedProps {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ posts, isLoading, error }) => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Play video when it comes into view
  const handleVideoInView = (postId: string) => {
    setActiveVideo(postId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md my-4">
        <p>Error loading posts: {error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-500">No posts available yet.</p>
        <p className="text-gray-400 mt-2">Be the first to post a video!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          isActive={activeVideo === post._id}
          onPlay={() => handleVideoInView(post._id)}
        />
      ))}
    </div>
  );
};

export default VideoFeed;
