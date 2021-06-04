const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function createUser(user) {
    const db = await dbPromise;
    try {    
    const result = await db.run(SQL`
        INSERT INTO users (username, hashPassword, firstName, lastName, dateOfBirth, avatarImage, introduction) 
        VALUES(${user.username}, ${user.password}, ${user.fname}, ${user.lname}, ${user.birthday}, ${user.avatarImage}, ${user.introduction})
        `);
    // server log user updated
    return result;
    } catch (e) {
        console.error("Error "+e.name+" in function [createUser] in [user-dao]"+e.message);
        return false;
    }
}

async function updateUser(user) {
    const db = await dbPromise;
    try {
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
    } catch (e) {
        console.error("Error "+e.name+" in function [updateUser] in [user-dao]"+e.message);
        return false;
    }
}

async function retrieveAllUsers() {
    const db = await dbPromise;
    try {
        const users = await db.all(SQL`select * from users`);
        return users;
    } catch (e) {
        console.error("Error "+e.name+" in function [retrieveAllUsers] in [user-dao]"+e.message);
        return null;
    }
}

async function retrieveUserByUsername(username) {
    try {
        const db = await dbPromise;
        const user = await db.get(SQL`
            select * from users
            where username = ${username}`);
        return user;
    } catch (e) {
        console.error("Error "+e.name+" in function [retrieveUserByUsername] in [user-dao]"+e.message);
        return null;
    }
}

//returns a user Object
async function retrieveUserByUserID(userID) {
    const db = await dbPromise;
    try {
        const user = await db.get(SQL`
            select * from users
            where userID = ${userID}`);
        return user;
    } catch (e) {
        console.error("Error "+e.name+" in function [retrieveUserByUserID] in [user-dao]"+e.message);
        return null;
    }
}

//returns a user JSON with username
async function retrieveUsernameByUserID(userID) {
    const db = await dbPromise;
    try {
        const username = await db.get(SQL`
            select username from users
            where userID = ${userID}`);
        return username;
    } catch (e) {
        console.error("Error "+e.name+" in function [retrieveUsernameByUserID] in [user-dao]"+e.message);
        return null;
    }
}

async function deleteUser(userID) {
    const db = await dbPromise;
    try {
        const result = await db.run(SQL`
            UPDATE users
            SET hashPassword=null, firstName=null, lastName=null, dateOfBirth=null, avatarImage="/deleteIcon", authToken=null, adminstratorLevel=null, introduction='User was deleted at ' || CURRENT_TIMESTAMP 
            WHERE userID=${userID}
        `);
        return result;
    } catch (e) {
        console.error("Error "+e.name+" in function [deleteUser] in [user-dao]"+e.message);
        return false;
    }
}

async function getUserPassword(username) {
    const db = await dbPromise;
    try {
        const hashPassword = await db.get(SQL`
        SELECT hashPassword 
        FROM users 
        WHERE username = ${username}`);

        if (hashPassword != undefined) {
            return hashPassword.hashPassword;
        } else { 
            return undefined;
        };
    }catch (e) {
        console.error("Error "+e.name+" in function [getUserPassword] in [user-dao]"+e.message);
        return undefined;
    }
}

async function retrieveUserWithAuthToken(authToken) {
    const db = await dbPromise;
    try {
        const user = await db.get(SQL`
            select * from users
            where authToken = ${authToken}`);
        return user;
    } catch (e) {
        console.error("Error "+e.name+" in function [retrieveUserWithAuthToken] in [user-dao]"+e.message);
        return null;
    }
}

async function checkUserAdminStatusByAuthToken(authToken) {
    const db = await dbPromise;
    try {
        const adminstratorLevelObject = await db.get(SQL`
        SELECT adminstratorLevel 
        FROM users 
        WHERE authToken = ${authToken}`);

        let adminstratorLevel = adminstratorLevelObject.adminstratorLevel;

        if (!(adminstratorLevel > 0)) {
            return 0;
        } else { 
            return adminstratorLevel;
        };
    }catch (e) {
        console.error("Error "+e.name+" in function [getUserPassword] in [user-dao]"+e.message);
        return undefined;
    }
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
    retrieveUsernameByUserID,
    checkUserAdminStatusByAuthToken
};