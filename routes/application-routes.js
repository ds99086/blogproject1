const express = require("express");
const router = express.Router();
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const userDao = require("../modules/user-dao");

//const testDao = require("../modules/test-dao.js");
const articleDao = require("../modules/article-dao.js");

router.get("/", async function(req, res) {

    res.locals.title = "My route title!";
    //res.locals.allTestData = await testDao.retrieveAllTestData();
    res.locals.message = req.query.message;

    const LoginedUser = res.locals.user;
    // console.log(LoginedUser)

    //get the sorting requirement from the query
    //if there is no sorting requirement
    //the default will be desc in publishDate
    let sortingAttribute = req.query.sortingAttribute;
    let sortingOrder = req.query.sortingOrder;


    if (sortingAttribute == undefined){
        sortingAttribute = "publishDate";
    }
    if (sortingOrder == undefined){
        sortingOrder = "DESC";
    }
  

    //res.locals.message = req.query.message;
    // const user = res.locals.user;

    res.locals.attribute = sortingAttribute;
    res.locals.order = sortingOrder;

    res.locals.sortingDateDesc = false;
    res.locals.sortingDateAsc = false;
    res.locals.sortingTitleAsc = false;
    res.locals.sortingTitleDesc = false;

    if (sortingAttribute == "publishDate"){
        if (sortingOrder == "DESC"){
            res.locals.sortingDateAsc = true;
        } else if (sortingOrder == "ASC"){
            res.locals.sortingDateDesc = true;
        }
    } 
    if (sortingAttribute == "title"){
        if (sortingOrder == "DESC"){
            res.locals.sortingTitleAsc = true;
        } else if (sortingOrder == "ASC"){
            res.locals.sortingTitleDesc = true;
        }
    } 
    if (sortingAttribute == "username"){
        if (sortingOrder == "DESC"){
            res.locals.sortingUsernameAsc = true;
        } else if (sortingOrder == "ASC"){
            res.locals.sortingUsernameDesc = true;
        }
    } 


    // console.log(sortingAttribute);
    // console.log(sortingOrder);
    // console.log(sortingFilterName);
    // console.log(sortingFilter);
    res.render("home");

});

//get articles array from 
router.get("/loadHomepageArticles", async function (req, res) {
    const nextArticleIndex = parseInt(req.query.from);
    const articleNumToLoad = parseInt(req.query.number);
    const LastArticleIndex = nextArticleIndex+articleNumToLoad;
    const articleSortingAttribute = req.query.attribute;
    const articleSortingOrder = req.query.order;

    // console.log(articleSortingAttribute);
    // console.log(articleSortingOrder);


    //read aritles from article table in DESC order by publishDate
    //with the limit article number
    const articleList = await articleDao.readArticleListBycolumnAndOrder(nextArticleIndex, LastArticleIndex, articleSortingAttribute,articleSortingOrder);
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