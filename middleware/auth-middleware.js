const userDao = require("../modules/user-dao.js");
const alert = require("alert")

//called by app.js to authenticate the user on every route
async function addUserToLocals(req, res, next) {
    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
    res.locals.user = user;
    next();
}

//call this to identify whether user is logged in
//if user is not logged in it will redirect to 'permission denied' page. 
function verifyAuthenticated(req, res, next) {
    if (res.locals.user) {
        //log permission granted
        next();
    }
    else {
        //log access denied
        res.render("permission-denied");
    }
}

//if user is not logged in it will alert the user. 
function verifyAuthenticatedWithAlertOnly(req, res, next) {
    if (res.locals.user) {
        //log permission granted
        next();
    }
    else {
        //log access denied
        alert('You need to login before doing this!');
    }
}

async function apiVerifyAdminIdentity(req, res, next) {
        const user = await userDao.retrieveUserWithAuthToken(req.query.authToken); 
        if (user.adminstratorLevel>1) {
            next();
        }
        else {
            //log access denied
        }
}


module.exports = {
    addUserToLocals,
    verifyAuthenticated,
    verifyAuthenticatedWithAlertOnly,
    apiVerifyAdminIdentity
}