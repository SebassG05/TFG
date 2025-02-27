import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const isProveedor = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.role !== 'proveedor') {
            return res.status(403).json({ message: 'Access denied. You are not a proveedor.' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

export default isProveedor;
