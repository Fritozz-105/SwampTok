import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { likePost, unlikePost, addComment } from '../tools/api';
import useAuth from '../hooks/useAuth';
import { Post, CommentWithUser } from '../types';

interface PostCardProps {
    post: Post;
    isActive: boolean;
    onPlay: () => void;
    onPostUpdate?: (updatedPost: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, isActive, onPlay, onPostUpdate }) => {
    const { currentUser } = useAuth();
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [likesCount, setLikesCount] = useState<number>(post.likes.length);
    const [showComments, setShowComments] = useState<boolean>(false);
    const [newComment, setNewComment] = useState<string>('');
    const [comments, setComments] = useState<CommentWithUser[]>(() =>
        // Convert any string userIds to User objects for UI
        post.comments.map(comment => {
        // If userId is a string, convert to a minimal User object
        if (typeof comment.userId === 'string') {
            return {
            ...comment,
            userId: {
                _id: comment.userId,
                displayName: 'User',
                photoURL: undefined
            }
            } as CommentWithUser;
        }
            // Otherwise it's already a User object
            return comment as CommentWithUser;
        })
    );
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // This effect will update isLiked whenever post or currentUser changes
    useEffect(() => {
        if (currentUser && post.likes) {
            // Check if the current user's ID is in the likes array
            setIsLiked(post.likes.includes(currentUser.uid));
        } else {
            setIsLiked(false);
        }
            // Always update likesCount when post changes
            setLikesCount(post.likes.length);
    }, [post.likes, currentUser]);

    // Handle like/unlike
    const handleLikeClick = async () => {
        if (!currentUser) return;

        try {
        // Toggle isLiked state
        setIsLiked(prev => !prev);

        if (isLiked) {
            // Unlike the post
            setLikesCount(prev => Math.max(0, prev - 1));
            const response = await unlikePost(post._id, currentUser.uid);
            if (!response.success) {
            throw new Error(response.message);
            }
        } else {
            // Like the post
            setLikesCount(prev => prev + 1);
            const response = await likePost(post._id, currentUser.uid);
            if (!response.success) {
            throw new Error(response.message);
            }
        }

        // If we have a callback for updating the post data, use it
        if (onPostUpdate) {
            const updatedPost = {
            ...post,
            likes: isLiked
                ? post.likes.filter(id => id !== currentUser.uid)
                : [...post.likes, currentUser.uid]
            };
            onPostUpdate(updatedPost);
        }
        } catch (error) {
            console.error('Error toggling like:', error);

            // Revert the optimistic update if there was an error
            setIsLiked(!isLiked);
            setLikesCount(post.likes.length);
        }
    };

    // Handle comment submission
    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !newComment.trim()) {
            return;
        }

        // Create an optimistic comment for immediate display
        const optimisticComment: CommentWithUser = {
            _id: `temp-${Date.now()}`,
            text: newComment,
            createdAt: new Date().toISOString(),
            userId: {
                _id: currentUser.uid,
                displayName: currentUser.displayName || 'User',
                photoURL: currentUser.photoURL || undefined
            }
        };

        // Add it optimistically
        setComments(prev => [...prev, optimisticComment]);
        setNewComment('');

        try {
            setIsSubmitting(true);

            const response = await addComment(post._id, currentUser.uid, newComment);

            if (!response.success) {
                throw new Error(response.message);
            }

            // Remove temporary comment
            setComments(prev => prev.filter(c => c._id !== optimisticComment._id));

            // Add the new comment to the list - with user details
            const newCommentWithUser: CommentWithUser = {
                _id: response.comment._id,
                text: response.comment.text,
                createdAt: response.comment.createdAt,
                userId: {
                _id: typeof response.comment.userId === 'string'
                    ? response.comment.userId
                    : response.comment.userId._id,
                displayName: currentUser.displayName || 'User',
                photoURL: currentUser.photoURL || undefined
                }
        };

        setComments(prev => [...prev, newCommentWithUser]);

        // If we have a callback for updating the post data, use it
            if (onPostUpdate) {
                const updatedPost = {
                    ...post,
                    comments: [...post.comments, {
                        _id: newCommentWithUser._id,
                        text: newCommentWithUser.text,
                        createdAt: newCommentWithUser.createdAt,
                        userId: newCommentWithUser.userId._id
                    }]
                };
                onPostUpdate(updatedPost);
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            // Remove the optimistic comment on error

            setComments(prev => prev.filter(c => c._id !== optimisticComment._id));
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleComments = () => {
        setShowComments(prev => !prev);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">

            {/* Post header with user info */}
            <div className="p-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    {post.userId.photoURL ? (
                        <img
                            src={post.userId.photoURL}
                            alt={post.userId.displayName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white">
                        {   post.userId.displayName?.charAt(0) || '?'}
                        </div>
                    )}
                </div>
                <div className="ml-3">
                    <p className="font-medium text-gray-900">{post.userId.displayName}</p>
                    <p className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Video */}
            <div className="relative aspect-video bg-black">
                <video
                    src={post.videoUrl}
                    className={`w-full h-full object-contain ${isActive ? 'ring-2 ring-blue-500' : ''}`}
                    controls
                    preload="metadata"
                    poster={`${post.videoUrl}#t=0.1`}
                    onPlay={onPlay}
                    autoPlay={isActive}
                ></video>

                {/* Active indicator */}
                {isActive && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        Now Playing
                    </div>
                )}
            </div>

            {/* Post actions */}
            <div className="p-4">
                <div className="flex space-x-4 mb-3">
                    <button
                        className={`flex items-center ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                        onClick={handleLikeClick}
                        disabled={!currentUser}
                    >
                        <Heart size={20} className="mr-1" fill={isLiked ? "currentColor" : "none"} />
                        <span>
                            {likesCount}
                        </span>
                    </button>
                    <button
                        className="flex items-center text-gray-500 hover:text-blue-500"
                        onClick={toggleComments}
                    >
                        <MessageCircle size={20} className="mr-1" />
                        <span>{comments.length}</span>
                    </button>
                </div>

                {/* Caption */}
                {post.caption && (
                    <p className="text-gray-800 mb-2">{post.caption}</p>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {post.tags.map((tag) => (
                        <span
                            key={tag}
                            className="bg-gray-100 text-blue-600 px-2 py-1 rounded-md text-xs"
                        >
                            #{tag}
                        </span>
                        ))}
                    </div>
                )}

                {/* Comments Section */}
                {showComments && (
                    <div className="mt-4 border-t pt-4">
                        <h4 className="font-medium text-gray-900 mb-3">Comments</h4>

                        {/* Comment List */}
                        <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                            {comments.length === 0 ? (
                                <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment._id} className="flex items-start gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                            {comment.userId.photoURL ? (
                                                <img
                                                    src={comment.userId.photoURL}
                                                    alt={comment.userId.displayName || 'User'}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white">
                                                    {(comment.userId.displayName || 'U').charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="bg-gray-100 p-2 rounded-lg">
                                                <p className="text-xs font-medium text-gray-900 mb-0.5">
                                                    {comment.userId.displayName || 'User'}
                                                </p>
                                                <p className="text-sm">{comment.text}</p>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(comment.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Comment Form */}
                        {currentUser && (
                            <form onSubmit={handleSubmitComment} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !newComment.trim()}
                                    className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700 disabled:opacity-50"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        )}

                        {!currentUser && (
                            <p className="text-sm text-gray-500">
                                Please sign in to add a comment.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostCard;
