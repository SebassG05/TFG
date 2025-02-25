import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { username, email, password, role, adminPassword } = req.body;

    try {
        if (role === 'admin' && adminPassword !== 'soyadmin') {
            return res.status(400).json({ message: 'Invalid admin password' });
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
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        res.json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
