const fs = require("fs");

function avatarFileReader() {
    try {
        let names = fs.readdirSync("public/images/Avatars");
        const allowedFileTypes = [".png"];
        names = names.filter(function (fileName) {
            const extension = fileName.toLowerCase().substring(fileName.lastIndexOf("."));
            return allowedFileTypes.includes(extension);
        });
        return names;
    } catch (e) {
        console.error("Error "+e.name+" in function [avatarFileReader] in [avatar-file-reader]"+e.message);
        return null;
    }
}

module.exports = {avatarFileReader};