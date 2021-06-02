const express = require("express");
const router = express.Router();
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const { verifyAuthenticatedWithAlertOnly } = require("../middleware/auth-middleware.js");
const userDao = require("../modules/user-dao");
const voteDao = require("../modules/vote-dao")



//const testDao = require("../modules/test-dao.js");
const articleDao = require("../modules/article-dao.js");


router.get('/getvotecounts', async function(req,res) {

    const commentID = req.query.commentID;
    //console.log(commentID)
    const voteCountObj = await voteDao.getVotesCount(commentID);
    //console.log(voteCountObj)

    res.json(voteCountObj)   
    
});

router.get('/updateVote', verifyAuthenticatedWithAlertOnly, async function (req, res) {
    const user = res.locals.user;
    
    const commentID = parseInt(req.query.commentID);
    const voteValue = parseInt(req.query.voteValue);
    const userID = user.userID;
    
    const newVote= {
        userID: userID,
        commentID: commentID,
        voteValue: voteValue
    }

    const currentVote = await voteDao.getSingleVote(commentID, userID);
    //check the user is the author or not
    //if not, add the vote to the db
    //if user is the author change the result depends on the clicking
    if (currentVote == undefined) {
        await voteDao.addVote(newVote);
        result = {
            response: "new vote added"
        }
        res.json(result);
    } else if (currentVote.voteValue == voteValue) {
        await voteDao.delectSingleVote(newVote)
        result = {
            response: "vote deleted"
        }
        res.json(result);
    } else if (currentVote.voteValue != voteValue) {
        await voteDao.updateVote(newVote)
        result = {
            response: "vote changed"
        }
        res.json(result);
    }   
});


module.exports = router;