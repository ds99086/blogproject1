//const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();


// The DAO that handles CRUD operations for users.
const userDao = require("../modules/user-dao.js");
const passwordSec = require("../modules/passwordSec");
//const { createUser } = require("../modules/test-dao.js");
//const { addUserToLocals } = require("../middleware/auth-middleware.js");
//const messagesDao = require("../modules/messages-dao.js");

router.get("/newAccount", function(req, res) {
    res.locals.message = req.query.message;
    res.render("new-account");
});


router.post("/newAccount", async function(req, res) {

    const user = {
        username: req.body.username,
        password: passwordSec.hashPassword(req.body.password),
        fname: req.body.fname,
        lname: req.body.lname,
        birthday: req.body.birthday,
        description: req.body.description
    };

    try {
        await userDao.createUser(user);
        res.redirect("/home?message=Account creation successful. Please login using your new credentials.");
    }
    catch (err) {
        res.redirect("/newAccount?message=That username was already taken!");
    }

    //console.log(user);

});

//route to login page
router.get("/login", async function(req, res) {


    res.render("login");
});

module.exports = router;