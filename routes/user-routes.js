const express = require("express");
const router = express.Router();

// The DAO that handles CRUD operations for users.
const userDao = require("../modules/user-dao.js");
const passwordSec = require("../modules/passwordSec.js");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");

router.get("/profile-setting", verifyAuthenticated, async function (req, res) {


    res.render("profile");
});


router.get("/logout", verifyAuthenticated, async function (req, res) {

    const user = res.locals.user;
    //delete user's authToken
    user.authToken = "";
    await userDao.updateUser(user);

    //clear cookies
    res.clearCookie("authToken");
    //set locals.user to null
    res.locals.user = null;

    //redirect to home page with the message
    res.redirect("/?message=Successfully logged out!");
});


//route to new article  
router.get("/new-article", verifyAuthenticated, async function (req, res) {
    res.locals.title = "WYSIWYG Editor"
    res.locals.WYSIWYG = true;
    res.render("new-article");
});


//route to user ariticles
router.get("/user-articles", verifyAuthenticated, async function (req, res) {


    res.render("user-articles");
});

router.post("/updateUseDetails", verifyAuthenticated, async function (req, res) {

    //get the user details by cookies
    //missing the middleware for now
    const user = res.locals.user;

    const userNewName = req.body.new_account_username;
    const userNewPassword = req.body.password2;
    const userNewFirstName = req.body.fname;
    const userNewLastName = req.body.lname;
    const userNewBirthday = req.body.birthday;
    const userNewDescription = req.body.description;

    if (userNewName != "") { user.username = userNewName };
    if (userNewPassword != "") { user.password = await passwordSec.newHashPassword(userNewPassword) };
    if (userNewFirstName != "") { user.fname = userNewFirstName };
    if (userNewLastName != "") { user.lname = userNewLastName };
    if (userNewBirthday != "") { user.birthday = userNewBirthday };
    if (userNewDescription != "") { user.description = userNewDescription };

    await userDao.updateUser(user);

    res.redirect("profile-setting");
});


router.post("/updateUserAvatar", verifyAuthenticated, async function (req, res) {

    //get the user details by cookies
    //missing the middleware for now
    const user = res.locals.user;

    user.avatarImage = req.body.avatars;
    await userDao.updateUser(user);

    res.redirect("profile-setting");
});


router.post("/deleteAccount", verifyAuthenticated, async function (req, res) {

    //get the user details by cookies
    //missing the middleware for now
    const user = res.locals.user;

    await userDao.deleteUser(user.username);

    res.redirect("/?message=account deleted");

});

router.get("/single-article", async function(req,res) {

    function removeItemOnce(arr, value) {
        var index = arr.indexOf(value);
        if (index > -1) {
          arr.splice(index, 1);
        }
        return arr;
    }

    //Article number is hard coded to 1. 
    const articleId = 1;

    const commentList = await userDao.retrieveCommentsbyArticleID(articleId);

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

    //console.log(output);
    
    res.locals.commentlist = output;

    res.render("single-article");
})









module.exports = router;