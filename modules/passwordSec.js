const bcrypt = require('bcrypt');
const saltRounds = 10;
const userDao = require("./user-dao.js");

async function newHashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

async function checkHashPassword(userName, password) {
    let dataBasePass = await userDao.getUserPassword(userName);

    if (dataBasePass == undefined) {
        return false
    } else {
        let checkResult = await bcrypt.compareSync(password, dataBasePass);
        return checkResult;
    }
}

module.exports = {
    newHashPassword,
    checkHashPassword,
};
