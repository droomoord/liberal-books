const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const sanitizer = require("express-sanitizer");
const Book = require("./models/bookSchema");

//DEPENDECIES
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sanitizer());
app.use(methodOverride("_method"));

app.use((req, res, next) => {
  res.locals.update = false;
  res.locals.deleted = false;
  next();
});

// MONGOOSE CONFIG
mongoose.connect(
  "mongodb+srv://liberal-user:liberal-user@cluster0-evl59.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

//ROOT ROUTE
app.get("/", (req, res) => {
  res.redirect("/books");
});

//INDEX ROUTE
app.get("/books", (req, res) => {
  Book.find({}, (err, allBooks) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { allBooks });
    }
  });
});

//NEW
app.get("/books/new", (req, res) => {
  res.render("new");
});

//CREATE
app.post("/books", (req, res) => {
  let book = req.body.book;
  book.postDate = Date.now();
  book.summary = req.sanitize(book.summary); //filtering out potential harmful scripting inside summary
  book.title = book.title.charAt(0).toUpperCase() + book.title.slice(1); //Capitalizes the first letter of the title before it goes into the database
  Book.create(book, (err) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect("/books");
    }
  });
});

//SHOW BOOK
app.get("/books/:id", (req, res) => {
  Book.findById(req.params.id, (err, book) => {
    if (err) {
      res.send(err);
    } else {
      res.render("show", { book });
    }
  });
});

//SHOW AUTHOR
app.get("/author/:id", (req, res) => {
  Book.find({ author: req.params.id }, function (err, allBooks) {
    if (err) {
      res.send(err);
    } else {
      res.render("index", { allBooks });
    }
  });
});

//EDIT
app.get("/books/:id/edit", (req, res) => {
  Book.findById(req.params.id, (err, book) => {
    if (err) {
      res.send(err);
    } else {
      res.render("edit", { book });
    }
  });
});

// UPDATE
app.put("/books/:id", (req, res) => {
  let book = req.body.book;
  book.summary = req.sanitize(book.summary); //filtering out potential harmful scripting inside summary
  book.updateDate = new Date(Date.now());

  Book.findByIdAndUpdate(req.params.id, book, (err) => {
    if (err) {
      res.send(err);
    } else {
      res.render("show", { book, update: true });
    }
  });
});

//DELETE
app.delete("/books/:id", function (req, res) {
  Book.findByIdAndDelete(req.params.id, function (err, deletedBook) {
    if (err) {
      res.send(err);
    } else {
      Book.find({}, function (err, allBooks) {
        if (err) {
          res.send(err);
        } else {
          res.render("index", { allBooks: allBooks, deleted: true });
        }
      });
    }
  });
});

//SEARCH
app.get("/search", function (req, res) {
  if (req.query.search === "") {
    res.redirect("/books");
  } else {
    Book.find({ title: req.query.search }, function (err, foundBooks) {
      if (err) {
        res.send(err);
      } else {
        res.render("index", { allBooks: foundBooks, deleted: false });
      }
    });
  }
});

app.listen(3000, function () {
  console.log("server working");
});
