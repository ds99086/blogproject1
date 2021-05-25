// Set up the bctypt modules
const bcrypt = require('bcrypt');
const saltRounds = 10;
const userDao = require("./user-dao.js");

async function newHashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}


async function checkHashPassword(userName, password) {

    let dataBasePass = await userDao.getUserPassword(userName);
    //console.log("the password returned from the database is "+dataBasePass);

    let checkResult = await bcrypt.compareSync(password, dataBasePass);
    //console.log(checkResult);

    return checkResult;
}

module.exports = {
    newHashPassword,
    checkHashPassword,
};
