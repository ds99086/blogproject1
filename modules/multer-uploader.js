// Setup multer (files will temporarily be saved in the "temp" folder).
const path = require("path");
const multer = require("multer");

// Setup fs
// const fs = require("fs");

const upload = multer({
    dest: path.join(__dirname, "../public/userUploads/temp")
});

// Export the "upload" object, which we can use to actually accept file uploads.
module.exports = upload;