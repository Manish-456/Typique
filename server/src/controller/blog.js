const CustomErrorHandler = require("../helper/customErrorHandler");
const { uploadImage, deleteImage } = require("../helper/uploadImage");
const Blog = require("../model/Blog");
const Notification = require("../model/Notification");

/**
 * @desc  like_unlike  blog Post
 * @route PUT /api/blog/like_dislike
 * @access private => only authorized users can like_unlike the blog post.
 */

async function like_unlike_Post(req, res, next) {
  const { blogId, authorId, title, clientId } = req.body;
  const isLiked = await Blog.findById(blogId);

  if (!isLiked?.likes?.includes(req.id)) {
    await isLiked.updateOne({
      $push: {
        likes: req.id,
      },
    });
    const newNotification = new Notification({
      blogId,
      authorId,
      title,
      isLiked: true,
      clientId,
    });

    await newNotification.save();

    return res
      .status(200)
      .json({ isLiked: true, message: "You like this post" });
  } else if (isLiked?.likes?.includes(req.id)) {
    await isLiked.updateOne({
      $pull: {
        likes: req.id,
      },
    });
    await Notification.findOneAndDelete({ title });
    return res
      .status(200)
      .json({ isLiked: false, message: "You dislike this post" });
  }
}
const BlogController = {
  like_unlike_Post,

  /**
   * @desc Create new Blog
   * @route POST /api/blog
   * @access private
   */
  async createBlog(req, res, next) {
    const { title, desc, category, image, image_key } = req.body;

    if (!title || !desc || !category || !image) {
      return next(
        CustomErrorHandler.AllFieldsRequired("All fields are required")
      );
    }

    try {
      let photoUrl = await uploadImage(image, image_key);

      const newBlog = new Blog({
        userId: req.id,
        ...req.body,
        photoUrl,
      });

      await newBlog.save();
      return res.status(201).json({ message: "✅ New Blog Created" });
    } catch (err) {
      return next(CustomErrorHandler.CustomError(500, "Something went wrong"));
    }
  },

  /**
   * @desc GET all Blogs
   * @route GET /api/blog
   * @access private
   */

  async getAllBlogs(req, res, next) {
    const { size, cat, sort, trending, topStories, blog } = req.query;

    const pipeLine = [
      {
        $sample: { size: parseInt(size) || 100 },
      },
      {
        $match: {
          ...(cat && { category: cat }),
          ...(topStories && {
            $expr: {
              $gt: [
                {
                  $cond: {
                    if: { $isArray: "$view" },
                    then: { $size: "$view" },
                    else: 0,
                  },
                },
                0,
              ],
            },
          }),
          $or: [
            {
              ...(blog && {
                title: {
                  $regex: new RegExp(blog, "i"),
                },
              }),
            },
            {
              ...(blog && {
                desc: {
                  $regex: new RegExp(blog, "i"),
                },
              }),
            },
          ],
          ...(trending && {
            $expr: { $gt: [{ $size: "$likes" }, 0] },
          }),
        },
      },

      ...(sort
        ? [
            {
              $sort: {
                createdAt: -1,
              },
            },
          ]
        : []),
    ];

    const blogs = await Blog.aggregate(pipeLine);

    if (!blogs.length) {
      return res.status(404).json({ message: "No blogs found" });
    }

    return res.status(200).json(blogs);
  },

  /**
   * @desc  Add Views
   * @route  PATCH /api/blog/view/:blogId
   * @access private
   */

  async views(req, res, next) {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);
    if (!blog) return next(CustomErrorHandler.notFound("Blog "));
    if (blog.userId.toString() === req.id) {
      return res.status(204);
    }

    if (blog?.view?.includes(req.id)) {
      return res.status(204);
    }

    await blog.updateOne({
      $push: {
        view: req.id,
      },
    });

    return res.status(200).json("View increased");
  },
  /**
   * @desc  Update existing Blog
   * @route  PUT /api/blog/update
   * @access private
   */

  async updateBlog(req, res, next) {
    const { blogId, title, desc, category, image, image_key } = req.body;
    const blog = await Blog.findById(blogId);

    if (blog?.userId.toString() === req.id) {
      if (image) {
        if (image_key === blog?.image_key) {
          const photoUrl = await uploadImage(image, image_key);
          await Blog.findByIdAndUpdate(
            blogId,
            {
              $set: {
                title,
                desc,
                category,
                image: photoUrl,
              },
            },
            {
              new: true,
            }
          );
        } else {
          return next(
            CustomErrorHandler.CustomError(400, "Can't update image")
          );
        }
      } else {
        await Blog.findByIdAndUpdate(
          blogId,
          {
            $set: {
              title,
              desc,
              category,
            },
          },
          {
            new: true,
          }
        );
      }

      return res.status(200).json({
        message: "Blog updated successfully",
      });
    } else {
      return next(
        CustomErrorHandler.CustomError(400, "You can update only your blog")
      );
    }
  },

  /**
   * @desc delete specific Blog
   * @route DELETE /api/blog/:id
   * @access private
   */
  async getOwnBlog(req, res, next) {
    const { id } = req.params;
    const blog = await Blog.find({ userId: id }).sort({createdAt : -1});
    if (!blog.length) {
      return res.status(200).json({ msg: "Blog not found" });
    }
    return res.status(200).json(blog);
  },
  async deleteBlog(req, res, next) {
    const { id } = req.params;
    if (!id) return next(CustomErrorHandler.CustomError(400, "Bad Request"));
    try {
      const blog = await Blog.findById(id);

      if (blog.userId.toString() === req.id) {
        const notification = await Notification.find({ title: blog?.title });
        Promise.all(
          notification.map(async (notify) => {
            return await Notification.findOneAndDelete({
              title: notify?.title,
            });
          })
        );

        await deleteImage(blog?.image_key);

        await Blog.findByIdAndDelete(id);

        return res.status(200).json({ message: "Blog deleted 💯" });
      } else {
        return res
          .status(400)
          .json({ message: "You can delete your own blog" });
      }
    } catch (error) {
      return res.json({ error: error });
    }
  },
  /**
   * @desc Create Comment
   * @route POST /api/blog/comment/:blogId
   * @access private
   */

  async createComment(req, res, next) {
    const { text, blogId, authorId, title, clientId } = req.body;
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return next(CustomErrorHandler.CustomError("Blog"));
    const newComment = {
      userId: req.id,
      text,
    };

    blog.comment.unshift(newComment);
    const savedBlogComment = await blog.save();
    const comment = savedBlogComment.comment?.filter((c) => c.text === text);

    const newNotification = new Notification({
      blogId,
      authorId,
      title,
      isLiked: false,
      clientId,
      commentId: comment[0]._id,
    });
    let not = await newNotification.save();

    return res.json("Commented successfully");
  },

  /**
   * @desc Edit Comment
   * @route PATCH /api/blog/comment/edit
   * @access private
   */

  async editComment(req, res, next) {
    const blog = await Blog.findById(req.body.blogId);

    const comment = blog.comment.find(
      (c) => c._id.toString() === req.body.commentId
    );
    if (!comment) {
      return next(CustomErrorHandler.notFound("Comment"));
    }
    comment.text = req.body.text;
    await blog.save();
    return res.json({ message: "Comment updated Successfully" });
  },

  /**
   * @desc Delete comment
   * @route DELETE /api/blog/comment/remove
   * @access private
   */

  async deletecomment(req, res, next) {
    const blog = await Blog.findById(req.body.blogId);
    const commentIndex = blog.comment.findIndex(
      (c) => c._id.toString() === req.body.commentId
    );
    await Notification.findOneAndDelete({
      commentId: req.body.commentId,
    });

    if (!commentIndex === -1) {
      return next(CustomErrorHandler.notFound("Comment"));
    }
    blog.comment.splice(commentIndex, 1);

    await blog.save();
    return res.status(200).json({ message: "Comment has been deleted" });
  },
};

module.exports = BlogController;
