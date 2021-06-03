const { v4: uuid } = require("uuid");
const { Router } = require("express");
const router = Router();
const fs = require("fs");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const { avatarFileReader } = require("../modules/avatar-file-reader.js");

// The DAO that handles CRUD operations for users.
const userDao = require("../modules/user-dao.js");
const passwordSec = require("../modules/passwordSec.js");


router.get("/newAccount", function(req, res) {
    res.locals.message = req.query.message;
    res.locals.yeti = true;
    res.locals.newaccountpage = true;

    //return the images filenames to handlebars
    let avatarImgNames = avatarFileReader();

    res.locals.avatarImgNames = avatarImgNames;
    res.render("new-account");
});

router.post("/newAccount", async function(req, res) {
    const user = {
        username: req.body.new_account_username,
        password: await passwordSec.newHashPassword(req.body.password1),
        fname: req.body.fname,
        lname: req.body.lname,
        birthday: req.body.birthday,
        introduction: req.body.introduction,
        avatarImage: req.body.avatars
    };

    try {
        await userDao.createUser(user);
        res.redirect("/login?message=Account creation successful. Please login using your new credentials.");
    }
    catch (err) {
        res.redirect("/newAccount?message=That username was just taken by someone else!");
    }
});

router.get("/login", function(req, res) {
    res.locals.yeti = true;
    res.locals.message = req.query.message;
    res.render("login");
});

//used uuid as authToken
router.post("/login", async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    const passwordCorrect = await passwordSec.checkHashPassword(username, password); 
    
    if (passwordCorrect) {
        //Auth success - give that user an authToken, save the token in a cookie, and redirect to the homepage.
        
        const user = await userDao.retrieveUserByUsername(username); 
        
        const authToken = uuid();
        user.authToken = authToken;

        await userDao.updateUser(user);

        res.cookie("authToken", authToken);

        res.locals.user = user;
        res.redirect("/?message=Welcome Back!");
    } else {
        res.locals.user = null;
        res.redirect("./login?message=Authentication failed!");
    }
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
        const response = {
            username_availability: true
        }
        res.json(response);
    }
});

//checking whether user type in correct password in order to change user profile
router.get("/checkUserPassword", verifyAuthenticated, async function (req, res) {
    const user = res.locals.user;
    const input_password = req.query.input_password;

    const passwordCorrect = await passwordSec.checkHashPassword(user.username, input_password);     
    if (passwordCorrect) {
        const response = {
            result: true
        }
        res.json(response);

    } else {
        const response = {
            result: false
        }
        res.json(response);
    }
});

router.get("/checkAuthToken", async function (req, res) {
    const authToken = req.query.authToken;
    const user = await userDao.retrieveUserWithAuthToken(authToken);

    const usernameAndID = {
        username: user.username,
        userID: user.userID
    }
    res.json(usernameAndID)    
    
});

router.get("/login", async function(req, res) {
    res.render("login");
});

module.exports = router;