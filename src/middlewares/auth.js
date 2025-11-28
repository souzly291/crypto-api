import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // Esperamos formato: "Bearer moneda_segura_2025"
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ error: "Acceso denegado. Falta el token." });
  }

  if (token === process.env.API_SECRET_TOKEN) {
    next(); // Token correcto, pasa al controlador
  } else {
    return res.status(403).json({ error: "Token inválido." });
  }
};
