const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');
const generateOtp = require('../utils/generateOtp');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const hbs = require('handlebars');

const loadTemplate = (templateName, replacements) => {
    const templatePath = path.join(__dirname, '../emailTemplate', templateName);
    const source = fs.readFileSync(templatePath, 'utf-8').toString();
    const template = hbs.compile(source);
    return template(replacements);
};

// generate token=============
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// create and send token=============
const createSendToken = (user, statusCode, res, message) => {
    const token = signToken(user?._id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', //only secure in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'Lax'
    };

    res.cookie('token', token, cookieOptions);

    user.password = undefined;
    user.newPasswordConfirm = undefined;
    user.otp = undefined;

    res.status(statusCode).json({
        status: 'success',
        message,
        token,
        data: {
            user
        }
    });
};

// user register or signup with OTP==============
exports.signup = catchAsync(async (req, res, next) => {
    const { email, password, passwordConfirm, username } = req.body;

    const existingUser = await User.findOne({
        email
    });

    if (existingUser) return next(new AppError('User already exists', 400));

    const otp = generateOtp();

    const otpExpires = Date.now() + 24 * 60 * 60 * 1000;

    const newUser = await User.create({
        username,
        email,
        password,
        passwordConfirm,
        otp,
        otpExpires
    });

    const htmlTemplate = loadTemplate('otpTemplate.hbs', {
        title: 'OTP for Email verification',
        username: newUser.username,
        otp: otp,
        message: `Your OTP for Email verification is : ${otp}`
    });

    try {
        await sendEmail({
            email: newUser.email,
            subject: 'OTP for Email verification',
            html: htmlTemplate
        });
        createSendToken(newUser, 201, res, 'Registration successfully');
    } catch (error) {
        await User.findByIdAndDelete(newUser?.id);
        return next(new AppError('Error sending email', 500));
    }
});

// user verify OTP==============
exports.verifyAccount = catchAsync(async (req, res, next) => {
    const { otp } = req.body;

    if (!otp)
        return next(new AppError('OTP is missing,Please provide OTP', 400));

    const user = await User.findOne({ otp });

    if (String(user?.otp) !== String(otp))
        return next(new AppError('Invalid OTP', 400));

    if (user?.otpExpires < Date.now())
        return next(
            new AppError('OTP is expired,Please request a new OTP', 400)
        );
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save({ validateBeforeSave: false });

    createSendToken(user, 200, res, 'Email verified successfully');
});

// resend OTP===============
exports.resendOTP = catchAsync(async (req, res, next) => {
    const { email } = req.user;

    if (!email)
        return next(new AppError('Email is required to resend OTP', 400));

    const user = await User.findOne({
        email
    });

    if (!user) return next(new AppError('User not found', 404));
    if (user.isVerified)
        return next(new AppError('User already verified', 400));

    const newOtp = generateOtp();
    user.otp = newOtp;
    user.otpExpires = Date.now() + 24 * 60 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const htmlTemplate = loadTemplate('otpTemplate.hbs', {
        title: 'Resend OTP for Email verification',
        username: newUser.username,
        otp: otp,
        message: `Your Resend OTP for Email verification is : ${newOtp}`
    });

    try {
        await sendEmail({
            email: user.email,
            subject: 'Resend OTP for Email verification',
            html: htmlTemplate
        });
        res.status(200).json({
            status: 'success',
            message: 'New OTP has been sent successfully'
        });
    } catch (error) {
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(
            new AppError(
                'These is an Error sending email! Please try again',
                500
            )
        );
    }
});

// user login with email and password==============
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password)
        return next(new AppError('Please provide email and password', 400));

    const user = await User.findOne({
        email
    }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password)))
        return next(new AppError('Incorrect email or password', 401));

    if (!user.isVerified)
        return next(new AppError('Please verify your email', 401));

    createSendToken(user, 200, res, 'Login successfully');
});

// user logout==============
exports.logout = catchAsync(async (req, res, next) => {
    res.cookie('token', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    });
    res.status(200).json({
        status: 'success',
        message: 'Logout successfully'
    });
});

// forget password=============
exports.forgetPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;

    if (!email) return next(new AppError('Please provide email', 400));

    const user = await User.findOne({
        email
    });

    if (!user) return next(new AppError('User not found', 404));

    const otp = generateOtp();
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const htmlTemplate = loadTemplate('otpTemplate.hbs', {
        title: 'OTP for Password Reset',
        username: user?.username,
        otp: otp,
        message: `Your OTP for Password Reset is : ${otp}`
    });

    try {
        await sendEmail({
            email: user.email,
            subject: 'Reset Password OTP (valid for 10 minutes)',
            html: htmlTemplate
        });
        res.status(200).json({
            status: 'success',
            message: 'Password reset OTP has been sent to your email'
        });
    } catch (error) {
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(
            new AppError(
                'These is an Error sending email! Please try again',
                500
            )
        );
    }
});

// reset password with OTP==============
exports.resetPassword = catchAsync(async (req, res, next) => {
    try {
        console.log('Received request for password reset:', req.body); // Debugging log

        const { otp, password } = req.body;

        // Check if required fields are provided
        if (!otp || !password) {
            return next(
                new AppError('Please provide OTP and new password', 400)
            );
        }

        // Find user by OTP
        const user = await User.findOne({
            resetPasswordOTP: otp,
            resetPasswordOTPExpires: { $gt: Date.now() }
        });

        console.log('User found:', user); // Debugging log

        // If user is not found or OTP is expired
        if (!user) {
            return next(new AppError('Invalid or expired OTP', 400));
        }

        // Update password
        user.password = password;
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpires = undefined;

        await user.save({ validateBeforeSave: false }); // Skip unnecessary validations

        console.log('Password reset successful'); // Debugging log

        createSendToken(user, 200, res, 'Password reset successfully');
    } catch (error) {
        console.error('Error in resetPassword:', error);
        return next(new AppError('Something went wrong', 500));
    }
});

// changed password================
exports.changePassword = catchAsync(async (req, res, next) => {
    const { currentPassword, newPassword, newPasswordConfirm } = req.body;

    if (!currentPassword || !newPassword || !newPasswordConfirm)
        return next(
            new AppError(
                'Please provide current password, new password and confirm password',
                400
            )
        );

    const { email } = req.user;

    const user = await User.findOne({
        email
    }).select('+password');

    if (!user || !(await user.correctPassword(currentPassword, user.password)))
        return next(new AppError('Incorrect current password', 401));

    if (newPassword !== newPasswordConfirm)
        return next(
            new AppError('Password and confirm password does not match', 400)
        );

    user.password = newPassword;
    user.passwordConfirm = newPasswordConfirm;

    await user.save();

    createSendToken(user, 200, res, 'Password changed successfully');
});
