import dotenv from 'dotenv';
dotenv.config();  // 🚨 Asegúrate de que sea la primera línea

import app from './app.js';
import indexRoutes from './routes/indexRoutes.js';

const PORT = process.env.PORT || 4000;

app.use('/api', indexRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
