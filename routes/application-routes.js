const express = require("express");
const router = express.Router();
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
//const testDao = require("../modules/test-dao.js");

router.get("/", verifyAuthenticated, function(req, res) {

    console.log("I am at main /");

    res.locals.title = "My route title!";
    //res.locals.allTestData = await testDao.retrieveAllTestData();
    //res.locals.message = req.query.message;
    const user = res.locals.user;
    if (user) {
        console.log("user logged in");
    }

    res.render("home");

});





module.exports = router;