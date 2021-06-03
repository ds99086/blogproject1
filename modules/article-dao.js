const e = require("express");
const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");
const userDao = require("./user-dao.js");


async function readArticlebyID(articleID) {

    const db = await dbPromise;
    while (articleID < 1) {
        articleID++
    }    
    try {
        const article = await db.get(SQL`
    SELECT articleID, title, publishDate, authorID, bodyContentOrLinkToContent 
    FROM ARTICLES 
    WHERE articleID = ${articleID}`)
    const articleJSON = {
        articleID: article.articleID,
        articleTitle: article.title,
        articlePubDate: article.publishDate,
        articleAuthorID: article.authorID,
        articleContent: article.bodyContentOrLinkToContent
    };
    return articleJSON;
    } catch (e) {
        console.error("Error "+e.name+" in function [readArticlebyID] in [article-dao]"+e.message);
        return null;
    }
    
    
}

async function writeNewArticle(articleObject) {
    const db = await dbPromise;
    try {
        const result = await db.run(SQL`
        INSERT INTO articles (title, publishDate, lastEditDate, bodyContentOrLinkToContent, authorID) 
        VALUES(${articleObject.articleTitle}, ${articleObject.articlePubDate}, CURRENT_TIMESTAMP, ${articleObject.articleContent}, ${articleObject.articleAuthorID})`);
        return result;
    } catch (e) {
        console.error("Error "+e.name+" in function [writeNewArticle] in [article-dao]"+e.message);
        return false;
    }
}

//updates an existing article in the database by articleID
async function writeUpdateArticle(articleObject) {
    const db = await dbPromise;
    try {
        const result = await db.run(SQL`
        UPDATE articles 
            SET title = ${articleObject.articleTitle},
                publishDate = ${articleObject.articlePubDate},
                lastEditDate = CURRENT_TIMESTAMP,
                bodyContentOrLinkToContent = ${articleObject.articleContent},
                authorID = ${articleObject.articleAuthorID}
            WHERE
                articleID = ${articleObject.articleID};`);

        return result;
    } catch (e) {
        console.error("Error "+e.name+" in function [writeUpdateArticle] in [article-dao]"+e.message);
        return false;
    }
}

//returns user JSON object from articleID
async function readAuthor(articleID) {
    const db = await dbPromise;
    try {
        const userID = await db.get(SQL`
        SELECT authorID 
        FROM ARTICLES 
        WHERE articleID = ${articleID}`)
        const user = await userDao.retrieveUserByUserID(userID);
        return user;
    } catch (e) {
        console.error("Error "+e.name+" in function [readAuthor] in [article-dao]"+e.message);
        return null;
    }
}

//returns a JSON object of authorID from articleID
async function readAuthorID(articleID) {
    try {
        const db = await dbPromise;
        return db.get(SQL`
        SELECT authorID 
        FROM ARTICLES WHERE articleID = ${articleID}`);
    } catch (e) {
        console.error("Error "+e.name+" in function [readAuthorID] in [article-dao]"+e.message);
        return null;
    }
}

//placeholder function for JSON validation
function checkIsArticle(article) {
    let value = true;
    return value;
}

//returns an array of JSON article objects between two indices
//can be filtered by column name, if column is present, 
//or not by passing 'none' as col name.
async function readArticleListBycolumnAndOrder(startIndex, lastIndex, SortingcolumeName, order, filterColumnName, filter) {
    const db = await dbPromise;
    try {
        const query = SQL`
        SELECT articleID, title, publishDate, authorID, bodyContentOrLinkToContent 
        FROM ARTICLES `
        if (SortingcolumeName == "username") {
            query.append(`
            LEFT JOIN users 
            ON authorID = userID `)
        }
        if (filterColumnName != "None") {
            query.append(`WHERE ${filterColumnName} = ${filter} `);
        }
        query.append(`ORDER BY LOWER(${SortingcolumeName}) ${order}
        LIMIT ${startIndex}, ${lastIndex};`);
        const articleList = await db.all(query);
        return articleList;
    } catch (e) {
            console.error("Error "+e.name+" in function [readArticleListBycolumnAndOrder] in [article-dao]"+e.message);
            return null;
        }
}

//removes content from all articles of a user by userID
async function updateArticlesAfterUserAccountDelete(userID) {
    const db = await dbPromise;
    try {
        const result = await db.run(SQL`
            UPDATE articles
            SET title='This article has been deleted!', bodyContentOrLinkToContent='This article has been deleted!'
            WHERE authorID=${userID}
        `) 
    } catch (e) {
        console.error("Error "+e.name+" in function [readArticleListBycolumnAndOrder] in [article-dao]"+e.message);
        return false;
    }
}

module.exports = {
    readArticlebyID,
    writeNewArticle,
    writeUpdateArticle,
    readAuthor,
    readAuthorID,
    readArticleListBycolumnAndOrder,
    updateArticlesAfterUserAccountDelete
}