const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");
const deletedCommentMsg = '[User Have Deleted This Comment]';

async function createComment(comment) {
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
    SET commentText = ${deletedCommentMsg}
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

async function retrieveCommentsbyArticleID(articleId) {
    const db = await dbPromise;

    const commentList = await db.all(SQL`
    SELECT comments.commentID, comments.commentDate, comments.commentLevel, 
    comments.commentText, comments.parentArticleID,
    comments.parentComment, users.userID, users.avatarImage, users.username 
    FROM comments 
    LEFT JOIN users 
    ON comments.authorID = users.userID
    WHERE parentArticleID = ${articleId}`);

    return commentList;
}

async function retrieveCommentbyCommentID(commentID) {
    const db = await dbPromise;
    const singleComment = await db.get(SQL`
    SELECT * from comments
    WHERE commentID = ${commentID}`);

    return singleComment;
}

async function retrieveCommentbyParentCommentID(commentParentID) {
    const db = await dbPromise;
    const parentComment = await db.all(SQL`
    SELECT * from comments
    WHERE commentID = ${commentParentID}
    `);

    return parentComment;
}

async function updateCommentsAfterUserAccountDelete(userID) {
    const db = await dbPromise;

    const result = await db.run(SQL`
        UPDATE comments
        SET commentText=${deletedCommentMsg}
        WHERE authorID=${userID}
    `);
}


module.exports = {
    createComment,
    deleteComment,
    retrieveCommentsbyArticleID,
    retrieveCommentbyParentCommentID,
    deleteCommentByUser,
    updateCommentsAfterUserAccountDelete,
    retrieveCommentbyCommentID
}