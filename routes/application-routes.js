const { Router } = require("express");
const router = Router();
const userDao = require("../modules/user-dao");

//const testDao = require("../modules/test-dao.js");
const articleDao = require("../modules/article-dao.js");

router.get("/", async function(req, res) {

    res.locals.homepage = true;

    res.locals.title = "My route title!";
    //res.locals.allTestData = await testDao.retrieveAllTestData();
    res.locals.message = req.query.message;

    const LoginedUser = res.locals.user;


    // console.log(LoginedUser)
    let sortingFilterName = req.query.sortingFilterName;
    let sortingFilter = req.query.sortingFilter;

    // if(LoginedUser==undefined){
    //     res.render("permission-denied")
    // }

    if (sortingFilterName == undefined){
        sortingFilterName = "None";

    }
    if (sortingFilterName == "authorID"&&LoginedUser!=undefined){
        sortingFilter = LoginedUser.userID;
    } else if(sortingFilterName == "authorID"&&LoginedUser==undefined){
        sortingFilter = -1;
    }
    



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
    res.locals.filterName = sortingFilterName
    res.locals.filter = sortingFilter



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
    const articleSortingFilterName = req.query.filterName;
    const articleSortingFitler = req.query.filter


    // console.log(articleSortingAttribute);
    // console.log(articleSortingOrder);


    //read aritles from article table in DESC order by publishDate
    //with the limit article number
    const articleList = await articleDao.readArticleListBycolumnAndOrder(nextArticleIndex, LastArticleIndex, articleSortingAttribute,articleSortingOrder, articleSortingFilterName, articleSortingFitler);
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