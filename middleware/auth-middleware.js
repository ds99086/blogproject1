const userDao = require("../modules/user-dao.js");
//const alert = require('alert');  
const alert = require("alert")

//it will automatically use authToken from cookies everytime a page opens
async function addUserToLocals(req, res, next) {
    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
    res.locals.user = user;
    next();
}

function verifyAuthenticated(req, res, next) {
    if (res.locals.user) {
        next();
    }
    else {
        console.log("An action was NOT performred as user could not be verified");
        console.log("Redirecting to the homepage");
        //alert("You are not logged in!");
        res.render("permission-denied")
    }
}

function verifyAuthenticatedWithAlertOnly(req, res, next){
    if (res.locals.user) {
        next();
    }
    else {
        // console.log("An action was NOT performred as user could not be verified");
        // console.log("show the alert");
        //alert("You are not logged in!");
        alert('You need to login before doing this!')
    }
}

module.exports = {
    addUserToLocals,
    verifyAuthenticated,
    verifyAuthenticatedWithAlertOnly
}