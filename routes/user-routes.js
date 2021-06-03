const { Router } = require("express");
const router = Router();

const userDao = require("../modules/user-dao.js");
const passwordSec = require("../modules/passwordSec.js");
const commentDao = require("../modules/comment-dao.js");
const articleDao = require("../modules/article-dao.js");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const { avatarFileReader } = require("../modules/avatar-file-reader.js");

router.get("/profile-setting", verifyAuthenticated, async function (req, res) {
    
    res.locals.newaccountpage = true;
    res.locals.profilepage = true;
    
    res.locals.profileChangingMessage = req.query.profileChangingMessage;
    let avatarImgNames = avatarFileReader();
    res.locals.avatarImgNames = avatarImgNames;
    res.render("profile");
});

router.get("/logout", verifyAuthenticated, async function (req, res) {
    const user = res.locals.user;
    //delete user's authToken
    user.authToken = "";
    await userDao.updateUser(user);

    res.clearCookie("authToken");
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


router.post("/updateUseDetails", verifyAuthenticated, async function (req, res) {

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


router.post("/deleteAccount", verifyAuthenticated, async function (req, res) {

    const user = res.locals.user;

    await commentDao.updateCommentsAfterUserAccountDelete(user.userID);
    await articleDao.updateArticlesAfterUserAccountDelete(user.userID);

    await userDao.deleteUser(user.userID);

    res.clearCookie("authToken");
    res.locals.user = null;

    res.redirect("/?message=Account has been deleted");
});

module.exports = router;
