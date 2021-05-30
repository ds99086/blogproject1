const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");
const userDao = require("./user-dao.js");
const commentDao = require("../modules/comment-dao.js");


async function getVotesCount(commentID){
    const db = await dbPromise;
    const upVotes = await db.all(SQL`
        SELECT * FROM votes
        WHERE commentID = ${commentID} AND voteValue = 1;
    `);
    //console.log(upVotes)
    const downVotes = await db.all(SQL`
        SELECT * FROM votes
        WHERE commentID = ${commentID} AND voteValue = -1;
    `);
    //console.log(downVotes)
    const votesCount = {
        upVotesCount: upVotes.length,
        downVotesCount: downVotes.length
    }
    //console.log(votesCount)
    return votesCount;
}

async function getSingleVote(commentID, userID){
    const db = await dbPromise;
    const vote = await db.get(SQL`
    SELECT * FROM votes
    WHERE userID=${userID} AND commentID=${commentID}`
    );
    return vote;
}


async function updateVote(voteObject){
    const db = await dbPromise;
    const result = await db.run(SQL`
    DELETE FROM votes
    WHERE userID = ${voteObject.userID} AND commentID=${voteObject.commentID}
    `);
    await addVote(voteObject);
}


async function addVote(voteObject){
    const db = await dbPromise;
    const result = await db.run(SQL`
        INSERT INTO votes (userID, commentID, voteValue)
        VALUES(${voteObject.userID}, ${voteObject.commentID}, ${voteObject.voteValue})
    `);
}

async function deleteUserAllVotes(userID){
    const db = await dbPromise;
    const result = await db.run(SQL`
    DELETE FROM votes
    WHERE userID = ${userID}`
    );
}


module.exports = {
    getVotesCount,
    addVote,
    deleteUserAllVotes,
    updateVote,
    getSingleVote
}