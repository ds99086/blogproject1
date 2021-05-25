const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function createUser(user) {

    console.log("creating user");
    const db = await dbPromise;

    const result = await db.run(SQL`
    INSERT INTO users (username, passwordFieldToUpdate, firstName, lastName, dateOfBirth) VALUES(${user.username}, ${user.password}, ${user.fname}, ${user.lname}, ${user.birthday})`);

    console.log("created user");
}

async function getUserPassword(username) {
    //console.log(`Getting the password of ${username}`);
    const db = await dbPromise;
    const hashPassword = await db.get(SQL`SELECT passwordFieldToUpdate FROM users WHERE username = ${username}`);
    return hashPassword.passwordFieldToUpdate;
}

// Export functions.
module.exports = {
    createUser,
    getUserPassword
};