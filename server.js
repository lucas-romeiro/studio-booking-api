import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import app from './src/app.js';
import connectDB from './src/config/db.js';

// Conectar ao MongoDB
connectDB();

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
