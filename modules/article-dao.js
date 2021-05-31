const SQL = require("sql-template-strings");
const { stringify } = require("uuid");
const dbPromise = require("./database.js");
const userDao = require("./user-dao.js");

async function readArticlebyID(articleID) {
    const db = await dbPromise;
    const article = await db.get(SQL`SELECT articleID, title, publishDate, authorID, bodyContentOrLinkToContent FROM ARTICLES WHERE articleID = ${articleID}`)
    const articleJSON = {
        articleID: article.articleID,
        articleTitle: article.title,
        articlePubDate: article.publishDate,
        articleAuthorID: article.authorID,
        articleContent: article.bodyContentOrLinkToContent
        //directLink: "urlToArticle" //(If we actually deploy this, it is useful to have a url for each article (e.g. for articles to be shared) and we should probably store this value in the json and database)
    };
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
    return null;
}

async function readAuthor(articleID) {
    const db = await dbPromise;
    const userID = await db.get(SQL`SELECT authorID FROM ARTICLES WHERE articleID = ${articleID}`)
    const user = await userDao.retrieveUserByUserID(userID);
    return user;
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
    if(filterColumnName != "None"){
        query.append(`WHERE ${filterColumnName} = ${filter} `)
    }
    query.append(`ORDER BY ${SortingcolumeName} ${order}
    LIMIT ${startIndex}, ${lastIndex};`);
    // console.log(query)
    const articleList = await db.all(query)
    // console.log(articleList)
    return articleList;    
}



//Export funcitons
module.exports = {
    readArticlebyID,
    readArticleInfobyID,
    writeNewArticle,
    writeUpdateArticle,
    readAuthor,
    readArticleListBycolumnAndOrder
}