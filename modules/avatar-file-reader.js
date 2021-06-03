const fs = require("fs");

function avatarFileReader() {
    let names = fs.readdirSync("public/images/Avatars");
        const allowedFileTypes = [".png"];
    names = names.filter(function (fileName) {
        const extension = fileName.toLowerCase().substring(fileName.lastIndexOf("."));
        return allowedFileTypes.includes(extension);
    });
    return names;
}

module.exports = {avatarFileReader};