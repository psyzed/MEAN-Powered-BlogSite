const express = require("express");

const PostsController = require("../controllers/posts");

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
  PostsController.createPost
);

router.put(
  "/:id",
  checkAuthMiddleware,
  multer({ storage: storageConfig }).single("image"),
  PostsController.updatePost
);

router.get("", PostsController.getAllPosts);

router.get("/:id", PostsController.getPostById);

router.delete("/:id", checkAuthMiddleware, PostsController.deletePost);

module.exports = router;
