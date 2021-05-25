const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function readArticle(articleID) {

    return null;
}

async function writeNewArticle(articleObject) {
    return null;
}

async function writeUpdateArticle(articleObject) {
    return null;
}

async function readAuthor(articleID) {
    return author;
}

//Export funcitons
module.exports = {
    readArticle,
    writeNewArticle,
    writeUpdateArticle,
    readAuthor,
}