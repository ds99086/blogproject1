const express = require("express");
const router = express.Router();

// The DAO that handles CRUD operations for users.
const userDao = require("../modules/user-dao.js");
const commentDao = require("../modules/comment-dao.js");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const { verifyAuthenticatedWithAlertOnly } = require("../middleware/auth-middleware.js");
const { createComment } = require("../modules/comment-dao.js");

// const io = require('socket.io')();
// io.on('connection', client => { ... });
// io.listen(3000);



//Hardcode user details
router.get("/newComment", verifyAuthenticatedWithAlertOnly, async function(req,res) {
    
    const commentContent = req.query.commentContent;
    const articleID = req.query.articleID;
    const authToken = req.cookies.authToken; 
    const commentAuthor = await userDao.retrieveUserWithAuthToken(authToken);

    const authorID = commentAuthor.userID;
    const avatarImage = commentAuthor.avatarImage;
    console.log("Made new comment");
    console.log(commentAuthor);
    const username = commentAuthor.username;

    const comment = {
        commentDate: '2020-02-01',
        commentText: commentContent,
        commentLevel: 0,
        commentParent: 0,
        commentAuthorID: authorID,
        commentArticleID: articleID,
        avatarImage: avatarImage,
        username: username
    }

    console.log("making comment");
    console.log(comment);

    const commentID = await commentDao.createComment(comment);
    const commentMade = await commentDao.retrieveCommentbyCommentID(commentID);
    const commentDate = commentMade.commentDate
    comment.commentID = commentID;
    comment.commentDate = commentDate;

    //console.log(comment);

    res.json(comment);
})


//Hardcode comment details
//must check if user authToken matches to be able to delete. 
router.get("/deleteComment", async function(req,res) {
    const commentID = req.query.commentID;
    console.log("deleting comment");
    await commentDao.deleteCommentByUser(commentID);
    res.json()
    //res.redirect("/single-article");
})

router.get("/replyComment", verifyAuthenticatedWithAlertOnly, async function(req,res) {
    const commentParentID = req.query.parentCommentID;
    const replyContent = req.query.replyContent;
    const articleID = req.query.articleID;
    const authToken = req.cookies.authToken;    

    const commentAuthor = await userDao.retrieveUserWithAuthToken(authToken);
    //console.log(commentAuthor);
    const authorID = commentAuthor.userID;
    const username = commentAuthor.username;
    const avatarImage = commentAuthor.avatarImage;

    //console.log("parent commentID is: " + commentParentID);
    const parentComment = await commentDao.retrieveCommentbyParentCommentID(commentParentID);
    //console.log("parent comment is:");

    //console.log(parentComment);
    const parentCommentLevel = parentComment[0].commentLevel;
    //console.log(parentCommentLevel);
    const commentLevel = (parentCommentLevel + 1) ;
    //console.log(commentLevel);

    const reply = {
        commentText: replyContent, 
        commentLevel: commentLevel, 
        commentParent: commentParentID, 
        commentAuthorID: authorID, 
        commentArticleID: articleID,
        username: username,
        avatarImage: avatarImage
    };
    
    //console.log(reply);
    const replyID = await commentDao.createComment(reply);
    const commentMade = await commentDao.retrieveCommentbyCommentID(replyID);
    const commentDate = commentMade.commentDate

    //console.log(replyID);
    reply.commentID = replyID;
    reply.commentDate = commentDate;
    //console.log(reply);

    res.json(reply);
});

module.exports = router;