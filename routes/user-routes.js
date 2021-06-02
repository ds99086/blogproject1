const express = require("express");
const router = express.Router();
const fs = require("fs");

// The DAO that handles CRUD operations for users.
const userDao = require("../modules/user-dao.js");
const passwordSec = require("../modules/passwordSec.js");
const commentDao = require("../modules/comment-dao.js");
const articleDao = require("../modules/article-dao.js");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");

router.get("/profile-setting", verifyAuthenticated, async function (req, res) {

    res.locals.profileChangingMessage = req.query.profileChangingMessage;
    let avatarImgNames = fs.readdirSync("public/images/Avatars");

    const allowedFileTypes = [".png"];
    avatarImgNames = avatarImgNames.filter(function(fileName) {
        const extension = fileName.toLowerCase().substring(fileName.lastIndexOf("."));
        return allowedFileTypes.includes(extension);
    });
    //console.log(avatarImgNames)
    res.locals.avatarImgNames = avatarImgNames;
    console.log(res.locals.avatarImages)

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


// //route to user ariticles
// router.get("/user-articles", verifyAuthenticated, async function (req, res) {
    
//     const user = res.locals.user;

    

//     res.render("home");
// });

router.post("/updateUseDetails", verifyAuthenticated, async function (req, res) {

    //get the user details by cookies
    //missing the middleware for now
    const user = res.locals.user;

    const userNewName = req.body.new_account_username;
    const userNewPassword = req.body.password2;
    const userNewFirstName = req.body.fname;
    const userNewLastName = req.body.lname;
    const userNewBirthday = req.body.birthday;
    const userNewiIntroduction = req.body.introduction;
    const userNewAvatar = req.body.avatars;

    if (userNewName != "") { user.username = userNewName };
    if (userNewPassword != "") { user.password = await passwordSec.newHashPassword(userNewPassword) };
    if (userNewFirstName != "") { user.fname = userNewFirstName };
    if (userNewLastName != "") { user.lname = userNewLastName };
    if (userNewBirthday != "") { user.birthday = userNewBirthday };
    if (userNewiIntroduction != "") { user.introduction = userNewiIntroduction };
    if (userNewAvatar != "") { user.avatarImage = userNewAvatar }

    await userDao.updateUser(user);
    let profileChangingMessage = "Your profile has been updated!"

    res.redirect(`./profile-setting?profileChangingMessage=${profileChangingMessage}`);


});


// router.post("/updateUserAvatar", verifyAuthenticated, async function (req, res) {

//     //get the user details by cookies
//     //missing the middleware for now
//     const user = res.locals.user;

//     user.avatarImage = req.body.avatars;
//     await userDao.updateUser(user);

//     res.redirect("profile-setting");
// });


router.post("/deleteAccount", verifyAuthenticated, async function (req, res) {

    //get the user details by cookies
    //missing the middleware for now
    const user = res.locals.user;

    await commentDao.updateCommentsAfterUserAccountDelect(user.userID);
    await articleDao.updateArticlesAfterUserAccountDelect(user.userID);

    await userDao.deleteUser(user.username);


    //clear cookies
    res.clearCookie("authToken");
    //set locals.user to null
    res.locals.user = null;

    res.redirect("/?message=Account has been deleted");

});

module.exports = router;
