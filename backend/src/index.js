import dotenv from 'dotenv';
dotenv.config();  // 🚨 Asegúrate de que sea la primera línea

import app from './app.js';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
