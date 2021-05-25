const express = require("express");
const router = express.Router();

//const testDao = require("../modules/test-dao.js");

router.get("/profile-setting", async function(req, res) {


    res.render("profile");
});


router.get("/logout", async function(req, res) {


    res.redirect("home");
});


//route to new aritile
router.get("/new-article", async function(req, res) {

    res.locals.WYSIWYG = true;
    res.render("new-article");
});


//route to user ariticles
router.get("/user-articles", async function(req, res) {


    res.render("user-articles");
});



module.exports = router;