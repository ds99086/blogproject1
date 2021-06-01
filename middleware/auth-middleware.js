const userDao = require("../modules/user-dao.js");
//const alert = require('alert');  

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

module.exports = {
    addUserToLocals,
    verifyAuthenticated
}