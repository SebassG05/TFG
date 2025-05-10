import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const auth = async (req, res, next) => {
    // Para debug: loguear el token recibido y el método
    console.log('Método:', req.method, 'Token recibido:', req.header('authorization'));
    const token = req.header('authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Busca el usuario en la base de datos y asígnalo a req.user
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }
        req.user = user; // Así tendrás req.user._id disponible
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
};

export default auth;
