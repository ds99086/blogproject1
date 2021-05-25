/**
 * This is simply to test the funcitonality of the password security module
 * 
 */

// Setup Express
const express = require("express");
const { hash } = require("jimp");
const app = express();
const port = 3000;

// Setup Security 
const passwordSec = require("./modules/passwordSec.js")
const userDao = require("./modules/user-dao.js")


let testPassword_1 = "password";
let testPassword_2 = "pa55woRd";
let testPassword_3 = "P501OGgzcUq%";

async function passwordTester(password) {
    console.log(`The password we are going to test is: ${password}`)
    console.log(`First we make a random user with that password`)
    let testUser = await genRandomUser(password);
    //console.log('User generate is:');
    //console.log(testUser);
    console.log(`Now we querey the password`);
    let result1 = await passwordSec.checkHashPassword(testUser.username, password);
    console.log("The result of check 1 is "+result1);
    console.log();

    console.log(`Now we querey a wrong password`);
    let result2 = await passwordSec.checkHashPassword(testUser.username, "wrong password");
    console.log("The result of check 2 is "+result2);
    console.log();

    console.log(`Now we querey the hash as password`);
    let result3 = await passwordSec.checkHashPassword(testUser.username, testUser.password);
    console.log("The result of check 3 is "+result3);
    console.log();

    console.log("finally we check the correct password again, but hard coded");
    let result4 = await passwordSec.checkHashPassword(testUser.username, 'password');
    console.log("Check testPassword1 is "+result4);
    let result5 = await passwordSec.checkHashPassword(testUser.username, 'pa55woRd');
    console.log("Check testPassword2 is "+result5);
    let result6 = await passwordSec.checkHashPassword(testUser.username, 'P501OGgzcUq%');
    console.log("Check testPassword3 is "+result6);
}

async function genRandomUser(password) {
    let userNumber = Math.floor(Math.random()*(999-100+1)+100).toString();
    let hashPass = await passwordSec.newHashPassword(password);
    console.log('succesfully hashed to '+hashPass);
    const newUser = {
        username: 'User_'+userNumber,
        password: hashPass,
        fname: 'User_'+userNumber+'fname',
        lname: 'User_'+userNumber+'lname',
        birthday: '2000-01-01',
        description: 'test text'
    };
    await userDao.createUser(newUser);
    return newUser;
}

async function passTestWrap() {
    console.log(`We are going to do some security tests`);
    console.log('--------------------------------------');
    console.log('starting test 1');
    await passwordTester(testPassword_1);
    console.log('test 1 complete');
    console.log('');

    console.log('--------------------------------------');
    console.log('starting test 2');
    await passwordTester(testPassword_2);
    console.log('test 2 complete');
    console.log('');

    console.log('--------------------------------------');
    console.log('starting test 3');
    await passwordTester(testPassword_3);
    console.log('test 3 complete');
    console.log('');
}

// Start the server running.
app.listen(port, function () {
    passTestWrap();
});