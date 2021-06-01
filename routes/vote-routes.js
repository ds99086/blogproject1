const express = require("express");
const router = express.Router();
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
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

router.get('/updateVote', async function(req,res) {

    const commentID = req.query.commentID;
    const userID = req.query.userID;
    const voteValue = req.query.voteValue;
    const newVote = {
        userID: userID,
        commentID: commentID,
        voteValue: voteValue
    }

    const currentVote = await voteDao.getSingleVote(commentID, userID);
    
    if(currentVote == undefined){
        await voteDao.addVote(newVote);
        result = {
            response: "new vote added"
        }
        res.json(result);
    } else if (currentVote.voteValue == voteValue){
        await voteDao.delectSingleVote(newVote)
        result = {
            response: "vote deleted"
        }
        res.json(result);
    } else if (currentVote.voteValue != voteValue){
        await voteDao.updateVote(newVote)
        result = {
            response: "vote changed"
        }
        res.json(result);
    }
});


module.exports = router;