const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const Posts = require("../models/post");
const Comments = require("../models/comment");

router.get('/login', asyncHandler(async(req, res) => {
  const user = {
    username:  req.body.username,
    password : req.body.password,
  }
  
  if(process.env.ADMIN_USERNAME === user.username 
    && process.env.ADMIN_PASSWORD === user.password) 
    jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

}))
// READ
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const posts = await Posts.find();
    if (!posts) {
      res.statusCode = 404;
      res.json({ message: "couldnt find any posts!" });
      return;
    }
    console.log(posts);
    res.json(posts);
  }),
);
// CREATE
router.post(
  "/",
  jwt.verify()
  asyncHandler(async (req, res) => {
    console.log(req.body);
    const post = new Posts({
      title: req.body.title,
      text: req.body.text,
      published: req.body.published,
      timestamp: new Date().toLocaleString(),
    });
    await post.save();
    return res.json(post);
  }),
);

router.get(
  "/comments",
  asyncHandler(async (req, res) => {
    const comments = await Comments.find();
    if (!comments) {
      res.statusCode = 404;
      return res.json({
        message: `Comments not found!`,
      });
    }
    return res.json(comments);
  }),
);

router.get(
  "/comments/:commentId",
  asyncHandler(async (req, res) => {
    const comment = await Comments.findById(req.params.commentId);
    if (!comment) {
      res.statusCode = 404;
      return res.json({
        message: `Comment ${req.params.commentId} not found!`,
      });
    }
    return res.json(comment);
  }),
);

router.post(
  "/:postId/comments",
  asyncHandler(async (req, res) => {
    const post = await Posts.findById(req.params.postId);
    if (!post) {
      res.statusCode = 404;
      return res.json({
        message: `Post ${req.params.postId} not found!`,
      });
    }
    const comment = new Comments({
      email: req.body.email,
      message: req.body.message,
      postId: req.params.postId,
      timestamp: new Date().toLocaleString(),
    });
    await comment.save();
    return res.json(comment);
  }),
);

router.delete(
  "/comments/:commentId",
  asyncHandler(async (req, res) => {
    const comment = await Comments.findById(req.params.commentId);
    if (!comment) {
      res.statusCode = 404;
      return res.json({
        message: `Comment ${req.params.commentId} not found!`,
      });
    }
    await Comments.findByIdAndDelete(req.params.commentId);
    return res.json(comment);
  }),
);
// READ SINGLE POST
router.get(
  "/:postId",
  asyncHandler(async (req, res) => {
    const post = await Posts.findById(req.params.postId);
    if (post === null) {
      res.statusCode = 404;
      return res.json({ message: "post not found" });
    }
    return res.json(post);
  }),
);

// DELETE
router.delete(
  "/:postId",
  asyncHandler(async (req, res) => {
    const post = await Posts.findById(req.params.postId);
    if (post === null) {
      res.statusCode = 404;
      return res.json({ message: "post not found" });
    }
    await Posts.findByIdAndDelete(req.params.postId);
    return res.json(post);
  }),
);

// UPDATE
router.put(
  "/:postId",
  asyncHandler(async (req, res) => {
    const post = await Posts.findById(req.params.postId);
    if (post === null) {
      res.statusCode = 404;
      return res.json({
        message: `Post with id ${req.params.postId} not found!`,
      });
    }
    const updatedPost = new Posts({
      title: req.body.title,
      text: req.body.text,
      published: req.body.published,
      timestamp: new Date().toLocaleString(),
      _id: req.params.postId,
    });
    await Posts.findByIdAndUpdate(req.params.postId, updatedPost, {});
    return res.json(updatedPost);
  }),
);

router.patch(
  "/:postId",
  asyncHandler(async (req, res) => {
    const post = await Posts.findById(req.params.postId);
    if (post === null) {
      res.statusCode = 404;
      return res.json({
        message: `Post with id ${req.params.postId} not found!`,
      });
    }

    const updatedPost = new Posts({
      title: req.body.title,
      text: req.body.text,
      published: req.body.published,
      timestamp: new Date().toLocaleString(),
      _id: req.params.postId,
    });
    console.log(req.body, req.params, post, `updated post ${updatedPost}`);
    await Posts.findByIdAndUpdate(req.params.postId, updatedPost, {});
    return res.json(updatedPost);
  }),
);

router.get(
  "/:postId/comments",
  asyncHandler(async (req, res) => {
    const post = await Posts.findById(req.params.postId);
    if (!post) {
      res.statusCode = 404;
      return res.json({
        message: `Post ${req.params.postId} not found!`,
      });
    }
    const comments = await Comments.find({ postId: req.params.postId });
    if (!comments) {
      res.statusCode = 404;
      return res.json({
        message: `Comments on Post ${req.params.postId} not found!`,
      });
    }
    return res.json(comments);
  }),
);

module.exports = router;
