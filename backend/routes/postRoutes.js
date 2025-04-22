const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Public routes - specific routes first
router.get('/following/:firebaseUid', postController.getFollowingPosts);
router.get('/explore/:firebaseUid', postController.getExplorePosts);
router.get('/user/:firebaseUid', postController.getPostsByUser);

// Generic routes
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);

// Protected routes (need to add auth middleware)
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
router.post('/:id/like', postController.likePost);
router.post('/:id/unlike', postController.unlikePost);
router.post('/:id/comment', postController.addComment);
router.delete('/:id/comment/:commentId', postController.deleteComment);

module.exports = router;
