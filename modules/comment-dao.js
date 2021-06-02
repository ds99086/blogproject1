const SQL = require("sql-template-strings");
const { stringify } = require("uuid");
const dbPromise = require("./database.js");
const userDao = require("./user-dao.js");


async function createComment(comment) {
    
    console.log("I am in commentDAO");
    const db = await dbPromise;
    
    const result = await db.run(SQL`
        INSERT INTO comments (commentText, commentLevel, parentComment, authorID, parentArticleID) 
        VALUES(            
            ${comment.commentText}, 
            ${comment.commentLevel}, 
            ${comment.commentParent}, 
            ${comment.commentAuthorID}, 
            ${comment.commentArticleID})`);
    
    return result.lastID;
}

async function deleteCommentByUser(commentID) {
    const db = await dbPromise;
    const result = await db.run(SQL`
    UPDATE comments
    SET commentText = '[User Have Deleted This Comment]'
    WHERE commentID = ${commentID}`
    );
}

async function deleteComment(commentID) {
    const db = await dbPromise;
    const result = await db.run(SQL`
    DELETE FROM comments
    WHERE commentID = ${commentID}`
    );
}

//has commentID, commentDate, commentLevel, commentText, 
//parentArticleID, parentComment, userID, avatarImage
//consider having authorID and authToken separate. 
async function retrieveCommentsbyArticleID(articleId) {
    const db = await dbPromise;

    const commentList = await db.all(SQL`
    select comments.commentID, comments.commentDate, comments.commentLevel, 
    comments.commentText, comments.parentArticleID,
    comments.parentComment, users.userID, users.avatarImage, users.username 
    from comments LEFT JOIN users 
    ON comments.authorID = users.userID
    where parentArticleID = ${articleId}`);

    console.log(commentList.userID);

    return commentList;
}

async function retrieveCommentbyCommentID(commentID) {
    const db = await dbPromise;

    const singleComment = await db.get(SQL`
    select * from comments
    where commentID = ${commentID}`);


    return singleComment;
}

async function retrieveCommentbyParentCommentID(commentParentID) {
    const db = await dbPromise;

    const parentComment = await db.all(SQL`
    select * from comments
    where commentID = ${commentParentID}
    `);

    return parentComment;
}

async function updateCommentsAfterUserAccountDelect(userID){
    const db = await dbPromise;

    const result = await db.run(SQL`
        UPDATE comments
        SET commentText='This comment has been deleted!'
        WHERE authorID=${userID}
    `)
}


//Export funcitons
module.exports = {
    createComment,
    deleteComment,
    retrieveCommentsbyArticleID,
    retrieveCommentbyParentCommentID,
    deleteCommentByUser,
    updateCommentsAfterUserAccountDelect,
    retrieveCommentbyCommentID
}