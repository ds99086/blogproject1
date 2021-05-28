window.addEventListener("load", async function () {

    const username_input = document.getElementById("new_acount_username");
    const password1_input = document.getElementById("new_account_password1");
    const password2_input = document.getElementById("new_account_password2");
    const username_alert_message = document.getElementById("username_alert_message");
    const password_alert_message = document.getElementById("password_alert_message");
    const create_account_button = document.getElementById("create_account_btn");
    const single_article_div = document.querySelector("#signle-article");
    const homepage_articles_div = document.querySelector("#articles-inner")
    const list_of_replybtn = document.getElementsByClassName("comment-reply");
    

    //const vote_up = document.getElementsByClassName("vote-up");
    //const vote_down = document.getElementsByClassName("vote-down");
    
    const writeNewArticlePageElements = document.querySelector(".editor")

    //if we are on the homepage
    if (homepage_articles_div != undefined) {
        //Variables to control where the application is with loading articles and how many it should load at a time
        const loadArticleCount = 5;
        let loadArticleNext = 0;

        //load articles title on oage
        displayNextArticlesOnPage();
        document.querySelector('#article-load-button').addEventListener("click", displayNextArticlesOnPage);

        async function displayNextArticlesOnPage() {
            document.querySelector('#article-load-button').removeEventListener("click", displayNextArticlesOnPage);
        
            let articlesJsonArray = await getArticleArray(loadArticleNext, loadArticleCount);
        
            for (let i = 0; i < articlesJsonArray.length; i++) {
                displayPartialArticleOnPage(articlesJsonArray[i]);
            }
        
            if (articlesJsonArray.length < loadArticleCount) {
                document.querySelector('#article-load-button').style.background = "red";
                document.querySelector('#article-load-button').innerText = "No more articles";
            } else {
                document.querySelector('#article-load-button').addEventListener("click", displayNextArticlesOnPage);
                loadArticleNext += loadArticleCount;
            }
        }
        
        async function displayPartialArticleOnPage(articleObj) {
            let articleDivElement = document.createElement("div");
            articleDivElement.classList.add("article");
            let authorID = articleObj.authorID;
            let userJSON = await getArticleAuthorName(authorID);
        
            articleDivElement.innerHTML = `
                <h3 class="article-title"><a href="./article-details?articleID=${articleObj.articleID}">${articleObj.title}</a></h3>
                <h4 class="article-author" author-username="${userJSON.username}">Published by:${userJSON.username}</h4>
                <h6 class="article-publishDate" data-publishDate="${articleObj.publishDate}">Published on: ${articleObj.publishDate} </h6>
                <p class="article-body"></p>
                <div class="article-read-more button" data-article-id="${articleObj.articleID}">Show full content</div>
            `;
        
            let articlesDiv = document.querySelector("#articles-inner");
            articlesDiv.appendChild(articleDivElement);
        
            articleDivElement.querySelector('.article-read-more').addEventListener('click', e => {
                if (e.target.innerText == "Show full content") {
                    let articleContentDiv = e.target.previousElementSibling;
                    articleContentDiv.innerHTML = `${articleObj.bodyContentOrLinkToContent}`;
                    let readMoreButtonDiv = e.target;
                    readMoreButtonDiv.innerText = 'Close full content';
                } else if (e.target.innerText == "Close full content") {
                    let articleContentDiv = e.target.previousElementSibling;
                    articleContentDiv.innerHTML = ``;
                    let readMoreButtonDiv = e.target;
                    readMoreButtonDiv.innerText = 'Show full content';
                }
            });
        }
        
        //get artiles array base on the ariticle numbers on page now
        async function getArticleArray(from, count) {
            let articlesResponseObj = await fetch(`./loadHomepageArticles?from=${from}&number=${count}`);
            let articlesJsonArray = await articlesResponseObj.json();
            // console.log(articlesJsonArray)
            return articlesJsonArray;
        }
        
        async function getArticleAuthorName(userID) {
            let authorNameResponseObj = await fetch(`./loadArticleAutherName?articleID=${userID}`);
            let authorNameJson = await authorNameResponseObj.json();
            return authorNameJson;
        }
    }    

    //this this checking whether we are on the new account page
    //then add event listener to monitor the input
    if (username_alert_message) {
        username_input.addEventListener('input', async function (event) {
            if (await checkUsernameExist(username_input)) {
                username_alert_message.innerHTML = `Username is not available`;
                create_account_button.disabled = true;
            } else {
                username_alert_message.innerHTML = `Username is available`;
                create_account_button.disabled = false;
            }
        });

        password2_input.addEventListener('input', function (event) {
            if (checkUserPasswordConsistency(password1_input, password2_input)) {
                password_alert_message.innerHTML = `Matching password`;
                create_account_button.disabled = false;
            } else {
                password_alert_message.innerHTML = `Password does not match!`;
                create_account_button.disabled = true;
            }
        });

        userAvatarChangeLiveUpdate();
    };


    //if we are on the signle account page
    //get the articleID from cookies and use js to display the article
    if(single_article_div!=undefined){
        const article_ID = getCookie("articleID");
        const article = await retrieveArticleByArticleID(article_ID);
        single_article_div.innerHTML = `<h3 class="article-title"><${article.articleTitle}</a></h3>
        <h4 class="article-author" author-username="${article.articleAuthorUsername}">Published by:${article.articleAuthorUsername}</h4>
        <h6 class="article-publishDate" data-publishDate="${article.articlePubDate}">Published on: ${article.articlePubDate} </h6>
        <p class="article-body">${article.articleContent}</p>`
    }


    //if we have a list of reply butons - the single article page has comments
    //add eventlistener for each buttons to create new-comment form. 
    //add eventlistener for each submit button to send the form. 
    //console.log(list_of_replybtn);
    if(list_of_replybtn) {
        for (let i = 0; i < list_of_replybtn.length; i++) {
            replybtn = list_of_replybtn[i];
            //console.log(replybtn);
            replybtn.addEventListener('click', e => {
                if (e.target.innerText == "Reply") {
                    let buttonDiv = e.target;
                    buttonDiv.innerHTML = "Cancel";
                    const replyDiv = document.createElement("div");
                    buttonDiv.parentElement.parentElement.appendChild(replyDiv);
                    replyDiv.innerHTML=`
                    <div class="new-comment-box">
                        <div class="flex-col mb">
                            <input type="hidden" name="parentcomment" id="parentcomment" value="">
                            <label for="txtReply">Leave your comment:</label>
                            <input type="text" name="commentText" id="txtReply" required>
                        </div>
                        <div class="flex-row justify-sb align-center">
                        <button class="reply-submit">Submit</button>
                        </div>
                    </div>
                    `;
                } else if (e.target.innerText == "Cancel") {
                    let buttonDiv = e.target;
                    buttonDiv.innerHTML = "Reply";
                    let replyDiv = e.target.parentElement.parentElement.lastChild;
                    replyDiv.remove();
                }
                

                // const list_of_submitform = document.querySelectorAll("form.commentReplyForm");
                //console.log(list_of_submitform);
                const list_of_submitbtn = document.getElementsByClassName("reply-submit");
                
                for (let j = 0; j < list_of_submitbtn.length; j++) {
                    const submitbtn = list_of_submitbtn[j];
                    const parentCommentId = submitbtn.parentElement.parentElement.parentElement.parentElement.id;   
                    const replyContentDiv = submitbtn.parentElement.previousElementSibling.lastElementChild;
                    //console.log(replyContentDiv);

                    submitbtn.addEventListener('click', async e => {
                        const replyContent = replyContentDiv.value;
                        const parentComment = parentCommentId;
                        const articleID = getCookie("articleID");
                        console.log(articleID);
                        // console.log(parentCommentId);
                        //console.log(replyContent);

                        const response = await createReplyToComment(parentComment, replyContent, articleID);


                    })
                  
                    
                    

                    // const parentcommentIDcontainer = targetbtn.parentElement.parentElement.firstElementChild.firstElementChild;
                    // console.log(parentcommentIDcontainer);
                
                // 

                //     form.addEventListener('submit', e => {
                        
                //         e.preventDefault();
                //         console.log("paused form submit");
                        
                //         parentcommentIDcontainer.value = parentCommentId;
                //         form.submit();
                        
                        
                    // })
                    
                }

                //console.log(list_of_submitreplybtn);
            }
        )
    }};



    //check whether we are on article writing page.
    //if so, get the username and userID by cookie
    // if(writeNewArticlePageElements!=undefined){
    //     const usernameArea = document.querySelector(".articleAuthorusername")
    //     console.log(usernameArea)

    //     const authToken = getCookie("authToken");
    //     console.log(authToken)
    //     const usernameAndID = await retrieveUserByAuthToken(authToken);
    //     console.log(usernameAndID)
        
    //     usernameArea.setAttribute("value", `${usernameAndID.username}`)

    // }


    // in the window.addEventListener call the avatar live update function

//WORK IN PROGRESS
    //Trialing comment upvote downvote system
    //if comment box exists, then add event listner to monitor button clicked.
    // if (vote_up) {
    //     const vote_sum = document.querySelector("vote-sum");
    //     console.log(vote_sum);
    //     vote_up.forEach(item => {
    //         item.addEventListener('click', event => {
    //             vote_sum ++;
    //         })
    //     })
    // };


        //     item.addEventListener('click', function(event){
        //     console.log("I am detecting vote up");
        //     vote_sum ++;
        // })}
        // // vote_down.addEventListener('click', function(event) {
        // //     vote_sum --;
        // // });
    
})

// async function retrieveUserByAuthToken(authToken){
//     let response = await fetch(`./checkAuthToken?authToken=${authToken}`);
//     let usernameAndIDObj = await response.json();
//     return usernameAndIDObj;
// }

// //get cookie by attribute from client side
// function getCookie(cname) {
//     const name = `${cname}=`;
//     const decodedCookie = decodeURIComponent(document.cookie); 
//     const cookieArray = decodedCookie.split(";");
//     for(let i = 0; i <cookieArray.length; i++) {
//         let cookie = cookieArray[i].trim(); 
//         if (cookie.indexOf(name) === 0) {
//             return cookie.substring(name.length); }
//     }
//     return undefined; 
// }




async function retrieveUserByUsername(id) {
    let response = await fetch(`./checkUsername?input_username=${id}`);
    let username_availability_obj = await response.json();
    return username_availability_obj;
}

async function retrieveArticleByArticleID(articleID){
    let response = await fetch(`./articleJSON?articleID=${articleID}`)
    let articleObj = await response.json();
    return articleObj;
}

function userAvatarChangeLiveUpdate() {
    //get user choice of avatar, show the avatar picture live in the div
    const user_avatar_update_div = document.querySelector(".AvatarDiv");
    const user_avatar_choice_input = document.querySelector("#avatarID");
    user_avatar_update_div.innerHTML = `<img src="/images/Avatars/${user_avatar_choice_input.value}.png" class="avatarIcon">`
    user_avatar_choice_input.onchange = function () { changeAvatarIcon() };
    function changeAvatarIcon() {
        let user_avatar_choice_input = document.querySelector("#avatarID");
        user_avatar_update_div.innerHTML = `<img src="/images/Avatars/${user_avatar_choice_input.value}.png" class="avatarIcon">`
    };
};

//check whether the username has already taken
//if the username exist, return true, otherwise return false
async function checkUsernameExist(username_input) {
    const user_input = username_input.value;
    const response = await retrieveUserByUsername(user_input);
    if (response.username_availability == false) {
        return true;
    } else {
        return false;
    };
};

//check the re-enter password is consist or not.
//if consist, return true, otherwise return false
function checkUserPasswordConsistency(password1_input, password2_input) {
    const password1_value = password1_input.value;
    const password2_value = password2_input.value;
    if (password1_value != password2_value) {
        return false;
    } else {
        return true
    };
};

//client side get cookies function
function getCookie(cname) {
    const name = `${cname}=`;
    const decodedCookie = decodeURIComponent(document.cookie); 
    const cookieArray = decodedCookie.split(";");
    for(let i = 0; i <cookieArray.length; i++) {
        let cookie = cookieArray[i].trim(); 
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length); }
    }
    return undefined; 
}

async function createReplyToComment(parentComment, replyContent, articleID) {
    const response = await fetch(`./replyComment?parentCommentID=${parentComment}&replyContent=${replyContent}&articleID=${articleID}`);

    return response;
}


