import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cryptoRoutes from './routes/crypto.routes.js';
import { verifyToken } from './middlewares/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares Globales
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Ruta de prueba base
app.get('/', (req, res) => {
  res.send('API de Criptomonedas:), use api.coingecko jeje');
});

// Rutas Protegidas
// Aquí aplicamos el middleware 'verifyToken' a todo lo que esté bajo /api
app.use('/api', verifyToken, cryptoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});