import mongoose from 'mongoose';

const sugerenciaSchema = new mongoose.Schema({
  email: { type: String, trim: true },
  mensaje: { type: String, required: true, trim: true },
  estado: { type: String, enum: ['pendiente', 'realizada', 'rechazada'], default: 'pendiente' },
  fecha: { type: Date, default: Date.now }
});

const Sugerencia = mongoose.model('Sugerencia', sugerenciaSchema);
export default Sugerencia;
