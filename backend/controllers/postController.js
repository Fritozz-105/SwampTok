const Post = require('../models/Post');
const User = require('../models/User');

// Create a new post
const createPost = async (req, res) => {
    try {
        const { firebaseUid, videoUrl, caption, tags } = req.body;

        if (!firebaseUid || !videoUrl) {
            return res.status(400).json({ message: 'User ID and video URL are required' });
        }

        // Find the user by Firebase UID
        const user = await User.findOne({ firebaseUid });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new post
        const newPost = new Post({
            userId: user._id,
            firebaseUid,
            videoUrl,
            caption: caption || '',
            tags: tags ? tags.split(',').map(tag => tag.trim()) : []
        });

        await newPost.save();

        res.status(201).json({
            success: true,
            post: newPost
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating post',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get all posts
const getAllPosts = async (req, res) => {
    try {
        // Get pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Count total posts for pagination metadata
        const totalPosts = await Post.countDocuments();

        // Fetch paginated posts
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'userId',
                select: 'displayName photoURL firebaseUid'
            })
            .populate({
                path: 'comments.userId',
                select: 'displayName photoURL firebaseUid'
            });

        // Return with pagination metadata
        res.status(200).json({
            success: true,
            count: posts.length,
            totalPages: Math.ceil(totalPosts / limit),
            currentPage: page,
            hasMore: page < Math.ceil(totalPosts / limit),
            posts
        });
    } catch (error) {
        // Error handling
        console.error('Error fetching posts:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching posts',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get post by ID
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('userId', 'displayName photoURL firebaseUid')
            .populate('comments.userId', 'displayName photoURL firebaseUid');

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching post',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update post
const updatePost = async (req, res) => {
    try {
        const { caption, tags } = req.body;

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            {
                caption,
                tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
                updatedAt: Date.now()
            },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        res.status(200).json({
            success: true,
            post: updatedPost
        });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating post',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Delete post
const deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting post',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Like a post
const likePost = async (req, res) => {
    try {
        const { firebaseUid } = req.body;

        if (!firebaseUid) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Find user by Firebase UID
        const user = await User.findOne({ firebaseUid });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user already liked the post
        if (post.likes.some(id => id.equals(user._id))) {
            return res.status(400).json({
                success: false,
                message: 'Post already liked'
            });
        }

        // Add user to likes array
        post.likes.push(user._id);
        await post.save();

        res.status(200).json({
            success: true,
            message: 'Post liked successfully',
            likesCount: post.likes.length
        });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while liking post',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Unlike a post
const unlikePost = async (req, res) => {
    try {
        const { firebaseUid } = req.body;

        if (!firebaseUid) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Find user by Firebase UID
        const user = await User.findOne({ firebaseUid });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Remove user from likes array
        post.likes = post.likes.filter(id => !id.equals(user._id));
        await post.save();

        res.status(200).json({
            success: true,
            message: 'Post unliked successfully',
            likesCount: post.likes.length
        });
    } catch (error) {
        console.error('Error unliking post:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while unliking post',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Add comment to a post
const addComment = async (req, res) => {
    try {
        const { firebaseUid, text } = req.body;

        if (!firebaseUid || !text) {
            return res.status(400).json({ message: 'User ID and comment text are required' });
        }

        // Find user by Firebase UID
        const user = await User.findOne({ firebaseUid });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Add comment to post
        const newComment = {
            userId: user._id,
            text,
            createdAt: Date.now()
        };

        post.comments.push(newComment);
        await post.save();

        res.status(200).json({
            success: true,
            message: 'Comment added successfully',
            comment: newComment
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while adding comment',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Delete comment
const deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Find comment index
        const commentIndex = post.comments.findIndex(
            comment => comment._id.toString() === req.params.commentId
        );

        if (commentIndex === -1) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Remove comment from array
        post.comments.splice(commentIndex, 1);
        await post.save();

        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting comment',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get all posts for a user
const getPostsByUser = async (req, res) => {
    try {
        const { firebaseUid } = req.params;

        // Find posts with the given firebaseUid and populate user details
        const posts = await Post.find({ firebaseUid })
            .sort({ createdAt: -1 })
            .populate({
                path: 'userId',
                select: 'displayName photoURL firebaseUid'
            })
            .populate({
                path: 'comments.userId',
                select: 'displayName photoURL firebaseUid'
            });

        return res.json({ success: true, posts });
    } catch (error) {
        console.error('Error fetching user posts:', error);
        return res.status(500).json({ success: false, message: 'Server error fetching user posts' });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    addComment,
    deleteComment,
    getPostsByUser
};
