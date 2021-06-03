const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function createUser(user) {
    const db = await dbPromise;
    const result = await db.run(SQL`
        INSERT INTO users (username, hashPassword, firstName, lastName, dateOfBirth, avatarImage, introduction) 
        VALUES(${user.username}, ${user.password}, ${user.fname}, ${user.lname}, ${user.birthday}, ${user.avatarImage}, ${user.introduction})
        `);
    // server log user updated
    return result;
}

async function updateUser(user) {
    const db = await dbPromise;

    const result = await db.run(SQL`
        update users
        set username = ${user.username}, 
        hashPassword = ${user.hashPassword},
        firstName = ${user.firstName}, 
        lastName = ${user.lastName}, 
        dateOfBirth = ${user.dateOfBirth}, 
        authToken = ${user.authToken},
        avatarImage = ${user.avatarImage},
        introduction = ${user.introduction}
        where userID = ${user.userID}`
        );
    // server log user updated
    return result;
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

//returns a user Object
async function retrieveUserByUserID(userID) {
    const db = await dbPromise;
    const user = await db.get(SQL`
        select * from users
        where userID = ${userID}`);
    return user;
}

//returns a user JSON with username
async function retrieveUsernameByUserID(userID) {
    const db = await dbPromise;
    const username = await db.get(SQL`
        select username from users
        where userID = ${userID}`);
    return username;
}

async function deleteUser(userID) {
    const db = await dbPromise;
    const result = await db.run(SQL`
        UPDATE users
        SET hashPassword=null, firstName=null, lastName=null, dateOfBirth=null, avatarImage="/deleteIcon", authToken=null, adminstratorLevel=null, introduction='User was deleted at ' || CURRENT_TIMESTAMP 
        WHERE userID=${userID}
    `);
    return result;
}

async function getUserPassword(username) {
    const db = await dbPromise;
    const hashPassword = await db.get(SQL`
    SELECT hashPassword 
    FROM users 
    WHERE username = ${username}`);

    if (hashPassword != undefined) {
        return hashPassword.hashPassword;
    } else { 
        return undefined;
    };
}

async function retrieveUserWithAuthToken(authToken) {
    const db = await dbPromise;
    const user = await db.get(SQL`
        select * from users
        where authToken = ${authToken}`);
    return user;
}

module.exports = {
    createUser,
    retrieveAllUsers,
    updateUser,
    deleteUser,
    retrieveUserByUsername,
    retrieveUserByUserID,
    getUserPassword,
    retrieveUserWithAuthToken,
    retrieveUsernameByUserID
};