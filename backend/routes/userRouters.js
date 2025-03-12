const express = require('express');
const {
    signup,
    verifyAccount,
    resendOTP,
    login,
    logout,
    forgetPassword,
    resetPassword,
    changePassword
} = require('../controllers/authController');
const isAuthenticated = require('../middlewares/isAuthenticated');
const {
    getProfile,
    editProfile,
    suggestedUser,
    followUnfollow,
    getMe
} = require('../controllers/userController');
const upload = require('../middlewares/multer');

const router = express.Router();

// auth routes==============
router.post('/signup', signup);
router.post('/verify', verifyAccount);
router.post('/resend-otp', isAuthenticated, resendOTP);
router.post('/login', login);
router.get('/authenticated', isAuthenticated, (req, res) => {
    console.log('user => ', req.user);
    res.json({ user: req.user });
});
router.post('/logout', logout);
router.post('/forget-password', forgetPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', isAuthenticated, changePassword);

// user routes==============
router.get('/profile/:id', getProfile);
router.post(
    '/edit-profile',
    isAuthenticated,
    upload.single('profilePicture'),
    editProfile
);
router.get('/suggested-user', isAuthenticated, suggestedUser);
router.post('/follow-unfollow/:id', isAuthenticated, followUnfollow);
router.get('/me', isAuthenticated, getMe);

module.exports = router;
