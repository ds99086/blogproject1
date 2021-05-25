/*
* USER JSON DOCUMENTATION
* In most cases we should just be able to use the username, as this is a unique value, rather than the Json Object.
* For attribution we should probably use userID, as that is a static integer value, we may need to think about deleition keeping this in the database but making it as "deleted user" so we don't have issues with a new user  being assinged an old user ID number.
* We should not store the passwords (hashed or plain text) in the json article, but rather use the secuirty javascript and authenticaiton tokens.
*/
const user = {
        userID: 1,
        username: 'uniqueUsername',
        fname: 'userFirstName',
        lname: 'userLastName',
        birthday: '1901-06-18',
        description: 'This is an example user'
    };

/*
* ARTICLE JSON DOCUMENTATION
* We have two types of JSon object for article, to 
*
* 
*/
//article is the full json object for handling articles
const article = {
    articleID: 1,
    title: 'Title of article',
    date: 2021-05-25,
    authorID: 1,
    bodyContent: articleObject
    //directLink: "urlToArticle" //(If we actually deploy this, it is useful to have a url for each article (e.g. for articles to be shared) and we should probably store this value in the json and database)
};
//articleInfo is a "lighter" version of the article json without the body contnet
const articleInfo = {
    articleID: 1,
    title: 'Title of article',
    date: 2021-05-25,
    authorID: 1,
    //directLink: "urlToArticle" //(If we actually deploy this, it is useful to have a url for each article (e.g. for articles to be shared) and we should probably store this value in the json and database)
}

const comment = {
    commentID: 1,
    date: '2021-05-27',
    commentText: 'this is the text inside the comment',
    commentLevel: 0 //0 indicates a comment replies directly to an article, 1 to a comment, etc.
    parentComment: null, //default to null, referes to a commentID if this comment replies to another comment
    authoerID: 1, //corresponds to a user ID
    parentArticleID: 1, //corresponds to an articleID
};

/*
* Vote Json: I think we will rarely need to use this, except perhaps in the front end for creating a vote and passing it to the backend for checking.
*/
const vote = {
    commentID: 101,
    userID: 2,
    voteValue: 1
};