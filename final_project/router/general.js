const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/books',function (req, res) {
  let listBooks = JSON.stringify(books)  
  res.send(listBooks);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let reference = parseInt(req.params.isbn)
  res.send(books[reference]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let findAuthor = req.params.author.toLowerCase();
  let foundBook = [];
  for (key in books){
    let bookOption = books[key].author.toLowerCase().replace(/\s/g, '');
    if (bookOption === findAuthor){
        foundBook.push(books[key])
    }
   }
   if (foundBook.length > 0){
    res.send(foundBook)
   } else {
    res.send("Cannot find any books by that author")
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let findBook = req.params.title.toLowerCase();
    let foundBook = [];
    for (key in books){
      let bookOption = books[key].title.toLowerCase().replace(/\s/g, '');
      if (bookOption === findBook){
          foundBook.push(books[key])
      }
     }
     if (foundBook.length > 0){
      res.send(foundBook)
     } else {
      res.send("Cannot find any books with that title.")
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let reference = parseInt(req.params.isbn)
    //res.send(JSON.stringify(books[reference].title)+ " " + JSON.stringify(books[reference].reviews));
    res.send(books[reference].reviews)
});

module.exports.general = public_users;
