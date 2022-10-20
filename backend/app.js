const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");

const app = express();

mongoose
  .connect(
    "mongodb+srv://psyzed:dcsa-10c@meanpowerdblogsite.ou1ixex.mongodb.net/MeanPoweredBlogSite?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(() => {
    console.log("Connection Failed!");
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);

module.exports = app;
