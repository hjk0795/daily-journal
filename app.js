//jshint esversion:6
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const conf = require("dotenv").config();

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let id = process.env.ID;
let password = process.env.PASSWORD;

mongoose.connect(
  `mongodb+srv://${id}:${password}@cluster0.67znfeb.mongodb.net/blogDB`,
  { useNewUrlParser: true }
);

const postsSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Post = mongoose.model("Post", postsSchema);

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    res.render(__dirname + "/views/home.ejs", {
      Content: homeStartingContent,
      post: posts,
    });
  });
});

app.get("/about", function (req, res) {
  res.render(__dirname + "/views/about.ejs", { Content: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render(__dirname + "/views/contact.ejs", { Content: contactContent });
});

app.get("/compose", function (req, res) {
  res.render(__dirname + "/views/compose.ejs", {});
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: _.lowerCase(req.body.postTitle),
    content: req.body.postBody,
  });
  post.save();

  res.redirect("/");
});

app.get("/posts/:anyword", function (req, res) {
  var requestedTitle = req.params.anyword;

  console.log(requestedTitle);
  Post.findOne({title: requestedTitle}, function(err, post) {
   
      console.log("Match!");
      res.render(__dirname + "/views/post.ejs", {
        postTitle: post.title,
        postContent: post.content,
        });
    
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
