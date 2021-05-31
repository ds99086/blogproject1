const express = require("express");
const router = express.Router();

const userDao = require("../modules/user-dao.js");
const passwordSec = require("../modules/passwordSec.js");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const { getUserPassword } = require("../modules/user-dao.js");

router.get("/api", async function (req, res){
    res.status(200).send('this is the 200 request page for API');
});


router.post("/api/login", async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    const passwordCorrect = await passwordSec.checkHashPassword(username, password); 
    
    if (passwordCorrect) {
        //Auth success - give that user an authToken, save the token in a cookie, and redirect to the homepage.
        
        const user = await userDao.retrieveUserByUsername(username); 
        
        const authToken = uuid();
        user.authToken = authToken;

        await userDao.updateUser(user);

        res.status(204).send(authToken);

    } else {
        res.status(401).send("Login failed.");
    }
});


router.get("/api/logout", verifyAuthenticated, async function (req, res) {

    const user = res.locals.user;
    
    //delete user's authToken
    user.authToken = "";
    await userDao.updateUser(user);

    //clear cookies
    res.clearCookie("authToken");
    //set locals.user to null
    res.locals.user = null;

    //redirect to home page with the message
    res.status(204).send("Logout Successful");
});

router.get("/api/users", verifyAuthenticated, async function(req, res) {
    console.log("getting all users");
    //Need some logic here where we confirm user is an admin
    //e.g. const user = res.locals.user;
    // adminStatus = userDao.checkUserAdminStatus(user.userID)
    // if adminStatus (show the things) else (send error)
    const users = await userDao.retrieveAllUsers();
    console.log("sending all users");
    res.status(204).send(users);
});

router.delete("/api/users/:userID", verifyAuthenticated, async function(req, res) {
    //Need some logic here where we confirm user is an admin
    //e.g. const user = res.locals.user;
    // adminStatus = userDao.checkUserAdminStatus(user.userID)
    // if adminStatus (show the things) else (send error)
    const user = req.userID;
    console.log("request to delete user "+user);
    await userDao.deleteUser(user);
    //Some logic to confirm the deletion was successful
    const deleteSuccess = true;
    if (deleteSuccess) {
        res.status(204).send("user "+user+" was deleted");
    } else {
        res.status(401).send("error, user "+user+" could not be deleted;");
    }
});



router.get('*', function(req, res){
    res.status(404);
    res.locals.badurl = req.url;
    res.render("./404-page-not-found")
  });


  module.exports = router;