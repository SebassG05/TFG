import dotenv from 'dotenv';
dotenv.config();  // 🚨 Asegúrate de que sea la primera línea

import app from './app.js';
import sorteosRouter from './routes/sorteos.js';

const PORT = process.env.PORT || 4000;

app.use('/sorteos', sorteosRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
