const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function createUser(user) {
    
    const db = await dbPromise;
    
    const result = await db.run(SQL`
        INSERT INTO users (username, passwordFieldToUpdate, firstName, lastName, dateOfBirth, avatarImage) 
        VALUES(${user.username}, ${user.password}, ${user.fname}, ${user.lname}, ${user.birthday}, ${user.avatarImage})`);
}

//does not include user profile image for now. 
//user must be json object
async function updateUser(user) {

    // console.log("updateUser function received user");
     //console.log(user);

    const db = await dbPromise;

    //issue datbase not updating. not data type issue. 
    await db.run(SQL`
        update users
        set username = ${user.username}, 
        passwordFieldToUpdate = ${user.passwordFieldToUpdate},
        firstName = ${user.firstName}, 
        lastName = ${user.lastName}, 
        dateOfBirth = ${user.dateOfBirth}, 
        authToken = ${user.authToken},
        avatarImage = ${user.avatarImage}
        where userID = ${user.userID}`
        );

    // console.log("completed updating database");
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

async function retrieveUserByUserID(userID) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from users
        where userID = ${userID}`);

    return user;
}


async function retrieveUserameByUserID(userID) {
    const db = await dbPromise;
    const user = await db.get(SQL`
        select username from users
        where userID = ${userID}`);
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
    if(hashPassword != undefined){
        return hashPassword.passwordFieldToUpdate;
    } else {return undefined};
}

async function retrieveUserWithAuthToken(authToken) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from users
        where authToken = ${authToken}`);

    return user;
}

// Export functions.
module.exports = {
    createUser,
    retrieveAllUsers,
    updateUser,
    deleteUser,
    retrieveUserByUsername,
    retrieveUserByUserID,
    getUserPassword,
    retrieveUserWithAuthToken,
    retrieveUserameByUserID
};