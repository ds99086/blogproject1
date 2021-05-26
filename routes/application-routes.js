const express = require("express");
const router = express.Router();

//const testDao = require("../modules/test-dao.js");

router.get("/", function(req, res) {

    res.locals.title = "My route title!";
    //res.locals.allTestData = await testDao.retrieveAllTestData();
    res.locals.message = req.query.message;


    res.render("home");
});





module.exports = router;