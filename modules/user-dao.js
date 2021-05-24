const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function createUser(user) {

    console.log("creating user");
    const db = await dbPromise;

    console.log(user);

    const result = await db.run(SQL`
    INSERT INTO users (username, passwordFieldToUpdate, firstName, lastName, dateOfBirth) VALUES(${user.username}, ${user.password}, ${user.fname}, ${user.lname}, ${user.birthday})`);

    //userData.id = result.lastID;
    console.log("created user");
}

// Export functions.
module.exports = {
    createUser
};