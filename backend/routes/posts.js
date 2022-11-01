const express = require("express");

const PostsController = require("../controllers/posts");

const checkAuthMiddleware = require("../middleware/check-auth");
const multerConfig = require("../middleware/multer-config");

const router = express.Router();

router.post("", checkAuthMiddleware, multerConfig, PostsController.createPost);

router.put(
  "/:id",
  checkAuthMiddleware,
  multerConfig,
  PostsController.updatePost
);

router.get("", PostsController.getAllPosts);

router.get("/:id", PostsController.getPostById);

router.delete("/:id", checkAuthMiddleware, PostsController.deletePost);

module.exports = router;
