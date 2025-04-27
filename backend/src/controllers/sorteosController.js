import Sorteo from '../models/Sorteo.js';

export const createSorteo = async (req, res) => {
    try {
        const { title, description, expirationDate } = req.body;
        const providerId = req.user.providerId || req.user._id || req.user.id;

        if (!providerId) {
            return res.status(400).json({ error: 'No providerId found in token' });
        }

        const nuevoSorteo = new Sorteo({
            title,
            description,
            expirationDate,
            providerId
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

        sorteo.participants.push(userId);
        await sorteo.save();

        res.json({ message: 'Inscripción exitosa' });
    } catch (error) {
        res.status(500).json({ error: 'Error al inscribirse', details: error.message });
    }
};
