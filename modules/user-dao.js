const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function createUser(user) {
    
    const db = await dbPromise;


    
    const result = await db.run(SQL`
    INSERT INTO users (username, passwordFieldToUpdate, firstName, lastName, dateOfBirth) VALUES(${user.username}, ${user.password}, ${user.fname}, ${user.lname}, ${user.birthday})`);

    console.log("created user");
}

async function retrieveUserWithCredentials(username, password) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from users
        where username = ${username} and passwordFieldToUpdate = ${password}`);
    return user;
}

//does not include user profile image for now. 
//user must be json object
async function updateUser(user) {
    const db = await dbPromise;

    await db.run(SQL`
        update users
        set username = ${user.username}, password = ${user.password},
            name = ${user.name}, authToken = ${user.authToken}
        where id = ${user.id}`);
}


async function retrieveAllUsers() {
    const db = await dbPromise;
    const users = await db.all(SQL`select * from users`);

    return users;
}

async function retrieveUserByUsername(username) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from users
        where username = ${username}`);

    return user;
}

//need to update
//delete user will also delete user's articles and comments
async function deleteUser(username) {
    const db = await dbPromise;
    
    await db.run(SQL`
        delete from users
        where username = ${username}`);

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
    retrieveAllUsers,
    updateUser,
    deleteUser,
    retrieveUserWithCredentials,
    retrieveUserByUsername,
    getUserPassword
};