const { Router } = require("express");
const router = Router();
const articleDao = require("../modules/article-dao");
const userDao = require("../modules/user-dao");
const commentDao = require("../modules/comment-dao.js");
const multerUploader = require("../modules/multer-uploader.js")
const fs = require("fs");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const date = require("../modules/date.js");
const imageProcessing = require("../modules/image-processing.js");

router.get("/newArticle", verifyAuthenticated, async function (req, res) {
    res.locals.title = "Create a New Article";
    res.locals.editorMode = "newArticleMode";
    res.locals.date = date.getDate();
    res.locals.WYSIWYG = true;
    res.render("new-article")
});

router.post("/saveNewArticle", verifyAuthenticated, async function (req, res) {
    const user = res.locals.user;
    let title = req.body.articleTitle;
    if (!title.match(/\\S/)) {
        title = `${user.username}'s Untitled Article`;
    }

    const article = {
        articleID: null,
        articleTitle: title,
        articlePubDate: req.body.articlePubDate,
        articleAuthorID: user.userID,
        articleContent: req.body.articleContent
    }
    const newArticle = await articleDao.writeNewArticle(article);
    res.redirect(`/article-details?articleID=${newArticle.lastID}`);
});

router.post("/updateExistingArticle", verifyAuthenticated, async function (req, res) {
    const user = res.locals.user;
    const oldArticleID = req.body.articleID;

    let title = req.body.articleTitle;
    if (!title.match(/\\S/)) {
        title = `${user.username}'s Untitled Article`;
    }

    const article = {
        articleID: oldArticleID,
        articleTitle: title,
        articlePubDate: req.body.articlePubDate,
        articleAuthorID: user.userID,
        articleContent: req.body.articleContent
    };

    await articleDao.writeUpdateArticle(article);
    res.redirect(`./article-details?articleID=${oldArticleID}`);
})


router.get("/editArticle", verifyAuthenticated, async function (req, res) {
    console.log("I am in route");
    const user = res.locals.user;
    const articleID = req.query.articleID;
    console.log(articleID);
    const targetArticle = await articleDao.readArticlebyID(articleID);
    const articleAuthorID = targetArticle.articleAuthorID;

    if (user.userID != articleAuthorID) {
        res.render("permission-denied");
    } else {
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


router.post("/editArticle", verifyAuthenticated, async function (req, res) {
    const user = res.locals.user;
    const articleID = req.body.articleID;
    const targetArticle = await articleDao.readArticlebyID(articleID);
    const articleAuthorID = targetArticle.articleAuthorID;

    if (user.userID != articleAuthorID) {
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

router.post("/articleUploadFile", verifyAuthenticated, multerUploader.single("blogImage"), async function (req, res) {
    const articleContent = req.body.imageUploadContent;
    const user = res.locals.user;
    
    imageProcessing.userFolder(user);

    const imageUrl = await imageProcessing.uploadUserImage(user, req.file);

    //TO DO pass article title on image upload also date
    const articleID = req.body.articleID;
    if (articleID != null) {
        res.locals.articleTitle = req.body.articleTitleHidden;
        res.locals.date = req.body.articlePubDateHidden;
        res.locals.articleID = articleID;
    }

    let text = `<img src=${imageUrl} width="400"><br><br>
    ${articleContent}`;

    //TO DO Change the url
    res.locals.popupcontent = `Image successfully uploaded! The link to the image is: www.blogurl.com/${imageUrl}`;

    res.locals.title = "WYSIWYG Editor"
    res.locals.WYSIWYG = true;
    res.locals.returnText = text;
    res.render("new-article");
});

//get article author username by author id
router.get("/loadArticleAuthorName", async function (req, res) {
    const userID = req.query.articleID;
    let user = await userDao.retrieveUsernameByUserID(userID);
    if (user == undefined) {
        user = { username: 'user deleted' }
    }
    res.json(user);
})

router.get("/article-details", async function (req, res) {

    res.locals.singlearticlepage = true;
    
    const articleID = parseInt(req.query.articleID);
    res.cookie("articleID", `${articleID}`)

    let articleObj = await articleDao.readArticlebyID(articleID);
    res.locals.articleID = articleID;
    res.locals.articleTitle = articleObj.articleTitle;

    //to check whether user is the author
    //if so, will give the permission to edit or delete article
    let user = res.locals.user;

    if (user == undefined) {
        res.locals.userIsAuthor = false;
    } else if (user.userID == articleObj.articleAuthorID) {

        res.locals.userIsAuthor = true;
    } else if (user.userID != articleObj.articleAuthorID) {
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

    //ALLIE DO THIS
    //assumes comment #0 is the earliest comment. 
    //append as the first child possible??  
    let output = [];
    function addChildren(parentC, commentList) {
        for (let j = 0; j < commentList.length; j++) {
            let anotherC = commentList[j];
            if (anotherC.parentComment === parentC.commentID) {
                if (!Array.isArray(parentC.children)) {
                    parentC.children = [];
                }
                parentC.children.unshift(anotherC);
                removeItemOnce(commentList, anotherC);
                j--;
                addChildren(anotherC, commentList);
            }
        }
    }

    for (let i = 0; i < commentList.length; i++) {
        let comment = commentList[i];
        if (comment.commentLevel == 0) {
            output.push(comment);
            removeItemOnce(commentList, comment);
            i--;
            addChildren(comment, commentList, output);
        }
    }



    res.locals.commentlist = output;

    res.render("single-article")

})


router.get("/deleteArticle", verifyAuthenticated, async function (req, res) {

    const user = res.locals.user;
    
    const articleID = req.query.articleID;
    const targetArticle = await articleDao.readArticlebyID(articleID);
    const articleAuthorID = targetArticle.articleAuthorID;

    //if the user is not logged in
    if (user == undefined) {
        res.render("permission-denied");
    } else if (user.userID != articleAuthorID) {
        res.render("permission-denied");
    } else {
        const articleID = req.query.articleID;
        res.cookie("articleID", `${articleID}`)
        res.locals.articleID = articleID;
        res.render("delete-article-confirmation")
    }
})


router.get("/confirmDeleteArticle", verifyAuthenticated, async function (req, res) {
    const user = res.locals.user;
    const articleID = req.query.articleID;
    const targetArticle = await articleDao.readArticlebyID(articleID);
    const articleAuthorID = targetArticle.articleAuthorID;

    if (user.userID != articleAuthorID) {
        res.render("permission-denied");
    } else {
        const article = {
            articleID: articleID,
            articleTitle: "Deleted Article",
            articlePubDate: targetArticle.articlePubDate,
            articleAuthorID: null,
            articleContent: "This article has been deleted"
        }
        await articleDao.writeUpdateArticle(article);

        res.locals.title = `Deleted ${targetArticle.articleTitle}`;
        res.redirect(`/article-details?articleID=${articleID}`);
    }
})

//get the required article from database
router.get("/articleJSON", async function (req, res) {
    const articleID = req.query.articleID;
    const article = await articleDao.readArticlebyID(articleID);
    let user = await userDao.retrieveUsernameByUserID(article.articleAuthorID);
    if (user == undefined) {
        user = { username: "article deleted" }
    }
    const updatedArticleObj = {
        articleID: article.articleID,
        articleTitle: article.articleTitle,
        articlePubDate: article.articlePubDate,
        articleAuthorID: article.articleAuthorID,
        articleContent: article.articleContent,
        articleAuthorUsername: user.username
    }
    res.json(updatedArticleObj);
})


module.exports = router;