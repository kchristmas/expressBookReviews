const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=> {
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
}}

const authenticatedUser = (username,password)=>{ 
    let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false; // found in practic lab
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  } // checking if the username and password are correct
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  
}});

// Add a book review 
regd_users.put("/auth/review/:isbn", (req, res) => {
  let bookToReview = books[req.params.isbn];
  let bookReview = req.query.review;
  let reviewer = req.session.authorization["username"];
  if (bookToReview){
    if (bookReview){
        bookToReview["reviews"][reviewer] = bookReview;
        bookToReview = bookToReview;
        return res.send("Your review has been added or updated.");
    }
  }
  else {
    return res.send("No book with that ISBN number found.")
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let reviewer = req.session.authorization["username"];
    let userReview = books[isbn]["reviews"];
    if (userReview[reviewer]){
        delete bookToReview["reviews"][reviewer];
        return res.send('Your review has been deleted.');
    }
    else {
      return res.send("You can only delete your own reviews.")
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.isAuthenticated = authenticatedUser;