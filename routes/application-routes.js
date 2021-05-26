const express = require("express");
const router = express.Router();
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
//const testDao = require("../modules/test-dao.js");

router.get("/",function(req, res) {

    res.locals.title = "My route title!";
    //res.locals.allTestData = await testDao.retrieveAllTestData();
    res.locals.message = req.query.message;

    //res.locals.message = req.query.message;
    // const user = res.locals.user;
    res.render("home");

});


module.exports = router;