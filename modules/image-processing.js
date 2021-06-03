const fs = require("fs");
const jimp = require("jimp");

/*Make User Folder if none exists*/
function userFolder(user) {
    if (!fs.existsSync(`./public/userUploads/user_${user.userID}`)) {
    fs.mkdirSync(`./public/userUploads/user_${user.userID}`);
    }
}

async function uploadUserImage(user, file) {
    const fileInfo = file;
    const oldFileName = fileInfo.path;
    
    const newFileName = `./public/userUploads/user_${user.userID}/${fileInfo.originalname.replace(/\s/g, '')}_original`;
    fs.renameSync(oldFileName, newFileName);

    let imageUrl = `userUploads/user_${user.userID}/${fileInfo.originalname.replace(/\s/g, '')}`;

    const image = await jimp.read(newFileName);
    image.resize(400, jimp.AUTO);
    await image.write(`./public/userUploads/user_${user.userID}/${fileInfo.originalname.replace(/\s/g, '')}`);

    return imageUrl;
}


module.exports = {
    userFolder,
    uploadUserImage
}