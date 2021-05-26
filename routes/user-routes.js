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


//route to new aritile
router.get("/new-article", verifyAuthenticated, async function (req, res) {

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

    const articleId = 1;

    const initialList = await userDao.retrieveCommentsbyArticleID(articleId);


    let output = [];
    
    for (let i = 0; i < initialList.length; i++) {
        let comment = initialList[i];
        if (comment.commentLevel == 0) {
            output.push(comment);
            comment.children = [];
            addChildren(comment, initialList);
    }
    }

    function addChildren(parentComment, arrayList) {
        
        for (let i = 0; i < arrayList.length; i++) {
            let comment = arrayList[i];
            if (comment.parentComment ===parentComment.commentID) {
                parentComment.children.push(comment);
            }
        }  
    };
    
    //console.log(output);
    
    res.locals.commentlist = output;

    // console.log(initialList);

    res.render("single-article");
})









module.exports = router;