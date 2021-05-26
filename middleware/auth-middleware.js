const userDao = require("../modules/user-dao.js");

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
    // else {
    //     res.redirect("./login");
    // }
}

module.exports = {
    addUserToLocals,
    verifyAuthenticated
}