//const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();


// The DAO that handles CRUD operations for users.
//const userDao = require("../modules/users-dao.js");
//const { createUser } = require("../modules/users-dao.js");
//const { addUserToLocals } = require("../middleware/auth-middleware.js");
//const messagesDao = require("../modules/messages-dao.js");

router.get("/newAccount", function(req, res) {
    res.locals.message = req.query.message;
    res.render("new-account");
});


router.post("/newAccount", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const birthday = req.body.birthday;
    const description = req.body.description;

    const user = {
        username: username,
        password: password,
        name: name,
        birthday: birthday,
        description: description
    }
    console.log(user);

});

module.exports = router;