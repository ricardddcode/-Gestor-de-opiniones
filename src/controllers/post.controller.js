import Post from '../models/Post.model.js';
import Comment from '../models/Comment.model.js';

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username fullName')
      .sort({ createdAt: -1 });
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username fullName');
    if (!post) return res.status(404).json({ message: 'Publicación no encontrada.' });

    const comments = await Comment.find({ post: post._id })
      .populate('author', 'username fullName')
      .sort({ createdAt: 1 });

    res.status(200).json({ post, comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, category, content } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({ message: 'Título, categoría y contenido son obligatorios.' });
    }

    const post = await Post.create({ title, category, content, author: req.user._id });
    await post.populate('author', 'username fullName');

    res.status(201).json({ message: 'Publicación creada.', post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Publicación no encontrada.' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para editar esta publicación.' });
    }

    const { title, category, content } = req.body;
    if (title) post.title = title;
    if (category) post.category = category;
    if (content) post.content = content;

    await post.save();
    res.status(200).json({ message: 'Publicación actualizada.', post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Publicación no encontrada.' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta publicación.' });
    }

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    res.status(200).json({ message: 'Publicación y sus comentarios eliminados.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};