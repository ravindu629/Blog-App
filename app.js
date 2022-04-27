//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

//require mongoose
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//make a connection to our mongoDB server and look for blogDB
//if blogDB does not exist then it will create brand new database call blogDB
mongoose.connect(
  "mongodb+srv://admin-ravindu:IT19208022@cluster0.n8e35.mongodb.net/blogDB?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

//create new Schema
const blogSchema = {
  title: String,
  content: String,
};

//create new model
const Blog = mongoose.model("Blog", blogSchema);

const homeStartingContent =
  "Make blogging beautiful with a personalized template and free custom domain. Powering Over 2 Million Websites Worldwide. #1 In Speed and Security. Get Started. Variety Of Top Options. Money Back Guarantee. 1-Click WordPress Install. Enhanced cPanel.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

app.get("/", function (req, res) {
  Blog.find({}, function (err, foundList) {
    if (!err) {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: foundList,
      });
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const postTitle = _.upperCase(req.body.postTitle);
  const postBody = req.body.postBody;

  //create new blog ducument
  const blog = new Blog({
    title: postTitle,
    content: postBody,
  });

  blog.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function (req, res) {
  const requestedPost = req.params.postId;

  Blog.findOne({ _id: requestedPost }, function (err, foundPost) {
    if (!err) {
      if (!foundPost) {
        console.log("not found");
      } else {
        res.render("post", {
          title: foundPost.title,
          content: foundPost.content,
        });
      }
    } else {
      console.log(err);
    }
  });
});

//heroku port
let port = process.env.PORT;

//if heroku have not set the port(port is null or empty string) then we going to use our local one
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server has started successfully");
});
