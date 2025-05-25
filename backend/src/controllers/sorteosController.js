import Sorteo from '../models/Sorteo.js';
import User from '../models/userModel.js';

export const createSorteo = async (req, res) => {
    try {
        const { title, description, expirationDate, hoopCoinsCost } = req.body;
        const providerId = req.user.providerId || req.user._id || req.user.id;

        if (!providerId) {
            return res.status(400).json({ error: 'No providerId found in token' });
        }

        // Obtener la URL de la imagen subida a Cloudinary
        let imageUrl = undefined;
        if (req.file && req.file.path) {
            imageUrl = req.file.path;
        }

        const nuevoSorteo = new Sorteo({
            title,
            description,
            expirationDate,
            providerId,
            hoopCoinsCost: hoopCoinsCost || 0,
            imageUrl // Guardar la URL de la imagen
        });

        await nuevoSorteo.save();
        res.status(201).json({ message: 'Sorteo creado', sorteo: nuevoSorteo });
    } catch (error) {
        console.error('Error al crear el sorteo:', error);
        res.status(500).json({ error: 'Error al crear el sorteo', details: error.message });
    }
};

export const authorizeSorteo = async (req, res) => {
    try {
        const { id } = req.params;
        const sorteo = await Sorteo.findByIdAndUpdate(
            id,
            { isAuthorized: true },
            { new: true }
        );
        if (!sorteo) {
            return res.status(404).json({ error: 'Sorteo no encontrado' });
        }
        res.json({ message: `Sorteo con ID ${id} autorizado`, sorteo });
    } catch (error) {
        res.status(500).json({ error: 'Error al autorizar el sorteo', details: error.message });
    }
};

export const inscribirUsuario = async (req, res) => {
    try {
        const { id } = req.params; // id del sorteo
        const userId = req.user._id || req.user.id || req.user.providerId;

        const sorteo = await Sorteo.findById(id);
        if (!sorteo) {
            return res.status(404).json({ error: 'Sorteo no encontrado' });
        }

        // Validar fecha de expiración
        if (new Date() > sorteo.expirationDate) {
            return res.status(400).json({ error: 'El sorteo ha expirado' });
        }

        // Validar inscripción única
        if (sorteo.participants.includes(userId)) {
            return res.status(400).json({ error: 'Ya estás inscrito en este sorteo' });
        }

        // Validar HoopCoins
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        if ((user.hoopCoins || 0) < (sorteo.hoopCoinsCost || 0)) {
            return res.status(400).json({ error: 'No tienes suficientes HoopCoins para inscribirte' });
        }

        // Descontar HoopCoins y guardar inscripción
        user.hoopCoins -= sorteo.hoopCoinsCost || 0;
        // Añadir sorteo a registeredRaffles si no está
        if (!user.registeredRaffles) user.registeredRaffles = [];
        if (!user.registeredRaffles.includes(sorteo._id)) {
            user.registeredRaffles.push(sorteo._id);
        }
        await user.save();

        sorteo.participants.push(userId);
        await sorteo.save();

        res.json({ message: 'Inscripción exitosa', hoopCoinsRestantes: user.hoopCoins });
    } catch (error) {
        res.status(500).json({ error: 'Error al inscribirse', details: error.message });
    }
};

// Nuevo controlador para que el proveedor vea los inscritos
export const getSorteoParticipants = async (req, res) => {
    try {
        const { id } = req.params;
        const sorteo = await Sorteo.findById(id).populate('participants', 'username email hoopCoins');
        if (!sorteo) {
            return res.status(404).json({ error: 'Sorteo no encontrado' });
        }
        if (!sorteo.providerId) {
            return res.status(400).json({ error: 'El sorteo no tiene proveedor asignado' });
        }
        // LOG para depuración
        console.log('providerId sorteo:', sorteo.providerId.toString());
        console.log('req.user._id:', req.user._id?.toString());
        if (sorteo.providerId.toString() !== req.user._id?.toString()) {
            return res.status(403).json({ error: 'No autorizado' });
        }
        res.json({ participants: sorteo.participants });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener participantes', details: error.message });
    }
};

// Obtener sorteos del proveedor autenticado
export const getMySorteos = async (req, res) => {
    try {
        const sorteos = await Sorteo.find({ providerId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(sorteos);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// PUT /api/sorteos/:id (actualizar sorteo)
export const updateSorteo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, expirationDate, hoopCoinsCost } = req.body;
        const sorteo = await Sorteo.findById(id);
        if (!sorteo) {
            return res.status(404).json({ error: 'Sorteo no encontrado' });
        }
        // Solo el proveedor dueño puede editar
        if (sorteo.providerId.toString() !== req.user._id?.toString()) {
            return res.status(403).json({ error: 'No autorizado' });
        }
        if (title !== undefined) sorteo.title = title;
        if (expirationDate !== undefined) sorteo.expirationDate = expirationDate;
        if (hoopCoinsCost !== undefined) sorteo.hoopCoinsCost = hoopCoinsCost;
        await sorteo.save();
        res.json({ message: 'Sorteo actualizado', sorteo });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar sorteo', details: error.message });
    }
};

// Obtener todos los sorteos (admin)
export const getAllSorteos = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Solo el admin puede ver todos los sorteos' });
        }
        const sorteos = await Sorteo.find({}).populate('providerId', 'username email empresa');
        res.status(200).json(sorteos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los sorteos', details: error.message });
    }
};

// Eliminar sorteo (solo admin o proveedor dueño)
export const deleteSorteo = async (req, res) => {
    try {
        const { id } = req.params;
        const sorteo = await Sorteo.findById(id);
        if (!sorteo) {
            return res.status(404).json({ error: 'Sorteo no encontrado' });
        }
        // Permitir solo admin o proveedor dueño
        if (req.user.role !== 'admin' && !(req.user.role === 'proveedor' && sorteo.providerId.toString() === req.user._id.toString())) {
            return res.status(403).json({ error: 'No autorizado para eliminar este sorteo' });
        }
        await Sorteo.findByIdAndDelete(id);
        res.status(200).json({ message: 'Sorteo eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el sorteo', details: error.message });
    }
};
