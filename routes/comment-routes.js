const { Router } = require("express");
const router = Router();

const userDao = require("../modules/user-dao.js");
const commentDao = require("../modules/comment-dao.js");
const { verifyAuthenticatedWithAlertOnly } = require("../middleware/auth-middleware.js");

router.get("/newComment", verifyAuthenticatedWithAlertOnly, async function(req,res) {
    
    const commentContent = req.query.commentContent;
    const articleID = req.query.articleID;
    const commentAuthor = res.locals.user;

    const authorID = commentAuthor.userID;
    const avatarImage = commentAuthor.avatarImage;
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

    const commentID = await commentDao.createComment(comment);
    const commentMade = await commentDao.retrieveCommentbyCommentID(commentID);
    const commentDate = commentMade.commentDate
    comment.commentID = commentID;
    comment.commentDate = commentDate;

    res.json(comment);
})

router.get("/deleteComment", verifyAuthenticatedWithAlertOnly, async function(req,res) {
    const commentID = req.query.commentID;
    await commentDao.deleteCommentByUser(commentID);
    res.json();
})

router.get("/checkAuthor", verifyAuthenticatedWithAlertOnly, async function(req,res) {
    const user = res.locals.user;
    const commentID = req.query.commentID;
    const userID = user.userID;

    const commentDetail = await commentDao.retrieveCommentbyCommentID(commentID);
    const commentAuthor = commentDetail.authorID;

    if (userID == commentAuthor) {
        result = {
            response: "Comment deleted"
        }
    } else if (userID != commentAuthor) {
        result = {
            response: "Warning"
        }
    }
    res.json(result);
})

router.get("/replyComment", verifyAuthenticatedWithAlertOnly, async function(req,res) {
    const commentParentID = req.query.parentCommentID;
    const replyContent = req.query.replyContent;
    const articleID = req.query.articleID;
    const authToken = req.cookies.authToken;    

    const commentAuthor = await userDao.retrieveUserWithAuthToken(authToken);

    const authorID = commentAuthor.userID;
    const username = commentAuthor.username;
    const avatarImage = commentAuthor.avatarImage;

    //console.log("parent commentID is: " + commentParentID);
    const parentComment = await commentDao.retrieveCommentbyParentCommentID(commentParentID);
    console.log("parent comment is:");

    console.log(parentComment);
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