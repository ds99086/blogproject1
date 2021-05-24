const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();

// The DAO that handles CRUD operations for users.
//const userDao = require("../modules/users-dao.js");
//const { createUser } = require("../modules/users-dao.js");
//const { addUserToLocals } = require("../middleware/auth-middleware.js");
//const messagesDao = require("../modules/messages-dao.js");

router.get("/newAccount", function(req, res) {
    console.log("taking you to new page");
    res.locals.message = req.query.message;
    res.render("new-account");
});