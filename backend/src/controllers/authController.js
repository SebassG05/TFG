import User from '../models/userModel.js';
import Proveedor from '../models/proveedorModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../services/emailService.js';

export const register = async (req, res) => {
    const { username, email, password, role, adminPassword } = req.body;

    try {
        if (role === 'admin' && adminPassword !== 'soyadmin') {
            return res.status(400).json({ message: 'Invalid admin password' });
        }

        if (role === 'proveedor') {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newProveedor = new Proveedor({
                username,
                email,
                password: hashedPassword
            });

            const savedProveedor = await newProveedor.save();
            return res.status(201).json({ message: 'Proveedor registered successfully, awaiting approval', proveedorId: savedProveedor._id });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role
        });

        const savedUser = await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const approveProveedor = async (req, res) => {
    const { proveedorId } = req.body;

    try {
        const proveedor = await Proveedor.findById(proveedorId);
        if (!proveedor) {
            return res.status(404).json({ message: 'Proveedor not found' });
        }

        proveedor.status = 'approved';
        await proveedor.save();

        const newUser = new User({
            username: proveedor.username,
            email: proveedor.email,
            password: proveedor.password,
            role: 'proveedor'
        });

        await newUser.save();
        res.status(200).json({ message: 'Proveedor approved and user created successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const rejectProveedor = async (req, res) => {
    const { proveedorId } = req.body;

    try {
        const proveedor = await Proveedor.findById(proveedorId);
        if (!proveedor) {
            return res.status(404).json({ message: 'Proveedor not found' });
        }

        proveedor.status = 'rejected';
        await proveedor.save();
        res.status(200).json({ message: 'Proveedor rejected successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password, adminPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        if (user.role === 'admin' && adminPassword !== 'soyadmin') {
            return res.status(400).json({ message: 'Invalid admin password' });
        }

        // Crear un token JWT
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Guardar el token en una cookie

        res.json({ message: 'Login successful', token: token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logout = (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
};

export const getProfile = async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await User.findById(userId).select('-password').populate('registeredEvents');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        const resetUrl = `http://${req.headers.host}/reset/${token}`;
        const html = `
            <h2>Password Reset Request</h2>
            <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
            <p>Please click on the following link, or paste this into your browser to complete the process:</p>
            <a href="${resetUrl}" style="color: blue; text-decoration: underline;">Reset Password</a>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        `;

        await sendEmail(user.email, 'Password Reset', html);

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ message: `Error sending email: ${error.message}` });
    }
};