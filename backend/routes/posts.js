const express = require("express");
const multer = require("multer");

const Post = require("../models/post");
const checkAuthMiddleware = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime Type!");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const extension = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + extension);
  },
});

router.post(
  "",
  checkAuthMiddleware,
  multer({ storage: storageConfig }).single("image"),
  (req, res, next) => {
    const serverUrl = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: serverUrl + "/images/" + req.file.filename,
      postCreator: req.userData.userId,
    });
    post.save().then((createdPost) => {
      res.status(201).json({
        message: "Post Added Successfully",
        post: {
          // ...createdPost,
          // id: createdPost._id
          id: createdPost._id,
          title: createdPost.title,
          content: createdPost.content,
          imagePath: createdPost.imagePath,
        },
      });
    });
  }
);

router.put(
  "/:id",
  checkAuthMiddleware,
  multer({ storage: storageConfig }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const serverUrl = req.protocol + "://" + req.get("host");
      imagePath = serverUrl + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
    });
    Post.updateOne(
      { _id: req.params.id, postCreator: req.userData.userId },
      post
    ).then((result) => {
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Update Successful!" });
      } else {
        res.status(401).json({ message: "Not Authorized!" });
      }
    });
  }
);

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts Fetched succesfully!",
        posts: fetchedPosts,
        maxPosts: count,
      });
    });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json({ post: post, message: "Post Found!" });
    } else {
      res.status(404).json({ message: "Post Not Found!" });
    }
  });
});

router.delete("/:id", checkAuthMiddleware, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, postCreator: req.userData.userId }).then(
    (result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Post Deleted!" });
      } else {
        res.status(401).json({ message: "Not Authorized!" });
      }
    }
  );
});

module.exports = router;
