import Comment from '../models/Comment.model.js';
import Post from '../models/Post.model.js';

export const createComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Publicación no encontrada.' });

    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'El contenido del comentario es obligatorio.' });

    const comment = await Comment.create({ content, author: req.user._id, post: post._id });
    await comment.populate('author', 'username fullName');

    res.status(201).json({ message: 'Comentario creado.', comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comentario no encontrado.' });

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para editar este comentario.' });
    }

    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'El contenido es obligatorio.' });

    comment.content = content;
    await comment.save();

    res.status(200).json({ message: 'Comentario actualizado.', comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comentario no encontrado.' });

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este comentario.' });
    }

    await comment.deleteOne();
    res.status(200).json({ message: 'Comentario eliminado.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};