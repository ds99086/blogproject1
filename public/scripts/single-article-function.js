window.addEventListener("load", async function () {


    //if we are on the signle account page
    //get the articleID from cookies and use js to display the article
    const single_article_div = document.getElementById("single-article");
    const article_ID = getCookie("articleID");
    const article = await retrieveArticleByArticleID(article_ID);
    single_article_div.innerHTML = `
        <h4 class="article-author" author-username="${article.articleAuthorUsername}">Published by:${article.articleAuthorUsername}</h4>
        <h6 class="article-publishDate" data-publishDate="${article.articlePubDate}">Published on: ${article.articlePubDate} </h6>
        <p class="article-body">${article.articleContent}</p>`

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
        console.log("newcomment is: ");
        console.log(newComment);
        const commentContainer = document.getElementsByClassName("comment-container")[0];
        console.log("commentContainer is: ");
        console.log(commentContainer);

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

        commentDiv.innerHTML = `
        <div class="comment-body" userID="${newComment.commentAuthorID}" commentID="${newComment.commentID}">
        <div class="user-avatar">
            <img class="commentAvatarIcon" src="/images/Avatars/Avatars Set Flat Style-${newComment.avatarImage}.png">
        </div>
        <div class="comment-title">
            <h5> ${newComment.username}says..</h5>
        </div>
        <div class="comment-datetime text-muted">
            <h6>Date: ${newComment.commentDate}</h6>
        </div>

        <div class="comment-content">
            <p>${newComment.commentText}</p>
        </div>
    
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
    <div class="child-comment">`;
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
        return voteCountObj
    }

    async function updateVote(commentID, voteValue) {
        let response = await fetch(`./updateVote?commentID=${commentID}&voteValue=${voteValue}`);
        let resultObj = await response.json()
        return resultObj;
    }


    async function retrieveArticleByArticleID(articleID) {
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
        console.log("I am in listener");
        const submitbtn = e.target;        
        const targetDiv = submitbtn.parentElement.parentElement.parentElement.parentElement;
        console.log("targetdiv is: ");
        console.log(targetDiv);
        
        const parentCommentDiv = targetDiv.firstElementChild;
        console.log("parentCommentDiv is: ");
        console.log(parentCommentDiv);
        
        const parentCommentId = parentCommentDiv.getAttribute("commentid");
        console.log("parentCommentID is: ");
        console.log(parentCommentId);
        
        const childCommentDiv = targetDiv.getElementsByClassName("child-comment")[0];
        console.log("childCommentDiv is: ");
        console.log(childCommentDiv);

        replybtn = targetDiv.getElementsByClassName("comment-reply")[0];
        console.log("replybtn is: ");
        console.log(replybtn);

        if (replybtn.innerHTML != "Reply") {
            replybtn.innerHTML = "Reply";
        }

        const replyText = targetDiv.getElementsByClassName("reply-textbox")[0];
        console.log("replyText is: ");
        console.log(replyText);
        const replyContent = replyText.value;
        const parentComment = parentCommentId;
        const articleID = getCookie("articleID");
        
        const commentBox = targetDiv.getElementsByClassName("new-comment-box")[0];
        commentBox.remove();

        const response = await createReplyToComment(parentComment, replyContent, articleID);
        const reply = await response.json();

        const replyDiv = document.createElement("div");
        replyDiv.classList.add(`comments-level-${reply.commentLevel}`);
        console.log("childCommentDiv is");
        console.log(childCommentDiv);

        childCommentDiv.prepend(replyDiv);

        replyDiv.innerHTML = `<div class="comment-body" userID="${reply.commentAuthorID}" commentID="${reply.commentID}">
        <div class="user-avatar">
            <img class="commentAvatarIcon" src="/images/Avatars/Avatars Set Flat Style-${reply.avatarImage}.png">
        </div>
        <div class="comment-title">
            <h5> ${reply.username}says..</h5>
        </div>
        <div class="comment-datetime text-muted">
            <h6>Date: ${reply.commentDate}</h6>
        </div>

        <div class="comment-content">
            <p>${reply.commentText}</p>
        </div>
    
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


    }

    function replyButtonFunction(e) {
        const buttonDiv = e.target;
        const targetDiv = buttonDiv.parentElement.parentElement;
        //let buttonTargetDiv = targetDiv.getElementsByClassName("commentreply-delete")[0];
        if (e.target.innerText == "Reply") {
            e.target.innerHTML = "Cancel";
            const replyDiv = document.createElement("div");
            replyDiv.classList.add("new-comment-box");
            //console.log(buttonDiv.parentElement.parentElement);
            targetDiv.appendChild(replyDiv);

            replyDiv.innerHTML = `
            <div class="flex-col mb">
                <input type="hidden" name="parentcomment" id="parentcomment" value="">
                <label for="txtReply">Leave your comment:</label>
                <input class="reply-textbox" type="text" name="commentText" id="txtReply"  required>
            </div>
            <div class="flex-row justify-sb align-center">
            <button class="reply-submit">Submit</button>
            </div>
        `;

        } 
        //else if (e.target.innerText == "Cancel") {
        //     buttonDiv.innerHTML = "Reply";
        //     let replyDiv = e.target.parentElement.parentElement.lastChild;
        //     replyDiv.remove();
        // } else {
        //     console.log("Error! Unexpcted button text.");
        // }
    }
})