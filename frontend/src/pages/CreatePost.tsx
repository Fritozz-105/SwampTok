import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import VideoUpload from '../components/VideoUpload';
import { createPost } from '../tools/api';
import useAuth from '../hooks/useAuth';

const CreatePost: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const [tags, setTags] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleVideoUploadComplete = (url: string) => {
        setVideoUrl(url);
        setError(null);
    };

    const handleVideoUploadError = (error: Error) => {
        console.error('Video upload error:', error);
        setError('Failed to upload video. Please try again.');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!videoUrl) {
            setError('Please upload a video first');
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await createPost({
                firebaseUid: currentUser!.uid,
                videoUrl,
                caption,
                tags
            });

            if (!response.success) {
                throw new Error(response.message || 'Failed to create post');
            }

            navigate('/');

        } catch (err) {
            console.error('Error creating post:', err);
            setError('Failed to create post. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-3xl mx-auto py-8">
                <h1 className="text-2xl font-bold mb-6">
                    Create New Post
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Video Upload Component */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Upload Video
                        </label>
                        <VideoUpload
                            onUploadComplete={handleVideoUploadComplete}
                            onError={handleVideoUploadError}
                            maxSizeMB={100}
                        />
                    </div>

                    {/* Caption Field */}
                    <div className="space-y-2">
                        <label htmlFor="caption" className="block text-sm font-medium text-gray-700">
                            Caption
                        </label>
                        <textarea
                            id="caption"
                            name="caption"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            rows={3}
                            placeholder="Write a caption for your video..."
                        ></textarea>
                    </div>

                    {/* Tags Field */}
                    <div className="space-y-2">
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                            Tags
                        </label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Add tags separated by commas (e.g. fun, campus, event)"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting || !videoUrl}
                            className={`px-4 py-2 rounded-md font-medium ${
                                isSubmitting || !videoUrl
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            {isSubmitting ? 'Creating Post...' : 'Create Post'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default CreatePost;
