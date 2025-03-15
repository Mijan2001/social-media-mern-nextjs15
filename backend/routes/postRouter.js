const express = require('express');
const isAuthenticated = require('../middlewares/isAuthenticated');
const upload = require('../middlewares/multer');
const {
    createPost,
    getAllPost,
    getUserPosts,
    saveOrUnsavePost,
    deletePost,
    likeOrDislikePost,
    addComment
} = require('../controllers/postController');

const router = express.Router();

// define routes =========
router.post(
    '/create-post',
    isAuthenticated,
    upload.single('image'),
    createPost
);
router.get('/all', getAllPost);
router.get('/user-post/:id', getUserPosts);
router.post('/save-unsave-post/:postId', isAuthenticated, saveOrUnsavePost);
router.delete('/delete-post/:id', isAuthenticated, deletePost);
router.post('/like-dislike/:id', isAuthenticated, likeOrDislikePost);
router.post('/comment/:postId', isAuthenticated, addComment);

module.exports = router;
