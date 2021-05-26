const express = require("express");
const router = express.Router();
const articleDao = require("../modules/article-dao");
const { retrieveUserWithAuthToken } = require("../modules/user-dao");



router.post("/articleChanges", async function(req, res) {

    const user = await retrieveUserWithAuthToken(req.cookies.authToken);
    
    const article = {
        articleID: null,
        articleTitle: req.body.articleTitle,
        articlePubDate: req.body.articlePubDate,
        articleAuthorID: user.userID,
        articleContent: req.body.articleContent
    }
    const newArticle = await articleDao.writeNewArticle(article);
    
    //Stuff to pass back to the client
    let text = `<h1>Article has been saved to ${newArticle.lastID}</h1>`;
    res.locals.title = "WYSIWYG Editor"
    res.locals.WYSIWYG = true;
    res.locals.returnText = text;
    res.render("new-article");
});


router.post("/editArticle", async function(req, res) {
    console.log("attempting to load article")
    const articleID = req.body.articleID;
    console.log(`attempting to load article ${articleID}`)
    const targetArticle = articleDao.readArticlebyID(articleID);
    let text = (await targetArticle).articleContent;
    
    res.locals.title = "WYSIWYG Editor"
    res.locals.WYSIWYG = true;
    res.locals.returnText = text;
    res.render("new-article");
});

module.exports = router;