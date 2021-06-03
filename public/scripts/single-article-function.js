window.addEventListener("load", async function () {


    //if we are on the signle account page
    //get the articleID from cookies and use js to display the article

    const single_article_div = document.getElementById("single-article");
    const article_ID = getCookie("articleID");
    const article = await retrieveArticleByArticleID(article_ID);
    single_article_div.innerHTML = `
        <h4 class="article-author" author-username="${article.articleAuthorUsername}">Published by:${article.articleAuthorUsername}</h4>
        <h6 class="article-publishDate" data-publishDate="${article.articlePubDate}">Published on: ${article.articlePubDate} </h6>
        <p class="article-body">${article.articleContent}</p>
        `
    const grid_container_div = document.querySelector(".grid-container")
    const siblingArticles_div = document.createElement("div")
    siblingArticles_div.setAttribute("class", "siblingArticles");
    grid_container_div.appendChild(siblingArticles_div);
    let lastArticleID = parseInt(article_ID)+1;
    let nextArticleID = parseInt(article_ID)-1;
    siblingArticles_div.innerHTML = `<p><a href="./article-details?articleID=${lastArticleID}">Last Article</a></p><p><p><a href="./article-details?articleID=${nextArticleID}">Next Article</a></p>`
    //display all the vote count once the page load
    //select all the vote-container
    const vote_containers = document.querySelectorAll(".vote-container");
    for (vote_container of vote_containers) {
        const comment_ID = vote_container.parentElement.getAttribute("commentID");

        const voteCountsObj = await getVoteCountByCommentID(comment_ID)

        const upVoteCount = voteCountsObj.upVotesCount;
        const downVoteCount = voteCountsObj.downVotesCount;
        const upVoteDisplayDiv = vote_container.querySelector(".upvote-count")
        const downVoteDisplayDiv = vote_container.querySelector(".downvote-count")
        upVoteDisplayDiv.innerText = upVoteCount;
        downVoteDisplayDiv.innerText = downVoteCount;
    }

    //add eventlisten to conment div, if the event taget match the vote container
    //do the action
    const comment_container_div = document.querySelector(".comment-container");
    comment_container_div.addEventListener('click', async e => {
        if (e.target && e.target.matches(".vote-icon")) {
            let voteValue = 0;
            if (e.target.getAttribute("voteType") == "Upvote") {
                voteValue = 1
            } else if (e.target.getAttribute("voteType") == "Downvote") {
                voteValue = -1
            }
            const comment_ID = e.target.parentElement.parentElement.getAttribute("commentID");
            const updateResult = await updateVote(comment_ID, voteValue);

            updateVoteDispalys(updateResult, e.target);
        }

        if (e.target && e.target.matches(".comment-reply")) {
            replyButtonFunction(e);
        }

        if (e.target && e.target.matches(".reply-submit")) {
            addListenersToSubmitBtn(e);
        }

        if (e.target && e.target.matches(".comment-delete")) {
            deleteBtnFunction(e);
        }

        if (e.target && e.target.matches("#new-comment-submit")) {
            newCommentSubmitFunction(e);
        }

        if (e.target && e.target.matches("#hide-show-comment")) {
            showHideComment(e);
        }

    })
















    function showHideComment(e) {
        const commentList = document.getElementById("comments-list");

        if (e.target.innerHTML == "Hide Comments") {
            e.target.innerHTML = "Show Comments";
            commentList.style.display = "none";

        } else if (e.target.innerHTML == "Show Comments") {
            e.target.innerHTML = "Hide Comments";
            commentList.style.display = "initial";
        }
    }

    //function for update vote count display
    function updateVoteDispalys(updateResult, targetElement) {
        let currentCountElement = targetElement.nextElementSibling;
        let oppositeCountElement;
        if (targetElement.getAttribute("voteType") == "Upvote") {
            oppositeCountElement = currentCountElement.nextElementSibling.nextElementSibling;
        } else if (targetElement.getAttribute("voteType") == "Downvote") {
            oppositeCountElement = currentCountElement.previousElementSibling.previousElementSibling;
        }
        if (updateResult.response == "new vote added") {
            currentCountElement.innerText = parseInt(currentCountElement.innerText) + 1;
        } else if (updateResult.response == "vote changed") {
            currentCountElement.innerText = parseInt(currentCountElement.innerText) + 1;
            oppositeCountElement.innerText = Math.max(0, parseInt(oppositeCountElement.innerText) - 1);
        } else if (updateResult.response == "vote deleted") {
            currentCountElement.innerText = Math.max(0, parseInt(currentCountElement.innerText) - 1);
        }
    }

    async function newCommentSubmitFunction(e) {
        const newComment = await getNewComment();
        const commentContainer = e.target.parentElement.parentElement.parentElement;

        let commentsList = commentContainer.querySelector(".comments-list")

        if ((!commentsList)) {
            let commentsList = document.createElement("div");
            commentsList.classList.add("comments-list");
            commentContainer.append(commentsList);
        }

        commentsList = document.getElementsByClassName("comments-list");

        const commentDiv = document.createElement("div");
        commentDiv.classList.add("comments-level-0");

        commentsList[0].prepend(commentDiv);
        commentDiv.innerHTML += `
            <div class="comment-body" userID="${newComment.commentAuthorID}" commentID="${newComment.commentID}">
                <div>
                    <img src="/images/Avatars/Avatars Set Flat Style-${newComment.avatarImage}.png" class="commentAvatarIcon">
                </div>
                <h5 class="comment-title">Name: ${newComment.username}</h5>
                <h6 class = "comment-datetime text-muted">Date: ${newComment.commentDate}</h6>
                <p>${newComment.commentText} </p>
                <div class="vote-container">
                    <img src="/images/upvote.png" class="vote-icon" voteType="Upvote">
                    <span class="upvote-count">0</span>
                    <img src="/images/downvote.png" class="vote-icon" voteType="Downvote">
                    <span class="downvote-count">0</span>
                </div>
                <div class="commentreply-delete">
                    <button class="comment-reply">Reply</button>
                    <p id="commentreply"></p>
                    <button class="comment-delete">Delete</button>
                    <p id="commentdelete"></p>
                </div>
            </div>
                <div class="child-comment">
                </div>`;
    }

    async function newCommentFetch(newCommentContent, articleID) {
        const response = await fetch(`./newComment?commentContent=${newCommentContent}&articleID=${articleID}`);
        const newComment = await response.json();
        return newComment;
    }

    async function getNewComment() {
        const textbox = document.getElementsByName('commentText')[0];
        let newCommentContent = textbox.value;

        textbox.value = "";
        const articleID = getCookie("articleID");
        const newComment = await newCommentFetch(newCommentContent, articleID);
        return newComment;
    }

    async function deleteBtnFunction(e) {
        let deletebtn = e.target;
        let commentID = deletebtn.parentElement.parentElement.getAttribute("commentID");
        const result = await checkCommentAuthorID(commentID);

        const status = result.response;
        if (status == "Warning") {
            alert("User does not have access to this comment!");
        } else if (status == "Comment deleted") {

            let commentDiv = e.target.parentElement.parentElement;
            let textDiv = commentDiv.getElementsByTagName("p")[0];
            textDiv.innerHTML = `[User Have Deleted This Comment]`;
            deleteCommentFetch(commentID);
        }
    }

    async function checkCommentAuthorID(commentID) {
        let response = await fetch(`./checkAuthor?commentID=${commentID}`);
        let result = await response.json();
        return result;
    }

    async function deleteCommentFetch(commentID) {
        let response = await fetch(`./deleteComment?commentID=${commentID}`);
    }


    async function getVoteCountByCommentID(commentID) {
        let response = await fetch(`./getvotecounts?commentID=${commentID}`);
        let voteCountObj = await response.json();
        //console.log(voteCountObj);
        return voteCountObj
    }

    async function updateVote(commentID, voteValue) {
        let response = await fetch(`./updateVote?commentID=${commentID}&voteValue=${voteValue}`);
        let resultObj = await response.json()
        // console.log("this is the voting result: ")
        // console.log(resultObj)
        return resultObj;
    }


    async function retrieveArticleByArticleID(articleID) {
        // console.log(articleID)
        let response = await fetch(`./articleJSON?articleID=${articleID}`)
        let articleObj = await response.json();
        return articleObj;
    }



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


    async function addListenersToSubmitBtn(e) {
        const submitbtn = e.target;

        const parentCommentDiv = submitbtn.parentElement.parentElement.parentElement.parentElement;
        const parentCommentId = parentCommentDiv.getAttribute("commentid");
        const replyContentDiv = submitbtn.parentElement.previousElementSibling.lastElementChild;

        replybtnDiv = e.target.parentElement.parentElement.parentElement.previousElementSibling.firstElementChild;

        if (replybtnDiv.innerHTML != "Reply") {
            replybtnDiv.innerHTML = "Reply";
        }

        const replyContent = replyContentDiv.value;
        const parentComment = parentCommentId;
        const articleID = getCookie("articleID");

        const response = await createReplyToComment(parentComment, replyContent, articleID);
        const reply = await response.json();
        const commentBox = e.target.parentElement.parentElement.parentElement;

        let replyTargetDiv = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.lastElementChild;
        const replyDiv = document.createElement("div");
        replyDiv.classList.add(`comments-level-${reply.commentLevel}`);

        replyTargetDiv.prepend(replyDiv);

        replyDiv.innerHTML = `
        <div class="comment-body" userID="${reply.commentAuthorID}" commentID="${reply.commentID}">
        <div>
        <img src="/images/Avatars/Avatars Set Flat Style-${reply.avatarImage}.png" class="commentAvatarIcon">
        </div>
        <h5 class="comment-title" >Name: ${reply.username}</h5>
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
        </div>
        <div class="child-comment"></div>`;
        commentBox.remove();
    }

    function replyButtonFunction(e) {
        let buttonDiv = e.target;
        if (e.target.innerText == "Reply") {
            buttonDiv.innerHTML = "Cancel";
            const replyDiv = document.createElement("div");
            console.log(buttonDiv.parentElement.parentElement);
            buttonDiv.parentElement.parentElement.appendChild(replyDiv);

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
        } else {
            console.log("Error! Unexpcted button text.");
        }
    }




})