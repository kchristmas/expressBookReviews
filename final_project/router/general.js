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
  let foundBook = []
  for (let i =0; i < books.length; i++){
    let bookOption = books[i].author.toLowerCase().replace(/\s/g, '');
    if (bookOption === findAuthor){
        foundBook.push(books[i])
    }
}
   if (foundBook.length > 0){
    res.send(foundBook)
   } else {
    res.send("Cannot find any books by that author")
  }
});

//b1. Please note that you can get the correct output using 'Object.keys' as well.  It is just that you need to modify your code accordingly. 

//b2. One such approach is:

///1.  Initialize an empty array

//2. use 'Object.keys()' to retrieve the keys (ie. book ISBNs)

//3. Find the 'author' in the 'books' object matching the 'author' name provided in the HTTP request params using the forEach() iteration method.

//4. Use the push() method to add the details of the book whose 'author' name matches the one given in the request params, and return the array as the output.

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
