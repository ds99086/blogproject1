const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function getVotesCount(commentID){
    const db = await dbPromise;
    try {
        const upVotes = await db.all(SQL`
            SELECT * FROM votes
            WHERE commentID = ${commentID} AND voteValue = 1;
        `);
        const downVotes = await db.all(SQL`
            SELECT * FROM votes
            WHERE commentID = ${commentID} AND voteValue = -1;
        `);
        const votesCount = {
            upVotesCount: upVotes.length,
            downVotesCount: downVotes.length
        }
        return votesCount;
    } catch (e) {
        console.error("Error "+e.name+" in function [getVotesCount] in [vote-dao]"+e.message);
        return null;
    }
}

async function getSingleVote(commentID, userID){
    try {
        const db = await dbPromise;
        const vote = await db.get(SQL`
        SELECT * FROM votes
        WHERE userID=${userID} AND commentID=${commentID}`
        );
        return vote;
    } catch (e) {
        console.error("Error "+e.name+" in function [getSingleVote] in [vote-dao]"+e.message);
        return null;
    }
}

async function updateVote(voteObject){
    try {
        const db = await dbPromise;
        const result = await db.run(SQL`
        DELETE FROM votes
        WHERE userID = ${voteObject.userID} AND commentID=${voteObject.commentID}
        `);
        await addVote(voteObject);
        return result;
    } catch (e) {
        console.error("Error "+e.name+" in function [updateVote] in [vote-dao]"+e.message);
        return false;
    }
}

async function addVote(voteObject){
    try {
        const db = await dbPromise;
        const result = await db.run(SQL`
            INSERT INTO votes (userID, commentID, voteValue)
            VALUES(${voteObject.userID}, ${voteObject.commentID}, ${voteObject.voteValue})
        `);
        return result;
    } catch (e) {
        console.error("Error "+e.name+" in function [addVote] in [vote-dao]"+e.message);
        return false;
    }
}

async function delectSingleVote(voteObject){
    try {
        const db = await dbPromise;
        const result = await db.run(SQL`
            DELETE FROM votes
            WHERE userID = ${voteObject.userID} AND commentID=${voteObject.commentID}
        `)
        return result;
    } catch (e) {
        console.error("Error "+e.name+" in function [delectSingleVote] in [vote-dao]"+e.message);
        return false;
    }
}

async function deleteUserAllVotes(userID){
    const db = await dbPromise;
    try {
        const result = await db.run(SQL`
        DELETE FROM votes
        WHERE userID = ${userID}`
        );
        return result;
    } catch (e) {
        console.error("Error "+e.name+" in function [deleteUserAllVotes] in [vote-dao]"+e.message);
        return false;
    }
}


module.exports = {
    getVotesCount,
    addVote,
    deleteUserAllVotes,
    updateVote,
    getSingleVote,
    delectSingleVote
}