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

// Add a book review -- needs to BE UPDATED!! NOT WORKIING ON POSTMAN
regd_users.put("/auth/review/:isbn", (req, res) => {
  let bookToReview = books[parseInt(req.params.isbn)];
  let bookReview = req.query.review;
  let reviewer = req.session.authorization["username"];
  if(!authenticatedUser(reviewer)){
    return res.send("You can't leave a review.")
  }
  if (!isbn){
    return res.send("IBSN required to leave a review.")
  }
  for (key in bookToReview.reviews){
    if (key.username === reviewer){
        bookToReview.reviews.reviewer.review = bookReview;
        return res.send("Your review has been updated for" + bookToReview)
    }
  }
  bookToReview.reviews.push({"username": reviewer, "review": bookReview});
  return res.send("Your review has been added for " + bookToReview)
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
