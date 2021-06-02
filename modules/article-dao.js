const SQL = require("sql-template-strings");
const { stringify } = require("uuid");
const dbPromise = require("./database.js");
const userDao = require("./user-dao.js");

async function readArticlebyID(articleID) {
    const db = await dbPromise;
    const article = await db.get(SQL`SELECT articleID, title, publishDate, authorID, bodyContentOrLinkToContent FROM ARTICLES WHERE articleID = ${articleID}`)
    // console.log("article from articleDAO: " )
    // // console.log(articleJSON)

    const articleJSON = {
        articleID: article.articleID,
        articleTitle: article.title,
        articlePubDate: article.publishDate,
        articleAuthorID: article.authorID,
        articleContent: article.bodyContentOrLinkToContent
        //directLink: "urlToArticle" //(If we actually deploy this, it is useful to have a url for each article (e.g. for articles to be shared) and we should probably store this value in the json and database)
    };
    // console.log("ArticleJson from articleDAO: ")
    // // console.log(articleJSON)
    return articleJSON;
}

async function readArticleInfobyID(articleID) {
    const db = await dbPromise;
    const article = await db.get(SQL`SELECT articleID, title, publishDate, authorID FROM articles WHERE articleID = ${articleID}`)
    const articleInfoJSON = {
        articleID: article.articleID,
        articleTitle: article.title,
        articlePubDate: article.publishDate,
        articleAuthorID: article.authorID,
        //directLink: "urlToArticle" //(If we actually deploy this, it is useful to have a url for each article (e.g. for articles to be shared) and we should probably store this value in the json and database)
    };
    return articleInfoJSON;
}

async function writeNewArticle(articleObject) {
    const db = await dbPromise;
    const result = await db.run(SQL`
    INSERT INTO articles (title, publishDate, lastEditDate, bodyContentOrLinkToContent, authorID) 
        VALUES(${articleObject.articleTitle}, ${articleObject.articlePubDate}, CURRENT_TIMESTAMP, ${articleObject.articleContent}, ${articleObject.articleAuthorID})`);
    console.log("created article "+result.lastID);
    return result;
}

async function writeUpdateArticle(articleObject) {
    const db = await dbPromise;
    const result = await db.run(SQL`
    UPDATE articles 
        SET title = ${articleObject.articleTitle},
            publishDate = ${articleObject.articlePubDate},
            lastEditDate = CURRENT_TIMESTAMP,
            bodyContentOrLinkToContent = ${articleObject.articleContent},
            authorID = ${articleObject.articleAuthorID}
        WHERE
            articleID = ${articleObject.articleID};`);
    console.log("updated article "+result.lastID);
    return result;
}

async function readAuthor(articleID) {
    const db = await dbPromise;
    const userID = await db.get(SQL`SELECT authorID FROM ARTICLES WHERE articleID = ${articleID}`)
    const user = await userDao.retrieveUserByUserID(userID);
    return user;
}

async function readAuthorID(articleID) {
    const db = await dbPromise;
    console.log("Reading Author ID of "+articleID);
    return db.get(SQL`SELECT authorID FROM ARTICLES WHERE articleID = ${articleID}`);
}

function checkIsArticle(article) {
    let value = true;
    //if article.articleID.
    return value;
}

//using append to force SQL in use
async function readArticleListBycolumnAndOrder(startIndex, lastIndex, SortingcolumeName, order, filterColumnName, filter){
    const db = await dbPromise;
    const query = SQL`
    SELECT articleID, title, publishDate, authorID, bodyContentOrLinkToContent FROM ARTICLES `
    if(SortingcolumeName == "username"){
        query.append(`LEFT JOIN users 
        ON authorID = userID `)
    }
    if(filterColumnName != "None"){
        query.append(`WHERE ${filterColumnName} = ${filter} `)
    }
    query.append(`ORDER BY LOWER(${SortingcolumeName}) ${order}
    LIMIT ${startIndex}, ${lastIndex};`);
    // console.log(query)
    const articleList = await db.all(query)
    // console.log(articleList)
    return articleList;    
}

async function updateArticlesAfterUserAccountDelect(userID){
    const db = await dbPromise;

    const result = await db.run(SQL`
        UPDATE articles
        SET title='This article has been deleted!', bodyContentOrLinkToContent='This article has been deleted!'
        WHERE authorID=${userID}
    `)
}



//Export funcitons
module.exports = {
    readArticlebyID,
    readArticleInfobyID,
    writeNewArticle,
    writeUpdateArticle,
    readAuthor,
    readAuthorID,
    readArticleListBycolumnAndOrder,
    updateArticlesAfterUserAccountDelect
}