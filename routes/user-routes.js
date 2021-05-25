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
router.get("/new-aritile", async function(req, res) {


    res.render("new-aritile");
});




module.exports = router;