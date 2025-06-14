import User from '../models/userModel.js';
import Proveedor from '../models/proveedorModel.js';
import Order from '../models/orderModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../services/emailService.js';

export const register = async (req, res) => {
    const { username, email, password, proveedorData } = req.body;
    try {
        // Si la contraseña es 'soyadmin', el usuario es admin
        let role = 'user';
        if (password === 'soyadmin') {
            role = 'admin';
        }
        // Si hay datos de proveedor, es proveedor (requiere aprobación)
        if (proveedorData) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newProveedor = new Proveedor({
                username,
                email,
                password: hashedPassword
            });
            const savedProveedor = await newProveedor.save();
            return res.status(201).json({ message: 'Proveedor registered successfully, awaiting approval', proveedorId: savedProveedor._id, role: 'proveedor' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role,
            hoopCoins: 150 // Otorga 150 hoopCoins por ser la primera vez
        });
        const savedUser = await newUser.save();
        res.status(201).json({ message: 'User registered successfully', role });
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
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Si la contraseña es 'soyadmin', solo puede acceder el admin
        if (password === 'soyadmin' && user.role !== 'admin') {
            return res.status(400).json({ message: 'No eres administrador' });
        }
        // Si intenta acceder como admin pero la contraseña no es 'soyadmin'
        if (user.role === 'admin' && password !== 'soyadmin') {
            return res.status(400).json({ message: 'Contraseña de administrador incorrecta' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token: token, role: user.role });
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
        const user = await User.findById(userId)
            .select('-password')
            .populate('registeredEvents')
            .populate({ path: 'registeredRaffles', model: 'Sorteo' })
            .populate({ path: 'purchaseHistory', model: 'Order' });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user); // user.hoopCoins estará incluido
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Generar token de recuperación
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hora

        await user.save();

        // Enviar correo con el enlace
        const resetUrl = `${process.env.FRONTEND_URL}/reset/${token}`;
        const html = `
            <h2>Solicitud de Restablecimiento de Contraseña</h2>
            <p>Haz clic en el enlace para restablecer tu contraseña:</p>
            <a href="${resetUrl}" style="color: blue; text-decoration: underline;">Restablecer Contraseña</a>
            <p>Si no solicitaste este cambio, ignora este mensaje.</p>
        `;

        await sendEmail(user.email, 'Recuperación de Contraseña', html);

        res.status(200).json({ message: 'Correo enviado con éxito' });
    } catch (error) {
        res.status(500).json({ message: `Error enviando el correo: ${error.message}` });
    }
};

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    try {
        // Buscar al usuario con el token
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ message: 'Token inválido o expirado' });
        }

        // Validar que ambas contraseñas coincidan
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Las contraseñas no coinciden' });
        }

        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Guardar la nueva contraseña y limpiar el token
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Contraseña restablecida correctamente' });
    } catch (error) {
        res.status(500).json({ message: `Error al restablecer la contraseña: ${error.message}` });
    }
};

// Obtener proveedores pendientes
export const getProveedoresPendientes = async (req, res) => {
    try {
        const proveedores = await Proveedor.find({ status: 'pending' }, '-password');
        res.status(200).json(proveedores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};