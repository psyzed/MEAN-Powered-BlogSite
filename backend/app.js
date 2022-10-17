const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: "Post Added Successfully",
  });
});

app.get("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "refvcecec",
      title: "First server-side post!",
      content: "my first RESTfull api",
    },
    {
      id: "htyhrthrt",
      title: "Second server-side post!",
      content: "my first RESTfull api!",
    },
  ];
  res.status(200).json({
    message: "Post Fetched succesfully!",
    posts: posts,
  });
});

module.exports = app;
