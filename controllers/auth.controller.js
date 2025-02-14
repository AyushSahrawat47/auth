import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { sendOtpEmail } from '../utils/email.js'; // Import the email utility

// Define Joi schema for registration validation
const registerSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

// Define Joi schema for login validation
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

// Define Joi schema for password reset request validation
const resetRequestSchema = Joi.object({
    email: Joi.string().email().required()
});

// Define Joi schema for password reset validation
const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
    newPassword: Joi.string().min(6).required()
});

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate request body
        const { error } = registerSchema.validate({ name, email, password });
        if (error) {
            return res.status(400).json({ errors: [{ msg: error.details[0].message }] });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }

        // Create a new user instance
        user = new User({
            name,
            email,
            password
        });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save the user and OTP to the database
        user.otp = otp;
        await user.save();

        // Send OTP email
        sendOtpEmail(user, otp);

        res.json({ msg: 'Registration successful. Please check your email for the OTP.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid email or OTP' }] });
        }

        // Check if OTP matches
        if (user.otp !== otp) {
            return res.status(400).json({ errors: [{ msg: 'Invalid email or OTP' }] });
        }

        // Mark user as verified
        user.verified = true;
        user.otp = undefined; // Clear the OTP
        await user.save();

        res.json({ msg: 'Email verified successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate request body
        const { error } = resetRequestSchema.validate({ email });
        if (error) {
            return res.status(400).json({ errors: [{ msg: error.details[0].message }] });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'User not found' }] });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save the OTP to the database
        user.otp = otp;
        await user.save();

        // Send OTP email
        sendOtpEmail(user, otp);

        res.json({ msg: 'OTP sent to your email' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Validate request body
        const { error } = resetPasswordSchema.validate({ email, otp, newPassword });
        if (error) {
            return res.status(400).json({ errors: [{ msg: error.details[0].message }] });
        }

        // Find user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid email or OTP' }] });
        }

        // Check if OTP matches
        if (user.otp !== otp) {
            return res.status(400).json({ errors: [{ msg: 'Invalid email or OTP' }] });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear the OTP
        user.otp = undefined;
        await user.save();

        res.json({ msg: 'Password reset successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate request body
        const { error } = loginSchema.validate({ email, password });
        if (error) {
            return res.status(400).json({ errors: [{ msg: error.details[0].message }] });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        // Check if user is verified
        if (!user.verified) {
            return res.status(400).json({ errors: [{ msg: 'Please verify your email first' }] });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        // Generate a JWT token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};