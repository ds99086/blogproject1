const express = require("express");
const router = express.Router();
const articleDao = require("../modules/article-dao");
const userDao = require("../modules/user-dao");
const { retrieveUserWithAuthToken } = require("../modules/user-dao");
const commentDao = require("../modules/comment-dao.js");
const multerUploader = require("../modules/multer-uploader.js")
const fs = require("fs");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");

router.get("/newArticle", verifyAuthenticated, async function(req, res) {
    const user = res.locals.user;

    res.locals.title = "Create a New Article";
    res.locals.editorMode = "newArticleMode";
    // console.log("getting date");
    res.locals.date = getDate();
    res.locals.WYSIWYG = true;
    res.render("new-article")
});

router.post("/saveNewArticle", verifyAuthenticated, async function(req, res) {

    const user = await retrieveUserWithAuthToken(req.cookies.authToken);
    let title = req.body.articleTitle;
    if (title == "") {
        title = "Untitled Article";
    }
    
    const article = {
        articleID: null,
        articleTitle: title,
        articlePubDate: req.body.articlePubDate,
        articleAuthorID: user.userID,
        articleContent: req.body.articleContent
    }
    const newArticle = await articleDao.writeNewArticle(article);
    
    //Stuff to pass back to the client
    let text = `<h1>Article has been saved to ${newArticle.lastID}</h1>`;
    res.locals.title = "WYSIWYG Editor";
    res.locals.WYSIWYG = true;
    res.locals.returnText = text;
    res.redirect(`/article-details?articleID=${newArticle.lastID}`);
});

router.post("/updateExistingArticle", verifyAuthenticated, async function(req, res) {
    const user = await retrieveUserWithAuthToken(req.cookies.authToken);
    const oldArticleID = req.body.articleID;

    let title = req.body.articleTitle;
    if (title = "") {
        title = "Untitled Article";
    }

    const article = {
        articleID: oldArticleID,
        articleTitle: title,
        articlePubDate: req.body.articlePubDate,
        articleAuthorID: user.userID,
        articleContent: req.body.articleContent
    }
    const updatedArticle = articleDao.writeUpdateArticle(article);

    //Stuff to pass back to the client
    res.locals.title = `New Version of ${req.body.articleTitle}`;
    console.log("aiming for "+oldArticleID);
    res.redirect(`./article-details?articleID=${oldArticleID}`);
})


router.get("/editArticle", verifyAuthenticated,async function(req, res) {
    console.log("attempting to load article")
    const user = await retrieveUserWithAuthToken(req.cookies.authToken);
    const articleID = req.query.articleID;
    const targetArticle = await articleDao.readArticlebyID(articleID);
    const articleAuthorID = targetArticle.articleAuthorID;

    if (user.userID != articleAuthorID) {
        // console.log(user.userID);
        // console.log(articleAuthorID);
        res.render("permission-denied");
    } else {
        console.log(`attempting to load article ${articleID}`)
        let text = targetArticle.articleContent;
        res.locals.articleTitle = targetArticle.articleTitle;
        res.locals.articleID = articleID;
        res.locals.date = targetArticle.articlePubDate;
        res.locals.editorMode = "editAritcleMode";
        res.locals.title = `Editing: ${targetArticle.articleTitle}`;
        res.locals.WYSIWYG = true;
        res.locals.returnText = text;
        res.render("new-article");
    }
});


router.post("/editArticle", verifyAuthenticated, async function(req, res) {
    console.log("attempting to load article")
    const user = await retrieveUserWithAuthToken(req.cookies.authToken);
    const articleID = req.body.articleID;
    const targetArticle = await articleDao.readArticlebyID(articleID);
    const articleAuthorID = targetArticle.articleAuthorID;

    if (user.userID != articleAuthorID) {
        // console.log(user.userID);
        // console.log(articleAuthorID);
        res.render("permission-denied");
    } else {
        console.log(`attempting to load article ${articleID}`)
        let text = targetArticle.articleContent;
        res.locals.articleTitle = targetArticle.articleTitle;
        res.locals.articleID = articleID;
        res.locals.date = targetArticle.articlePubDate;
        res.locals.editorMode = "editAritcleMode";
        res.locals.title = `Editing: ${targetArticle.articleTitle}`;
        res.locals.WYSIWYG = true;
        res.locals.returnText = text;
        res.render("new-article");
    }
});

router.post("/articleUploadFile", verifyAuthenticated, multerUploader.single("blogImage"), async function(req, res) {
    const articleContent = req.body.imageUploadContent;
    const user = await retrieveUserWithAuthToken(req.cookies.authToken);
    
    
    console.log("attempting file upload");
    console.log("user ID = "+user.userID);
    const fileInfo = req.file;
    const oldFileName = fileInfo.path;
    if (!fs.existsSync(`./public/userUploads/user_${user.userID}`)){
        fs.mkdirSync(`./public/userUploads/user_${user.userID}`);
    }
    const newFileName = `./public/userUploads/user_${user.userID}/${fileInfo.originalname.replace(/\s/g, '')}`;
    fs.renameSync(oldFileName, newFileName);

    let imageUrl = `userUploads/user_${user.userID}/${fileInfo.originalname.replace(/\s/g, '')}`;

    const articleID = req.body.articleID;
    if (articleID == null) {
        console.log("looks like we've got a new article here");
    } else {
        console.log("got to get those article details set up");
        res.locals.articleTitle = req.body.articleTitleHidden;
        res.locals.date = req.body.articlePubDateHidden;
        res.locals.articleID = articleID;
    }


    //Stuff to pass back to the client
    /* The old way of passing images into the text
        let text = `<h1>Image successfully uploaded!</h1><br>
        <img src=${imageUrl} width="300">
        <p>The link to the image is <a href=${imageUrl}>${imageUrl}</a></p><br>
        <p>you can delete this message and continue working on your article below</p><br>
        ${articleContent}`;
    */
    let text = `<img src=${imageUrl} width="300"><br><br>
    ${articleContent}`;
    
    res.locals.popupcontent = `Image successfully uploaded! The link to the image is: www.blogurl.com/${imageUrl}`;

    res.locals.title = "WYSIWYG Editor"
    res.locals.WYSIWYG = true;
    res.locals.returnText = text;
    res.render("new-article");
});

//get article author username by author id
router.get("/loadArticleAutherName", async function (req, res) {
    const userID = req.query.articleID;
    let user = await userDao.retrieveUserameByUserID(userID);
    // console.log(user)
    if(user == undefined){
        user = { username: 'user deleted' }
    }
    res.json(user);

})

router.get("/article-details", async function (req, res) {
    
    const articleID = req.query.articleID;

    const articleObj = await articleDao.readArticlebyID(articleID);
    const articleAuthor = articleObj.articleAuthorID;
    // console.log("this is test to show and hide edit button in article page")
    // console.log(articleObj)
    // console.log(articleAuthor)

    res.cookie("articleID",`${articleID}`)
    res.locals.articleID = articleID;
    res.locals.articleTitle = articleObj.articleTitle;
    
    
    
    //
    let user =  res.locals.user;
    // console.log(user)
    if (user == undefined){
        res.locals.userIsAuthor = false;
    } else if (user.userID == articleAuthor){
        
        res.locals.userIsAuthor = true;
    } else if(user.userID != articleAuthor){
        res.locals.userIsAuthor = false;
    }

    function removeItemOnce(arr, value) {
        var index = arr.indexOf(value);
        if (index > -1) {
          arr.splice(index, 1);
        }
        return arr;
    }

    

    const commentList = await commentDao.retrieveCommentsbyArticleID(articleID);
    // console.log(commentList)


    //assumes comment #0 is the earliest comment. 
    let output = []; 
    function addChildren(parentC, commentList) {
        for (let j = 0; j < commentList.length; j++) {
            let anotherC = commentList[j];
            if (anotherC.parentComment === parentC.commentID) {
                if (!Array.isArray(parentC.children)) {
                    parentC.children = [];  
                } 
                parentC.children.push(anotherC);
                removeItemOnce(commentList, anotherC);
                j--;
                addChildren(anotherC, commentList);
            }
        }
    }

    for (let i = 0; i < commentList.length; i++) {
        let comment = commentList[i];
        if (comment.commentLevel == 0 ) {
        output.push(comment);
        removeItemOnce(commentList, comment);
        i--;
        addChildren(comment, commentList, output);
    }}

    console.log("output is");
    console.log(output);
    
    res.locals.commentlist = output;
    
    res.render("single-article")
    
})


router.get("/deleteArticle", verifyAuthenticated, async function (req, res) {
    // console.log("attempting to load article");
    const user = await retrieveUserWithAuthToken(req.cookies.authToken);
    // console.log(user)
    const articleID = req.query.articleID;
    const targetArticle = await articleDao.readArticlebyID(articleID);
    const articleAuthorID = targetArticle.articleAuthorID;

    //if the user is not logged in
    if (user == undefined){
        res.render("permission-denied");
    } else if (user.userID != articleAuthorID) {
        console.log(user.userID);
        console.log(articleAuthorID);
        res.render("permission-denied");
    } else {
    const articleID = req.query.articleID;
    res.cookie("articleID",`${articleID}`)
    res.locals.articleID = articleID;
    function removeItemOnce(arr, value) {
        var index = arr.indexOf(value);
        if (index > -1) {
          arr.splice(index, 1);
        }
        return arr;
    }
    res.render("delete-article-confirmation")  
    }
})

router.get("/confirmDeleteArticle", verifyAuthenticated, async function (req, res) {
    console.log("article deletion confirmed");
    const user = await retrieveUserWithAuthToken(req.cookies.authToken);
    const articleID = req.query.articleID;
    const targetArticle = await articleDao.readArticlebyID(articleID);
    const articleAuthorID = targetArticle.articleAuthorID;
    
    if (user.userID != articleAuthorID) {
        console.log(user.userID);
        console.log(articleAuthorID);
        res.render("permission-denied");
    } else {
        const article = {
            articleID: articleID,
            articleTitle: "Deleted Article",
            articlePubDate: targetArticle.articlePubDate,
            articleAuthorID: null,
            articleContent: "This article has been deleted"
        }
    const updatedArticle = articleDao.writeUpdateArticle(article);

    //Stuff to pass back to the client
    res.locals.title = `Deleted ${targetArticle.articleTitle}`;
    console.log("aiming for "+articleID);
    res.redirect(`/article-details?articleID=${articleID}`);  
    }
})



//get the required article from database
router.get("/articleJSON", async function (req, res) {
    const articleID = req.query.articleID;
    const article = await articleDao.readArticlebyID(articleID);
    // console.log(article)
    let user = await userDao.retrieveUserameByUserID(article.articleAuthorID);
    if (user == undefined){
        user = {username: "article deleted"}
    }
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


function getDate() {
    let now = new Date();
    let dd = now.getDate();
    if(dd<10) {dd='0'+dd;}
    let mm = now.getMonth()+1;
    if(mm<10) {mm='0'+mm;}
    let yyyy = now.getFullYear();
    // let date = `${yyyy}-${mm}-${dd}`
    let date = `${yyyy}-${mm}-${dd}`
    console.log("setting date to be "+date);
    return date;
}

module.exports = router;