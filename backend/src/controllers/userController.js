import User from '../models/userModel.js';
import { calculateHoopCoins } from '../utils/hoopCoins.js';

// Otorga HoopCoins al usuario autenticado
export const addHoopCoins = async (req, res) => {
    const userId = req.user._id;
    const { amount } = req.body;
    if (typeof amount !== 'number' || amount < 0) {
        return res.status(400).json({ message: 'Cantidad inválida' });
    }
    const coins = calculateHoopCoins(amount);
    try {
        const user = await User.findByIdAndUpdate(userId, { $inc: { hoopCoins: coins } }, { new: true });
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.status(200).json({ message: 'HoopCoins otorgados', hoopCoins: user.hoopCoins, coinsAdded: coins });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
