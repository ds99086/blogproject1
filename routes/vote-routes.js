const express = require("express");
const router = express.Router();
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const userDao = require("../modules/user-dao");
const voteDao = require("../modules/vote-dao")


//const testDao = require("../modules/test-dao.js");
const articleDao = require("../modules/article-dao.js");


router.get('/getvotecounts', async function(req,res) {

    const commentID = req.query.commentID;
    const voteCountObj = await voteDao.getVotesCount(commentID);

    return voteCountObj;
});

router.get('/updateVote', async function(req,res) {

    const commentID = req.query.commentID;
    const userID = req.query.userID;
    const voteValue = req.query.voteValue;
    const newVote = {
        userID: userID,
        commentID: commentID,
        voteValue: voteValue
    }

    const vote = await voteDao.getSingleVote(commentID, userID);
    
    if(vote == undefined){
        await voteDao.addVote(newVote);
        return "new vote added";
    } else if (vote.voteValue == voteValue){
        return "already voted";
    } else if (vote.voteValue != voteValue){
        await voteDao.updateVote(newVote)
        return "vote changed"
    }
});


module.exports = router;