import Sugerencia from '../models/sugerenciaModel.js';

// Crear sugerencia
export const crearSugerencia = async (req, res) => {
  try {
    const { email, mensaje } = req.body;
    if (!mensaje || mensaje.trim().length < 3) {
      return res.status(400).json({ message: 'La sugerencia es obligatoria y debe ser más larga.' });
    }
    const sugerencia = new Sugerencia({ email, mensaje });
    await sugerencia.save();
    res.status(201).json({ message: 'Sugerencia enviada correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar sugerencia', error: error.message });
  }
};

// Obtener todas las sugerencias (admin)
export const obtenerSugerencias = async (req, res) => {
  try {
    const sugerencias = await Sugerencia.find().sort({ fecha: -1 });
    res.status(200).json(sugerencias);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener sugerencias', error: error.message });
  }
};

// Cambiar estado de sugerencia (realizada/rechazada)
export const actualizarEstadoSugerencia = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    if (!['realizada', 'rechazada'].includes(estado)) {
      return res.status(400).json({ message: 'Estado no válido.' });
    }
    const sugerencia = await Sugerencia.findByIdAndUpdate(id, { estado }, { new: true });
    if (!sugerencia) return res.status(404).json({ message: 'Sugerencia no encontrada.' });
    res.status(200).json(sugerencia);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar sugerencia', error: error.message });
  }
};
