import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const register = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email y password son obligatorios.' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo o nombre de usuario ya está en uso.' });
    }

    const user = await User.create({ username, email, password, fullName });
    const token = generateToken(user._id);

    res.status(201).json({ message: 'Usuario registrado exitosamente.', user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Identificador y contraseña requeridos.' });
    }
    
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier },
      ],
    }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const token = generateToken(user._id);
    const userWithoutPassword = user.toJSON();

    res.status(200).json({ message: 'Inicio de sesión exitoso.', user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};