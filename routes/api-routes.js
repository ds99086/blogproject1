const { Router } = require("express");
const router = Router();
const userDao = require("../modules/user-dao.js");
const passwordSec = require("../modules/passwordSec.js");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");

router.get("/api", async function (req, res) {
    res.status(200).send('this is the 200 request page for API');
});

router.post("/api/login", async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const passwordCorrect = await passwordSec.checkHashPassword(username, password);

    if (passwordCorrect) {
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
    user.authToken = "";
    await userDao.updateUser(user);
    res.clearCookie("authToken");
    res.locals.user = null;
    res.status(204).send("Logout Successful");
});

router.get("/api/users", verifyAuthenticated, async function (req, res) {
    console.log("getting all users");
    const user = res.locals.user;
    const adminstratorLevel = await userDao.checkUserAdminStatusByAuthToken(user.authToken);
    if (adminstratorLevel >=2 ) {
        console.log("admin access granted, retreving all users");
        const users = await userDao.retrieveAllUsers();
        console.log("sending all users");
        res.status(204).send(users);
    } else {
        res.status(401).send("error, users could not be retrieved");
    }
});

<<<<<<< HEAD
router.delete("/api/users/:userID", verifyAuthenticated, async function (req, res) {
    const authToken = req.query.authToken;
    const adminstratorLevel = await userDao.checkUserAdminStatusByAuthToken(authToken);
    const user = req.userID;
    if (adminstratorLevel >=2 ) {
        console.log("request to delete user " + userID);
        await userDao.deleteUser(userID);
        //Some logic to confirm the deletion was successful
        const deleteSuccess = true;
        if (deleteSuccess) {
            res.status(204).send("user " + userID + " was deleted");
        } else {
            res.status(401).send("error, administration access granted but user" + userID + " could not be deleted;")
        }
=======
router.delete("/api/users/:userID", async function (req, res) {
    //Need some logic here where we confirm user is an admin
    //e.g. const user = res.locals.user;
    // adminStatus = userDao.checkUserAdminStatus(user.userID)
    // if adminStatus (show the things) else (send error)
    const user = req.userID;
    console.log("request to delete user " + user);
    await commentDao.updateCommentsAfterUserAccountDelete(user);
    await articleDao.updateArticlesAfterUserAccountDelete(user);
    await userDao.deleteUser(user);
    //Some logic to confirm the deletion was successful
    const deleteSuccess = true;
    if (deleteSuccess) {
        res.status(204).send("user " + user + " was deleted");
>>>>>>> master
    } else {
        res.status(401).send("error, user " + userID + " could not be deleted;");
    }
});

//this must be the last to prevent blocking desired pages as it 
//forwards all requests to 404
router.get('*', function (req, res) {
    res.status(404);
    res.locals.badurl = req.url;
    res.render("./404-page-not-found")
});

router.post('*', function (req, res) {
    res.status(404);
    res.locals.badurl = req.url;
    res.render("./404-page-not-found")
});

module.exports = router;