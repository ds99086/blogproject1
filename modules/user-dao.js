const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function createUser(user) {
    
    const db = await dbPromise;
    
    const result = await db.run(SQL`
    INSERT INTO users (username, passwordFieldToUpdate, firstName, lastName, dateOfBirth) VALUES(${user.username}, ${user.password}, ${user.fname}, ${user.lname}, ${user.birthday})`);
}

// async function retrieveUserWithCredentials(username, password) {
//     const db = await dbPromise;
  
//     if (await checkHashPassword(username, password)) {
//         retrieveUserByUsername(username);
//     }

//     console.log(checkPassword);
//     console.log(await getUserPassword(username));

//     const user = await db.get(SQL`
//         select * from users
//         where username = ${username} and passwordFieldToUpdate = ${password}`);

//         return user;
// }

//does not include user profile image for now. 
//user must be json object
async function updateUser(user) {

    // console.log("updateUser function received user");
    // console.log(user);

    const db = await dbPromise;

    //issue datbase not updating. not data type issue. 
    await db.run(SQL`
        update users
        set username = ${user.username}, 
        passwordFieldToUpdate = ${user.passwordFieldToUpdate},
        firstName = 'Allie', 
        lastName = ${user.lname}, 
        
        dateOfBirth = ${user.dateOfBirth}, 
        authToken = ${user.authToken}
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
    retrieveUserByUsername,
    getUserPassword
};