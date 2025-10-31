import cloudinary from "../configs/cloudinary.js";
import blog from "../models/blog.js";
import Comment from "../models/comment.js";
import main from "../configs/gemini.js";

export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = JSON.parse(
      req.body.blog
    );
    const imageFile = req.file;

    console.log(title, subTitle, description, category, isPublished, imageFile);

    if (!title || !description || !category || !imageFile) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Fungsi upload stream dengan Promise
    const uploadToCloudinary = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "blogs" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(fileBuffer);
      });
    };

    // Tunggu hasil upload selesai
    const uploadResult = await uploadToCloudinary(imageFile.buffer);

    // Simpan data ke MongoDB
    await blog.create({
      title,
      subTitle,
      description,
      category,
      image: uploadResult.secure_url, // simpan URL-nya
      isPublished,
    });

    // Kirim response ke client
    res.json({
      success: true,
      message: "Blog added successfully",
      image: uploadResult.secure_url,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await blog.find();
    console.log(blogs);

    res.json({ success: true, blogs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;
    const Blog = await blog.findById(blogId);

    if (!Blog) {
      return res
        .status(400)
        .json({ success: false, message: "Blog not found" });
    }

    res.json({ success: true, Blog });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;
    await blog.findByIdAndDelete(id);

    // Delete all comments associatied with the blog
    await Comment.deleteMany({ blog: id });

    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;
    const Blog = await blog.findById(id);

    Blog.isPublished = !Blog.isPublished;
    await Blog.save();

    res.json({ success: true, message: "Blog status updated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { blog, name, content } = req.body;
    await Comment.create({ blog, name, content });

    res.json({ success: true, message: "Comment added for review" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.body;
    const comments = await Comment.find({
      blog: blogId,
      isApproved: true,
    }).sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    const content = await main(
      prompt + " Generate a blog for this topic in simple text format"
    );

    res.json({ success: true, content });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
