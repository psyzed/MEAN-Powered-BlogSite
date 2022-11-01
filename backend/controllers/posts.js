const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  const serverUrl = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: serverUrl + "/images/" + req.file.filename,
    postCreator: req.userData.userId,
  });
  post
    .save()
    .then((createdPost) => {
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
    })
    .catch((error) => {
      res.status(500).json({
        message: "Creating Post Failed!",
      });
    });
};

exports.updatePost = (req, res, next) => {
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
    postCreator: req.userData.userId,
  });
  Post.updateOne({ _id: req.params.id, postCreator: req.userData.userId }, post)
    .then((result) => {
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Update Successful!" });
      } else {
        res.status(401).json({ message: "Not Authorized!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Updating Post Failed!" });
    });
};

exports.getAllPosts = (req, res, next) => {
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
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching Posts Failed!",
      });
    });
};

exports.getPostById = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json({ post: post, message: "Post Found!" });
      } else {
        res.status(404).json({ message: "Post Not Found!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching Post Failed!",
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, postCreator: req.userData.userId })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Post Deleted!" });
      } else {
        res.status(401).json({ message: "Not Authorized!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Deleting Post Failed!",
      });
    });
};
