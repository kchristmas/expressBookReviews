const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let isAuthenticated = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios")


public_users.post("/register", (req,res) => {
  const username = req.body.username
  const password = req.body.password

  if (username && password) {
    if (!isValid(username)){
        users.push({"username":username, "password":password});
        return res.send("User successfully registered. Please log in.");
    } else {
        return res.send("User already exists.")
    }
  }
  return res.send("Unable to register user. Please provide a valid username and password.")

});

// Get the book list available in the shop
//public_users.get('/books',function (req, res) {
  //let listBooks = JSON.stringify(books)  
  //res.send(listBooks);
//});

//updating to async await
public_users.get('/books', async function (req, res) {
    try{
        const response = await axios.get("https://kirstinchris-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books");
        const bookList = response.data;
        res.send(bookList);
    } catch (error){
        console.error("Error getting books.", error);
        res.send("Error getting books.")
    }
  });



// Get book details based on ISBN
//public_users.get('/isbn/:isbn', function (req, res) {
  //let reference = parseInt(req.params.isbn)
 // res.send(books[reference]);
// });

 //updated using async/await
 public_users.get('isbn/:isbn', async function (req,res) {
    try {
        let response = await axios.get("https://kirstinchris-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books");
        let bookList = response.data;
        let isbn = req.params.isbn;
        if (bookList.hasOwnProperty(isbn)) {
            res.send(bookList[isbn]);
        } else {
            res.send("Book not found.");
        }
    } catch (error) {
        console.log("Can't find that book.", error);
        res.send("Can't find that book.");
    }
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

//updating to async/ await
public_users.get('/author/:author', async function (req, res) {
    let findAuthor = req.params.author.toLowerCase();
    let foundBook = [];
    try{
        let response = await axios.get("https://kirstinchris-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books");
        let books = response.data;
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
    } catch (error){
        console.log("Can't find any books by that author", error);
        res.send("Can't find any books by that author")
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
    //res.send(JSON.stringify(books[reference].title)+ " reviews: " + JSON.stringify(books[reference].reviews));
    res.send(books[reference]["reviews"])
});

module.exports.general = public_users;
