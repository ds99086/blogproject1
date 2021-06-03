const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");
const deletedCommentMsg = '[User Have Deleted This Comment]';

async function createComment(comment) {
    const db = await dbPromise;
    try {
        const result = await db.run(SQL`
            INSERT INTO comments (commentText, commentLevel, parentComment, authorID, parentArticleID) 
            VALUES(            
                ${comment.commentText}, 
                ${comment.commentLevel}, 
                ${comment.commentParent}, 
                ${comment.commentAuthorID}, 
                ${comment.commentArticleID})`);

        return result.lastID;
    } catch (e) {
        console.error("Error "+e.name+" in function [createComment] in [comment-dao]"+e.message);
        return false;
    }
}

async function deleteCommentByUser(commentID) {
    const db = await dbPromise;
    try {
        const result = await db.run(SQL`
        UPDATE comments
        SET commentText = ${deletedCommentMsg}
        WHERE commentID = ${commentID}`
        );
        return result;
    } catch (e) {
        console.error("Error "+e.name+" in function [deleteCommentByUser] in [comment-dao]"+e.message);
        return false;
    }
}

async function deleteComment(commentID) {
    try {
        const db = await dbPromise;
        const result = await db.run(SQL`
        DELETE FROM comments
        WHERE commentID = ${commentID}`
        );
    } catch (e) {
        console.error("Error "+e.name+" in function [deleteComment] in [comment-dao]"+e.message);
        return false;
    }

}

async function retrieveCommentsbyArticleID(articleId) {
    const db = await dbPromise;
    try {
        const commentList = await db.all(SQL`
        SELECT comments.commentID, comments.commentDate, comments.commentLevel, 
        comments.commentText, comments.parentArticleID,
        comments.parentComment, users.userID, users.avatarImage, users.username 
        FROM comments 
        LEFT JOIN users 
        ON comments.authorID = users.userID
        WHERE parentArticleID = ${articleId}`);

        return commentList;
    } catch (e) {
        console.error("Error "+e.name+" in function [retrieveCommentsbyArticleID] in [comment-dao]"+e.message);
        return null;
    }
}

async function retrieveCommentbyCommentID(commentID) {
    try {
        const db = await dbPromise;
        const singleComment = await db.get(SQL`
        SELECT * from comments
        WHERE commentID = ${commentID}`);

        return singleComment;
    } catch (e) {
        console.error("Error "+e.name+" in function [retrieveCommentbyCommentID] in [comment-dao]"+e.message);
        return null;
    }
}

async function retrieveCommentbyParentCommentID(commentParentID) {
    const db = await dbPromise;
    try {
        const parentComment = await db.all(SQL`
        SELECT * from comments
        WHERE commentID = ${commentParentID}
        `);

        return parentComment;
    } catch (e) {
        console.error("Error "+e.name+" in function [retrieveCommentbyParentCommentID] in [comment-dao]"+e.message);
        return null;
    }
}

async function updateCommentsAfterUserAccountDelete(userID) {
    const db = await dbPromise;
    try {
        const result = await db.run(SQL`
            UPDATE comments
            SET commentText=${deletedCommentMsg}
            WHERE authorID=${userID}
        `);
        return result;
    } catch (e) {
        console.error("Error "+e.name+" in function [updateCommentsAfterUserAccountDelete] in [comment-dao]"+e.message);
        return false;
    }
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