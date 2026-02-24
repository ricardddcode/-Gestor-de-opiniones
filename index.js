import 'dotenv/config';
import mongoose from 'mongoose';
import app from './configs/app.js';

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gestor-opiniones';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(' Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(' Error al conectar a MongoDB:', err.message);
    process.exit(1);
  });