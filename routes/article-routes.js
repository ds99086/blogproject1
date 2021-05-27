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

router.get("/checkUsername", async function (req, res) {
    const input_username = req.query.input_username;
    const username_availability = await userDao.retrieveUserByUsername(input_username);
    
    if (username_availability) {
        const response = {
            username_availability: false
        }
        res.json(response);

    } else {
        //console.log("This username is good to go!");
        const response = {
            username_availability: true
        }
        res.json(response);
    }
});

module.exports = router;