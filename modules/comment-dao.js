const SQL = require("sql-template-strings");
const { stringify } = require("uuid");
const dbPromise = require("./database.js");
const userDao = require("./user-dao.js");


async function createComment(comment) {
    
    console.log("I am in commentDAO");
    const db = await dbPromise;
    
    const result = await db.run(SQL`
        INSERT INTO comments (commentDate, commentText, commentLevel, parentComment, authorID, parentArticleID) 
        VALUES(${comment.commentDate}, ${comment.commentText}, ${comment.commentLevel}, ${comment.commentParent}, ${comment.commentAuthorID}, ${comment.commentArticleID})`);
}

async function deleteComment(commentID) {
    const db = await dbPromise;
    const result = await db.run(SQL`
    DELETE FROM comments
    WHERE commentID = ${commentID}`
    );
}



//Export funcitons
module.exports = {
    createComment,
    deleteComment
}