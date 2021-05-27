const express = require("express");
const router = express.Router();
const articleDao = require("../modules/article-dao");
const userDao = require("../modules/user-dao");
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

//get article author username by author id
router.get("/loadArticleAutherName", async function (req, res) {
    const userID = req.query.articleID;
    const user = await userDao.retrieveUserameByUserID(userID);
    res.json(user);

})

router.get("/article-details", function (req, res) {
    
    const articleID = req.query.articleID;
    res.cookie("articleID",`${articleID}`)
    res.render("single-article")
    
})

//get the required article from database
router.get("/articleJSON", async function (req, res) {
    const articleID = req.query.articleID;
    const article = await articleDao.readArticlebyID(articleID);
    // console.log(article)
    const user = await userDao.retrieveUserameByUserID(article.articleAuthorID);

    const updatedArticleObj = {
        articleID: article.articleID,
        articleTitle: article.articleTitle,
        articlePubDate: article.articlePubDate,
        articleAuthorID: article.articleAuthorID,
        articleContent: article.articleContent,
        articleAuthorUsername: user.username
    }
    // console.log(updatedArticleObj)
     res.json(updatedArticleObj);
    
})


module.exports = router;