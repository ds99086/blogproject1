/**
 * Main application file.
 */

// Setup Express
const express = require("express");
const app = express();
const port = 3000;

// Setup Handlebars
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Setup body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

// Setup cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Make the "public" folder available statically
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// Setup our middleware
const { addUserToLocals } = require("./middleware/auth-middleware.js");
app.use(addUserToLocals);

//SETUP OUR ROUTERS
// Setup general application routes
// Setup routes
const appRouter = require("./routes/application-routes.js");
app.use(appRouter);
// Setup authentication routes
const authRouter = require("./routes/auth-routes.js");
app.use(authRouter);
// Setup user routes
const userRouter = require("./routes/user-routes.js");
app.use(userRouter);
// Setup article routes
const articleRouter = require("./routes/article-routes.js");
app.use(articleRouter);
// Setup comment routes
const commentRouter = require("./routes/comment-routes.js");
app.use(commentRouter);
//setip vote routes
const voteRouter = require("./routes/vote-routes.js");
app.use(voteRouter);
// Setup API routes
const apiRouter = require("./routes/api-routes.js");
app.use(apiRouter);

// Start the server running.
app.listen(port, function () {
    console.log(`App listening on port ${port}!`);
});