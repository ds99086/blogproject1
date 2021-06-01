let testCounter = 0;

window.addEventListener("load", async function () {

    const username_input = document.getElementById("new_acount_username");
    const password1_input = document.getElementById("new_account_password1");
    const password2_input = document.getElementById("new_account_password2");
    const username_alert_message = document.getElementById("username_alert_message");
    const password_alert_message = document.getElementById("password_alert_message");
    const create_account_button = document.getElementById("create_account_btn");
    const single_article_div = document.querySelector("#signle-article");
    const homepage_articles_div = document.querySelector("#articles-inner")
    let list_of_replybtn = document.getElementsByClassName("comment-reply");
    let list_of_deletebtn = document.getElementsByClassName("comment-delete");
    new_comment_submitbtn = document.getElementById("new-comment-submit");

    //const vote_up = document.getElementsByClassName("vote-up");
    //const vote_down = document.getElementsByClassName("vote-down");

    const writeNewArticlePageElements = document.querySelector(".editor")

    //if we are on the homepage
    if (homepage_articles_div != undefined) {
        //Variables to control where the application is with loading articles and how many it should load at a time
        const loadArticleCount = 5;
        let loadArticleNext = 0;

        //get the sorting info from the hidden elements in home page
        const article_sorting_attribute = document.querySelector(".sorting-attribute").innerText;
        const article_sorting_order = document.querySelector(".sorting-order").innerText;
        const article_sorting_filter = document.querySelector(".sorting-filter").innerText;
        const article_sorting_filter_name = document.querySelector(".sorting-filter-Name").innerText;

           

        //load articles title on oage
        displayNextArticlesOnPage();
        document.querySelector('#article-load-button').addEventListener("click", displayNextArticlesOnPage);

        async function displayNextArticlesOnPage() {
            document.querySelector('#article-load-button').removeEventListener("click", displayNextArticlesOnPage);

            let articlesJsonArray = await getArticleArray(loadArticleNext, loadArticleCount, article_sorting_attribute, article_sorting_order, article_sorting_filter_name, article_sorting_filter);
            //at this step articles are in order
            // console.log(articlesJsonArray)

            for (let i = 0; i < articlesJsonArray.length; i++) {
                //need to add await here, otherwise the article might not display in desired order!
                console.log(articlesJsonArray[i])
                await displayPartialArticleOnPage(articlesJsonArray[i]);
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
                <h3 class="article-title""><a href="./article-details?articleID=${articleObj.articleID}">${articleObj.title}</a></h3>
                <h4 class="article-author" author-username="${userJSON.username}">Published by:${userJSON.username}</h4>
                <h6 class="article-publishDate" data-publishDate="${articleObj.publishDate}">Published on: ${articleObj.publishDate} </h6>
                <p class="article-body"></p>
                <div class="article-read-more button" data-article-id="${articleObj.articleID}">Show full content</div>`;
                
                
                // <a href="./editArticle?articleID=${articleObj.articleID}"><div class="article-edit button" data-article-id="${articleObj.articleID}">Edit Article</div></a>`;


            let articlesDiv = document.querySelector("#articles-inner");
            articlesDiv.appendChild(articleDivElement);

            articleDivElement.querySelector('.article-read-more').addEventListener('click', e => {
                if (e.target.innerText == "Show full content") {
                    let articleContentDiv = e.target.previousElementSibling;
                    articleContentDiv.innerHTML = `${articleObj.bodyContentOrLinkToContent}`;
                    let readMoreButtonDiv = e.target;
                    readMoreButtonDiv.style.background = "red";
                    readMoreButtonDiv.innerText = 'Close full content';
                } else if (e.target.innerText == "Close full content") {
                    let articleContentDiv = e.target.previousElementSibling;
                    articleContentDiv.innerHTML = ``;
                    let readMoreButtonDiv = e.target;
                    readMoreButtonDiv.innerText = 'Show full content';
    
                    readMoreButtonDiv.style.background = "teal";
                }
            });
        }

        //get artiles array base on the ariticle numbers on page now
        async function getArticleArray(from, count, arttibute, order, filterName, filter) {
            let articlesResponseObj = await fetch(`./loadHomepageArticles?from=${from}&number=${count}&attribute=${arttibute}&order=${order}&filterName=${filterName}&filter=${filter}`);
            let articlesJsonArray = await articlesResponseObj.json();
        //console.log(articlesJsonArray)
            return articlesJsonArray;         
        }

        async function getArticleAuthorName(userID) {
            let authorNameResponseObj = await fetch(`./loadArticleAutherName?articleID=${userID}`);
            let authorNameJson = await authorNameResponseObj.json();
            return authorNameJson;
        }

  
        //sorting function(three sorting options)
        let sortingByDateSelection = document.getElementById("dateSorting")
        sortingByDateSelection.addEventListener('change', e=>{
            window.location.href = sortingByDateSelection.value;
        })       
        let sortingByTitleSelection = document.getElementById("titleSorting")
        sortingByTitleSelection.addEventListener('change', e=>{
            window.location.href = sortingByTitleSelection.value;
        }) 
        let sortingByUsernameSelection = document.getElementById("usernameSorting")
        sortingByUsernameSelection.addEventListener('change', e=>{
            window.location.href = sortingByUsernameSelection.value;
        })         

    }

    //if it is on the user setting page
    if(document.querySelector(".user-profile")){
        const profileUpdateBtn = document.querySelector(".profile-update-div-btn")
        const profileUpdateDiv = document.querySelector(".profile-update-div")
        profileUpdateBtn.addEventListener('click', e=>{
            profileUpdateDiv.classList.toggle("invisible-class");
            if (e.target.innerText == "Thinking about changing your information?"){
                e.target.innerText = "Never mind!"
            } else if (e.target.innerText == "Never mind!"){
                e.target.innerText = "Thinking about changing your information?"
            }
        })

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


    //need to work on here to combine comment and vote

    //if we are on the signle account page
    //get the articleID from cookies and use js to display the article
    if (single_article_div != undefined) {
        const article_ID = getCookie("articleID");
        const article = await retrieveArticleByArticleID(article_ID);
        single_article_div.innerHTML = `<h3 class="article-title"><${article.articleTitle}</a></h3>
        <h4 class="article-author" author-username="${article.articleAuthorUsername}">Published by:${article.articleAuthorUsername}</h4>
        <h6 class="article-publishDate" data-publishDate="${article.articlePubDate}">Published on: ${article.articlePubDate} </h6>
        <p class="article-body">${article.articleContent}</p>`        
    };


    //if we have a list of reply butons - the single article page has comments
    //add eventlistener for each buttons to create new-comment form. 
    //add eventlistener for each submit button to send the form. 

    if (list_of_replybtn) {
            addReplyCommentEventListener();
    
    }
    //Allow user to delete comment and also modify SQL to show that user have deleted this comment.
    if(list_of_deletebtn) {
        // for (let i = 0; i < list_of_deletebtn.length; i++) {
        //     let deletebtn = list_of_deletebtn[i];
            addDeleteCommentEventListener();
       // }
    }

    // newCommentButton();

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



        //display all the vote count once the page load
        //select all the vote-container
        const vote_containers = document.querySelectorAll(".vote-container");
        for (vote_container of vote_containers) {
            const comment_ID = vote_container.parentElement.getAttribute("commentID");
            //console.log(comment_ID)
            const voteCountsObj = await getVoteCountByCommentID(comment_ID)
            //console.log(voteCountsObj)
            const upVoteCount = voteCountsObj.upVotesCount;
            const downVoteCount = voteCountsObj.downVotesCount;
            const upVoteDisplayDiv = vote_container.querySelector(".upvote-count")
            const downVoteDisplayDiv = vote_container.querySelector(".downvote-count")
            upVoteDisplayDiv.innerText = upVoteCount;
            downVoteDisplayDiv.innerText = downVoteCount;
        }

        //add eventlisten to conment div, if the event taget match the vote container
        //do the action
        const comment_continer_div = document.querySelector(".comment-container");
        comment_continer_div.addEventListener('click', async e=>{
            if (e.target && e.target.matches(".vote-icon")){
                let voteValue = 0;
                if (e.target.getAttribute("voteType") == "Upvote") {
                    voteValue = 1
                } else if (e.target.getAttribute("voteType") == "Downvote") {
                    voteValue = -1
                }
                // const currentCountElement = e.target.nextElementSibling;
                const comment_ID = e.target.parentElement.parentElement.getAttribute("commentID");
                const user_ID = e.target.parentElement.parentElement.getAttribute("userID");
                // console.log(comment_ID);
                // console.log(user_ID);
                const updateResult = await updateVote(comment_ID, user_ID, voteValue);
                // console.log(updateResult)

                updateVoteDispalys(updateResult, e.target);
            }

        })
        //function for update vote count display
        function updateVoteDispalys(updateResult, targetElement){
            let currentCountElement = targetElement.nextElementSibling;
            let oppositeCountElement;
            if (targetElement.getAttribute("voteType") == "Upvote"){
                oppositeCountElement =currentCountElement.nextElementSibling.nextElementSibling;
            } else if (targetElement.getAttribute("voteType") == "Downvote"){
                oppositeCountElement =currentCountElement.previousElementSibling.previousElementSibling;
            }
            if (updateResult.response == "new vote added") {
                    currentCountElement.innerText = parseInt(currentCountElement.innerText) + 1;
            } else if (updateResult.response == "vote changed") {
                currentCountElement.innerText = parseInt(currentCountElement.innerText) + 1;
                oppositeCountElement.innerText = Math.max(0, parseInt(oppositeCountElement.innerText) - 1);
            } else if (updateResult.response == "vote deleted"){
                currentCountElement.innerText = Math.max(0, parseInt(currentCountElement.innerText) - 1);
            }

        }
    
    if (new_comment_submitbtn) {
        new_comment_submitbtn.addEventListener('click', async function(e) {
            console.log("clicked on newcomment submit");
            const newCommentTextDiv = new_comment_submitbtn.parentElement.previousElementSibling.lastElementChild;
            //console.log(newCommentTextDiv);

            const newCommentContent = newCommentTextDiv.value;
            //console.log(newCommentContent);

            const articleID = getCookie("articleID");
            const response = await fetch (`./newComment?commentContent=${newCommentContent}&articleID=${articleID}`);
            const newComment = await response.json();

            console.log(newComment);
            const commentDivAppendTarget = e.target.parentElement.parentElement.parentElement;

            const commentDiv = document.createElement("div");
            commentDiv.classList.add("comments-level-0");
            commentDivAppendTarget.appendChild(commentDiv)

                commentDiv.innerHTML += 
                `
                <div class="comment-body" userID="${newComment.commentAuthorID}" commentID="${newComment.commentID}">
                <h5 class="comment-title">Name: ${newComment.commentAuthorID}</h5>
                <h6 class = "comment-datetime text-muted">Date: ${newComment.commentDate}</h6>
                <p>${newComment.commentText} </p>
                <div class="vote-container">
                <img src="/images/upvote.png" class="vote-icon" voteType="Upvote">
                    <span class="upvote-count">0</span>
                    &emsp;
                <img src="/images/downvote.png" class="vote-icon" voteType="Downvote">
                    <span class="downvote-count">0</span>
                </div>
                <div class="commentreply-delete">
                <button class="comment-reply">Reply</button>
                    <p id="commentreply"></p>
                <button class="comment-delete">Delete</button>
                    <p id="commentdelete"></p>
                </div>
                `;
addReplyCommentEventListener();
        } )
    }
});

function addDeleteCommentEventListener() {
    let list_of_deletebtn = document.getElementsByClassName("comment-delete");
    for (let i = 0; i < list_of_deletebtn.length; i++) {
        let deletebtn = list_of_deletebtn[i];
        let commentID = deletebtn.parentElement.parentElement.getAttribute("commentID");
        if (!(deletebtn.getAttribute('listener'))) {
            
            deletebtn.addEventListener('click', async e => {
                let commentDiv = e.target.parentElement.parentElement;
                let textDiv = commentDiv.getElementsByTagName("p")[0];
                textDiv.innerHTML = `[User Have Deleted This Comment]`;
                let response = await fetch(`./deleteComment?commentID=${commentID}`);
            });
            deletebtn.setAttribute('listener', true);
        }
    }
}

//an async globle eventListener method
//method allows to select any async element
function addAsyncGlobalEventListener(type, selector, callback){
    document.addEventListener(type, e =>{
        if (e.target.matches(selector)) callback(e);
    })
}

function addGlobalEventListener(type, selector, object, callback) {
    object.addEventListener(type, e => {
        if (e.target.matches(selector)) callback (e)
    })
}

async function getVoteCountByCommentID(commentID) {
    let response = await fetch(`./getvotecounts?commentID=${commentID}`);
    let voteCountObj = await response.json();
    //console.log(voteCountObj);
    return voteCountObj
}

async function updateVote(commentID, userID, voteValue) {
    let response = await fetch(`./updateVote?commentID=${commentID}&userID=${userID}&voteValue=${voteValue}`);
    let resultObj = await response.json()
    return resultObj;
}

async function retrieveUserByUsername(id) {
    let response = await fetch(`./checkUsername?input_username=${id}`);
    let username_availability_obj = await response.json();
    return username_availability_obj;
}

async function retrieveArticleByArticleID(articleID) {
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
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length);
        }
    }
    return undefined;
};

async function createReplyToComment(parentComment, replyContent, articleID) {
    const response = await fetch(`./replyComment?parentCommentID=${parentComment}&replyContent=${replyContent}&articleID=${articleID}`);
    return response;
};


async function addListenersToSubmitBtn(e,submitbtn, parentCommentId, replyContentDiv) {
    submitbtn.setAttribute('listener', true);

    replybtnDiv = e.target.parentElement.parentElement.parentElement.previousElementSibling.firstElementChild;
    //console.log(replybtnDiv);
    if (replybtnDiv.innerHTML != "Reply") {
        replybtnDiv.innerHTML = "Reply"    
    }
    
    const replyContent = replyContentDiv.value;
    //console.log(replyContent)
    const parentComment = parentCommentId;
    const articleID = getCookie("articleID");

    const response = await createReplyToComment(parentComment, replyContent, articleID);
    const reply = await response.json();
    //console.log(reply);

    const commentBox = e.target.parentElement.parentElement.parentElement;
    //console.log(commentBox);

    //
    let replyTargetDiv = e.target.parentElement.parentElement.parentElement.parentElement.parentElement;
    //console.log(replyTargetDiv);
    const replyDiv = document.createElement("div");
    replyDiv.classList.add(`comments-level-${reply.commentLevel}`);
    replyTargetDiv.appendChild(replyDiv);
    replyDiv.innerHTML = `
    <div class="comment-body" userID="${reply.authorID}" commentID="${reply.commentID}">
        <h5 class="comment-title" >Name: ${reply.commentAuthorID}</h5>
        <h6 class = "comment-datetime text-muted">Date: ${reply.commentDate}</h6>
        <p>${reply.commentText} <p>
        <div class="vote-container">
            <img src="/images/upvote.png" class="vote-icon" voteType="Upvote">
                <span class="upvote-count">0</span>
                &emsp;
            <img src="/images/downvote.png" class="vote-icon" voteType="Downvote">
                <span class="downvote-count">0</span>
            </div>
        <div class="commentreply-delete">
        <button class="comment-reply">Reply</button>
            <p id="commentreply"></p>
        <button class="comment-delete">Delete</button>
            <p id="commentdelete"></p>
        </div>
    `;
    commentBox.remove();
    addReplyCommentEventListener();
    //addDeleteCommentEventListener();
}    

function addReplyCommentEventListener() {
    let list_of_replybtn = document.getElementsByClassName("comment-reply");
    for (let i = 0; i < list_of_replybtn.length; i++) {
        let new_replybtn = list_of_replybtn[i];

        addDeleteCommentEventListener();
        //console.log('test function: '+new_replybtn.getAttribute('listener'));
        if(!(new_replybtn.getAttribute('listener'))) {
            //console.log("how many times do we add a listener?");
            new_replybtn.addEventListener('click', e => {
                let buttonDiv = e.target;
                if (e.target.innerText == "Reply") {
                    buttonDiv.innerHTML = "Cancel";
                    const replyDiv = document.createElement("div");
                    buttonDiv.parentElement.parentElement.appendChild(replyDiv);
                    //console.log(buttonDiv.parentElement.parentElement);
                    replyDiv.innerHTML = `
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
                    buttonDiv.innerHTML = "Reply";
                    let replyDiv = e.target.parentElement.parentElement.lastChild;
                    replyDiv.remove();
                    //On close of comment box, does the attribute "listener" exist? (It must because we can open and close commenting)
                    //console.log(e.target.getAttribute('listener'));
                } else {
                    console.log("Error! Unexpcted button text.");
                }
                let list_of_submitbtn = document.getElementsByClassName("reply-submit");
                console.log(list_of_submitbtn);
                for (let j = 0; j < list_of_submitbtn.length; j++) {
                
                    const submitbtn = list_of_submitbtn[j];
                    const parentCommentId = submitbtn.parentElement.parentElement.parentElement.parentElement.getAttribute("commentid");   
                    //console.log("parent comment ID is");
                    //console.log(parentCommentId);
                    
                    const replyContentDiv = submitbtn.parentElement.previousElementSibling.lastElementChild;
                    //console.log(replyContentDiv);
                    if (submitbtn.getAttribute('listener')!= true) {
                        submitbtn.addEventListener('click', e => addListenersToSubmitBtn(e, submitbtn, parentCommentId, replyContentDiv))}
                    }
                    
                }

            )
            new_replybtn.setAttribute('listener', true);
        }
        
    
    }
    for (let i = 0; i < list_of_replybtn.length; i++) {
        let new_replybtn = list_of_replybtn[i];
        //console.log('test function: '+new_replybtn.getAttribute('listener'));}
    }
}

// async function createNewComment(newCommentContent, articleID) {
//     let response = await fetch (`./newComment?commentContent=${newCommentContent}&articleID=${articleID}`);
//     return response;
// };

// function newCommentButton() {
// if(new_comment_submitbtn) {
//     new_comment_submitbtn.addEventListener('click', event => makeNewComment(event));
//     }
// }

// function makeNewComment(e) {
//     console.log("I'm in the submit button function");
    
//     const newCommentTextDiv = new_comment_submitbtn.parentElement.previousElementSibling.lastElementChild;
//     console.log(newCommentTextDiv);

//     const newCommentContent = newCommentTextDiv.value;

//     console.log(newCommentContent);

//     submitComment(e, newCommentContent);
//     console.log("I'm ending the submit button function");    
// }

// async function submitComment(e, newCommentContent) {
//     const articleID = getCookie("articleID");
//     let response =  await createNewComment(newCommentContent, articleID);

//     let newComment = await response.json();
//     //console.log(response);
//     // try {
//     //     window.testComment = response.json();
//     // } catch(err) {
//     //     console.log("error "+err);
//     // }
    
//     // setTimeout(function(){console.log("waiting");}, 3000);
//     // let newComment = window.testComment;

//     console.log(newComment);

//     const commentDiv = e.target.parentElement.parentElement.parentElement;

//     commentDiv.innerHTML += 
//     `
//     <h3>Comments</h3>
//     <div class="comments-level-0">
//     <div class="comment-body" userID="${newComment.commentAuthorID}" commentID="${newComment.commentID}">
//     <h5 class="comment-title">Name: ${newComment.commentAuthorID}</h5>
//     <h6 class = "comment-datetime text-muted">Date: 2021-05-21</h6>
//     <p>${newComment.commentText} </p>
//     <div class="vote-container">
//     <img src="/images/upvote.png" class="vote-icon" voteType="Upvote">
//         <span class="upvote-count">0</span>
//     <img src="/images/downvote.png" class="vote-icon" voteType="Downvote">
//         <span class="downvote-count">0</span>
//     </div>
//     <div class="commentreply-delete">
//     <button class="comment-reply">Reply</button>
//         <p id="commentreply"></p>
//     <button class="comment-delete">Delete</button>
//         <p id="commentdelete"></p>
//     </div>
//     </div>
//     `;
//     //console.log(commentDiv);
//     addReplyCommentEventListener();
//     e.target.addEventListener('click', event => {
//         createNewComment(event);
//     })
    //addDeleteCommentEventListener();

