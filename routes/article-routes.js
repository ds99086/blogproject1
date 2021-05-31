const express = require("express");
const router = express.Router();
const articleDao = require("../modules/article-dao");
const userDao = require("../modules/user-dao");
const { retrieveUserWithAuthToken } = require("../modules/user-dao");
const commentDao = require("../modules/comment-dao.js");
const multerUploader = require("../modules/multer-uploader.js")
const fs = require("fs");

router.get("/newArticle", async function(req, res) {
    const user = await retrieveUserWithAuthToken(req.cookies.authToken);
    res.locals.title = "Create a New Article";
    let text = "<h1>This is the place to write a new article</h1>";
    res.locals.editorMode = "newArticleMode";
    res.locals.returnText = text;
    res.locals.date = getDate();
    res.locals.WYSIWYG = true;
    res.render("new-article")
});

router.post("/saveNewArticle", async function(req, res) {

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
    res.locals.title = "WYSIWYG Editor";
    res.locals.WYSIWYG = true;
    res.locals.returnText = text;
    res.redirect(`/./article-details?articleID=${newArticle.lastID}`);
});

router.post("/updateExistingArticle", async function(req, res) {
    
    const user = await retrieveUserWithAuthToken(req.cookies.authToken);
    const oldArticleID = req.body.articleID;
    const articleAuthorID = await articleDao.readAuthor(oldArticleID);
    if (user.userID != articleAuthorID) {
        res.redirect("./permission-denied")
    }

    const article = {
        articleID: oldArticleID,
        articleTitle: req.body.articleTitle,
        articlePubDate: req.body.articlePubDate,
        articleAuthorID: user.userID,
        articleContent: req.body.articleContent
    }
    const updatedArticle = await articleDao.writeUpdateArticle(article);

    //Stuff to pass back to the client
    res.locals.title = `New Version of ${req.body.articleTitle}`;
    res.redirect(`/./article-details?articleID=${oldArticleID}`);
})


router.post("/editArticle", async function(req, res) {
    console.log("attempting to load article")
    const user = await retrieveUserWithAuthToken(req.cookies.authToken);
    const articleID = req.body.articleID;
    const oldArticleID = req.body.articleID;
    const articleAuthorID = await articleDao.readAuthorID(oldArticleID);
    if (user.userID != articleAuthorID.authorID) {
        console.log(user.userID);
        console.log(articleAuthorID.authorID);
        res.render("permission-denied");
    } else {
        console.log(`attempting to load article ${articleID}`)
        const targetArticle = articleDao.readArticlebyID(articleID);
        let text = (await targetArticle).articleContent;
        res.locals.articleTitle = (await targetArticle).articleTitle;
        res.locals.articleID = articleID;
        res.locals.date = (await targetArticle).articlePubDate;
        res.locals.editorMode = "editAritcleMode";
        res.locals.title = "WYSIWYG Editor"
        res.locals.WYSIWYG = true;
        res.locals.returnText = text;
        res.render("new-article");
    }
    

});

router.post("/articleUploadFile", multerUploader.single("blogImage"), async function(req, res) {
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
    let text = `<h1>Image successfully uploaded!</h1><br>
    <img src=${imageUrl} width="300">
    <p>The link to the image is <a href=${imageUrl}>${imageUrl}</a></p><br>
    <p>you can delete this message and continue working on your article below</p><br>
    ${articleContent}`;
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

router.get("/article-details", async function (req, res) {
    
    const articleID = req.query.articleID;
    res.cookie("articleID",`${articleID}`)
    function removeItemOnce(arr, value) {
        var index = arr.indexOf(value);
        if (index > -1) {
          arr.splice(index, 1);
        }
        return arr;
    }

    

    const commentList = await commentDao.retrieveCommentsbyArticleID(articleID);

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
    
    res.locals.commentlist = output;
    
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


function getDate() {
    let now = new Date();
    let dd = now.getDate();
    if(dd<10) {dd='0'+dd;}
    let mm = now.getMonth()+1;
    if(mm<10) {mm='0'+mm;}
    let yyyy = now.getFullYear();
    // let date = `${yyyy}-${mm}-${dd}`
    let date = `${yyyy}-${mm}-${dd}`
    console.log(date);
    return date;
}

module.exports = router;