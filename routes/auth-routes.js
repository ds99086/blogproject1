const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();


// The DAO that handles CRUD operations for users.
const userDao = require("../modules/user-dao.js");
const passwordSec = require("../modules/passwordSec.js");
const { getUserPassword } = require("../modules/user-dao.js");
//const { createUser } = require("../modules/test-dao.js");
//const { addUserToLocals } = require("../middleware/auth-middleware.js");
//const messagesDao = require("../modules/messages-dao.js");

router.get("/newAccount", function(req, res) {
    res.locals.message = req.query.message;
    res.render("new-account");
});

router.post("/newAccount", async function(req, res) {
    const user = {
        username: req.body.new_account_username,
        password: await passwordSec.newHashPassword(req.body.password1),
        fname: req.body.fname,
        lname: req.body.lname,
        birthday: req.body.birthday,
        description: req.body.description
    };

    try {
        await userDao.createUser(user);
        res.redirect("/login?message=Account creation successful. Please login using your new credentials.");
    }
    catch (err) {
        res.redirect("/newAccount?message=That username was already taken!");
    }
});

router.get("/login", function(req, res) {
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
        // console.log("Before updating with authToken");
        // console.log(user);
        
        const authToken = uuid();
        user.authToken = authToken;

        // console.log("Give authToken to this user.");
        // console.log(user);

        await userDao.updateUser(user);
        // console.log("After updating with authToken, call the same user const");
        // console.log(user);

        // const checkuser = await userDao.retrieveUserByUsername(username);
        
        // console.log("After updating with authToken, call the same user with ANOTHER const");
        // console.log(checkuser);

        res.cookie("authToken", authToken);
        res.locals.user = user;
        res.redirect("/");
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
        //console.log("This username is good to go!");
        const response = {
            username_availability: true
        }
        res.json(response);
    }
});

//route to login page
router.get("/login", async function(req, res) {

    res.render("login");
});

module.exports = router;