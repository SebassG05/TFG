import User from '../models/userModel.js';
import Proveedor from '../models/proveedorModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};