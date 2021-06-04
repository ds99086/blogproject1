const { Router } = require("express");
const { v4: uuid } = require("uuid");
const router = Router();
const userDao = require("../modules/user-dao.js");
const commentDao = require("../modules/comment-dao.js");
const articleDao = require("../modules/article-dao.js");
const passwordSec = require("../modules/passwordSec.js");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");

/*
API general route
Can be tested from powershell with Invoke-WebRequest 'http://localhost:3000/api'
*/

router.get("/api", async function (req, res) {
    res.status(200).send('this is the 200 request page for API');
});

/*
* API for logging in
* Can be tested from powershell with 
* Invoke-WebRequest 'http://localhost:3000/api/login' -SessionVariable 'Session' -Body @{username = 'enigmaCracker'; password = 'password'} -Method 'POST'
*/
router.post("/api/login", async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const passwordCorrect = await passwordSec.checkHashPassword(username, password);

    if (passwordCorrect) {
        const user = await userDao.retrieveUserByUsername(username);
        const authToken = uuid();
        user.authToken = authToken;
        await userDao.updateUser(user);
        res.header('authToken', authToken)
        res.status(204).send("login successful");
    } else {
        res.status(401).send("Login failed.");
    }
});

/*
* Logs a user out, requires the userID and authToken to match in Get request, see example below
* Invoke-WebRequest -uri "http://localhost:3000/api/logout?userID=4&authToken=a9e846b2-8ecd-4f0f-8467-f2db57e48c3c"
*/
router.get("/api/logout", async function (req, res) {
    if (req.query.authToken && req.query.userID) {
        const authToken = req.query.authToken;
        const user = await userDao.retrieveUserByUserID(req.query.userID);
        if (user.authToken==authToken) {
            user.authToken = null;
            await userDao.updateUser(user);
            res.status(204).send("Logout Successful");
    }       else {
            res.status(401).send("Logout failed");
        }
    } else {
        res.status(401).send("Logout failed");
    }
    
});

/*
* Gets a list of users and number of articles if the user is an administrator.
* Invoke-WebRequest -uri "http://localhost:3000/api/users?userID=4&authToken=a9e846b2-8ecd-4f0f-8467-f2db57e48c3c"
*/

router.get("/api/users", async function (req, res) {
    if (req.query.authToken && req.query.userID) {
        const authToken = req.query.authToken;
        const user = await userDao.retrieveUserByUserID(req.query.userID);
        if (user.authToken==authToken) {
            const adminstratorLevel = await userDao.checkUserAdminStatusByAuthToken(user.authToken);
            if (adminstratorLevel >=2 ) {
                const userReport = await userDao.userReport();
                res.status(200).send(userReport);
            } else {
                res.status(401).send("error, users could not be retrieved");
                }
        } else {
            res.status(401).send("error, users could not be retrieved");
        }
    }
});

/*API For deletion of a user
* Invoke-WebRequest -uri "http://localhost:3000/api/users/1?userID=4&authToken=a9e846b2-8ecd-4f0f-8467-f2db57e48c3c" -Method 'DELETE'
*/

router.delete("/api/users/:userID", async function (req, res) {
    if (req.query.authToken && req.query.userID) {
        const authToken = req.query.authToken;
        const user = await userDao.retrieveUserByUserID(req.query.userID);
        const targetUser = req.params.userID;
        console.log(req.params);
        console.log("aiming to delete "+targetUser);
        if (user.authToken==authToken) {
            const adminstratorLevel = await userDao.checkUserAdminStatusByAuthToken(user.authToken);
            if (adminstratorLevel >=2 ) {
                await commentDao.updateCommentsAfterUserAccountDelete(targetUser);
                await articleDao.updateArticlesAfterUserAccountDelete(targetUser);
                await userDao.deleteUser(targetUser);
                res.status(204).send("user deleted");
            } else {
                res.status(401).send("error, users could not be retrieved");
                }
        } else {
            res.status(401).send("error, users could not be retrieved");
        }
    }
});

//this must be the last to prevent blocking desired pages as it 
//forwards all requests to 404
router.get('*', function (req, res) {
    res.status(404);
    res.locals.badurl = req.url;
    res.render("./404-page-not-found")
});

router.post('*', function (req, res) {
    res.status(404);
    res.locals.badurl = req.url;
    res.render("./404-page-not-found")
});

module.exports = router;


/* Demonstration of API routes working on powershell:

PS C:\Users\nicho> Invoke-WebRequest 'http://localhost:3000/api'

                                                                                                                        StatusCode        : 200                                                                                                 StatusDescription : OK                                                                                                  Content           : this is the 200 request page for API                                                                RawContent        : HTTP/1.1 200 OK
                    Connection: keep-alive
                    Keep-Alive: timeout=5                                                                                                   Content-Length: 36                                                                                                      Content-Type: text/html; charset=utf-8                                                                                  Date: Fri, 04 Jun 2021 11:53:30 GMT                                                                                     ETag: W/"24-gXmLKQXN/eJmkftB/CMYqtSdrxA...
Forms             : {}
Headers           : {[Connection, keep-alive], [Keep-Alive, timeout=5], [Content-Length, 36], [Content-Type,
                    text/html; charset=utf-8]...}
Images            : {}
InputFields       : {}
Links             : {}
ParsedHtml        : mshtml.HTMLDocumentClass
RawContentLength  : 36



PS C:\Users\nicho> Invoke-WebRequest 'http://localhost:3000/api/login' -SessionVariable 'Session' -Body @{username = 'enigmaCracker'; password = 'password'} -Method 'POST'


StatusCode        : 204
StatusDescription : No Content
Content           : {}
RawContent        : HTTP/1.1 204 No Content
                    authToken: a9e846b2-8ecd-4f0f-8467-f2db57e48c3c
                    Connection: keep-alive
                    Keep-Alive: timeout=5
                    Date: Fri, 04 Jun 2021 11:53:40 GMT                                                                                     ETag: W/"10-8KjjXkUl9Z2Uu1jbKKxcv8kaJRs"                                                                                ...                                                                                                 Headers           : {[authToken, a9e846b2-8ecd-4f0f-8467-f2db57e48c3c], [Connection, keep-alive], [Keep-Alive,                              timeout=5], [Date, Fri, 04 Jun 2021 11:53:40 GMT]...}
RawContentLength  : 0



PS C:\Users\nicho> Invoke-WebRequest -uri "http://localhost:3000/api/users?userID=4&authToken=e7a49b44-d059-4d08-bec9-f3da3221a3a7"
Invoke-WebRequest : error, users could not be retrieved
At line:1 char:1
+ Invoke-WebRequest -uri "http://localhost:3000/api/users?userID=4&auth ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : InvalidOperation: (System.Net.HttpWebRequest:HttpWebRequest) [Invoke-WebRequest], WebExc
   eption
    + FullyQualifiedErrorId : WebCmdletWebResponseException,Microsoft.PowerShell.Commands.InvokeWebRequestCommand
PS C:\Users\nicho> Invoke-WebRequest -uri "http://localhost:3000/api/users?userID=4&authToken=a9e846b2-8ecd-4f0f-8467-f2db57e48c3c"

                                                                                                                        StatusCode        : 200                                                                                                 StatusDescription : OK                                                                                                  Content           : [{"userID":1,"username":"XeroFounder","firstName":null,"lastName":null,"dateOfBirth":null,"avatarIm                     age":"/deleteIcon","introduction":"User was deleted at 2021-06-04 11:52:01","Number of
                    Articles":1},{...
RawContent        : HTTP/1.1 200 OK
                    Connection: keep-alive
                    Keep-Alive: timeout=5
                    Content-Length: 4022
                    Content-Type: application/json; charset=utf-8
                    Date: Fri, 04 Jun 2021 11:54:16 GMT
                    ETag: W/"fb6-/LJV+Sa5L7yz+Tzxq...
Forms             : {}
Headers           : {[Connection, keep-alive], [Keep-Alive, timeout=5], [Content-Length, 4022], [Content-Type,
                    application/json; charset=utf-8]...}
Images            : {}
InputFields       : {}
Links             : {}
ParsedHtml        : mshtml.HTMLDocumentClass
RawContentLength  : 4022



PS C:\Users\nicho> Invoke-WebRequest -uri "http://localhost:3000/api/users/2?userID=4&authToken=a9e846b2-8ecd-4f0f-8467-f2db57e48c3c" -Method 'DELETE'


StatusCode        : 204
StatusDescription : No Content
Content           : {}
RawContent        : HTTP/1.1 204 No Content
                    Connection: keep-alive
                    Keep-Alive: timeout=5
                    Date: Fri, 04 Jun 2021 11:54:38 GMT
                    ETag: W/"c-EbuVfgfvIi8rYYV6WG5D2rLtqo8"
                    X-Powered-By: Express


Headers           : {[Connection, keep-alive], [Keep-Alive, timeout=5], [Date, Fri, 04 Jun 2021 11:54:38 GMT], [ETag,
                    W/"c-EbuVfgfvIi8rYYV6WG5D2rLtqo8"]...}
RawContentLength  : 0



PS C:\Users\nicho> Invoke-WebRequest -uri "http://localhost:3000/api/logout?userID=4&authToken=a9e846b2-8ecd-4f0f-8467-f2db57e48c3c"


StatusCode        : 204
StatusDescription : No Content
Content           : {}
RawContent        : HTTP/1.1 204 No Content
                    Connection: keep-alive
                    Keep-Alive: timeout=5
                    Date: Fri, 04 Jun 2021 11:55:13 GMT
                    ETag: W/"11-bcWUFSJ30HoakE1XfpyI6D6+/kY"
                    X-Powered-By: Express


Headers           : {[Connection, keep-alive], [Keep-Alive, timeout=5], [Date, Fri, 04 Jun 2021 11:55:13 GMT], [ETag,
                    W/"11-bcWUFSJ30HoakE1XfpyI6D6+/kY"]...}
RawContentLength  : 0



PS C:\Users\nicho>

*/