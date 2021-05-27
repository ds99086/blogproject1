const express = require("express");
const router = express.Router();
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");

//const testDao = require("../modules/test-dao.js");
const articleDao = require("../modules/article-dao.js");

router.get("/",function(req, res) {

    res.locals.title = "My route title!";
    //res.locals.allTestData = await testDao.retrieveAllTestData();
    res.locals.message = req.query.message;

    //res.locals.message = req.query.message;
    // const user = res.locals.user;
    res.render("home");

});

//get articles array from 
router.get("/loadHomepageArticles", async function (req, res) {
    const nextArticleIndex = parseInt(req.query.from);
    const articleNumToLoad = parseInt(req.query.number);
    const LastArticleIndex = nextArticleIndex+articleNumToLoad;


    //read aritles from article table in DESC order by publishDate
    //with the limit article number
    const articleList = await articleDao.readArticleListByOrder(nextArticleIndex, LastArticleIndex, "publishDate","DESC");
    // console.log(articleList)

    res.json(articleList);
    
});


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