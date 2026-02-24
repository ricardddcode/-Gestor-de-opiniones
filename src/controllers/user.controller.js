import User from '../models/User.model.js';

export const getProfile = async (req, res) => {
  res.status(200).json({ user: req.user });
};

export const updateProfile = async (req, res) => {
  try {
    const { username, fullName, email } = req.body;
    const user = req.user;

    if (username && username !== user.username) {
      const exists = await User.findOne({ username });
      if (exists) return res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });
      user.username = username;
    }

    if (email && email !== user.email) {
      const exists = await User.findOne({ email: email.toLowerCase() });
      if (exists) return res.status(400).json({ message: 'El correo ya está en uso.' });
      user.email = email.toLowerCase();
    }

    if (fullName !== undefined) user.fullName = fullName;

    await user.save();
    res.status(200).json({ message: 'Perfil actualizado.', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Se requieren la contraseña actual y la nueva.' });
    }

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'La contraseña actual es incorrecta.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres.' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};