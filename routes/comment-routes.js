const express = require("express");
const router = express.Router();

// The DAO that handles CRUD operations for users.
const userDao = require("../modules/user-dao.js");
const commentDao = require("../modules/comment-dao.js");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const { createComment } = require("../modules/comment-dao.js");

// const io = require('socket.io')();
// io.on('connection', client => { ... });
// io.listen(3000);


router.get("/single-article", async function(req,res) {

    //removes a known item from an array
    function removeItemOnce(arr, value) {
        var index = arr.indexOf(value);
        if (index > -1) {
          arr.splice(index, 1);
        }
        return arr;
    }

    //Article number is hard coded to 1. 
    // const articleID = req.query.articleID;
    const articleID = 1;

    const commentList = await userDao.retrieveCommentsbyArticleID(articleID);

    let output = [];
    function addChildren(parentC, commentList) {
        for (let j = 0; j < commentList.length; j++) {
            let anotherC = commentList[j];
            if (anotherC.parentComment === parentC.commentID) {
                if (!Array.isArray(parentC.children)) {
                    parentC.children = [];  
                } 
                parentC.children.push(anotherC);
                removeItemOnce(commentList, anotherC);
                j--;
                addChildren(anotherC, commentList);
            }
        }
    }

    for (let i = 0; i < commentList.length; i++) {
        let comment = commentList[i];
        if (comment.commentLevel == 0 ) {
        output.push(comment);
        removeItemOnce(commentList, comment);
        i--;
        addChildren(comment, commentList, output);
    }}
    
    res.locals.commentlist = output;
    res.render("single-article");
})

//Hardcode user details
router.post("/newComment", async function(req,res) {

    const comment = {
        commentDate: '2020-02-01',
        commentText: req.body.commentText,
        commentLevel: 0,
        commentParent: 0,
        commentAuthorID: 1,
        commentArticleID: 1
    }

    console.log("making comment");
    console.log(comment);

    await commentDao.createComment(comment);

    res.redirect("/single-article");
})


//Hardcode comment details
//must check if user authToken matches to be able to delete. 
router.post("/deleteComment", async function(req,res) {

    const commentID = 1;
    console.log("deleting comment");
    await commentDao.deleteComment(commentID);

    res.redirect("/single-article");
})


module.exports = router;