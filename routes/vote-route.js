const express = require("express");
const router = express.Router();
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const userDao = require("../modules/user-dao");


//const testDao = require("../modules/test-dao.js");
const articleDao = require("../modules/article-dao.js");


router.get('/getvotecounts', async function(req,res) {

    const commentID = req.query.commentID;
    const voteCountObj = await getVotesCount(commentID);

    return voteCountObj;
});