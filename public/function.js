let testCounter = 0;

window.addEventListener("load", async function () {



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

    async function retrieveUserByUsername(id) {
        let response = await fetch(`./checkUsername?input_username=${id}`);
        let username_availability_obj = await response.json();
        return username_availability_obj;
    }

    async function retrieveArticleByArticleID(articleID) {
        // console.log(articleID)
        let response = await fetch(`./articleJSON?articleID=${articleID}`)
        let articleObj = await response.json();
        return articleObj;
    }


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

    //when user want to update profile
    //check the current password input match with the password in database
    //if not show the warning and disable the update button
    async function checkUserPassWordCorrect(password_input) {
        const user_input = password_input;
        console.log(user_input)
        let response = await fetch(`./checkUserPassword?input_password=${user_input}`);
        let use_password_checking_obj = await response.json();
        console.log(use_password_checking_obj.result)
        return use_password_checking_obj.result;
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

    function choiceAvatar() {
        const avatarIcons = document.querySelectorAll(".avatar-gallery-icon")
        document.querySelector(".avatar-gallery-div").addEventListener('click', e => {
            if (e.target && e.target.matches(".avatar-gallery-icon")) {
                const avatarFilename = e.target.getAttribute("avatarFileName")
                const avatarID = avatarFilename.substring((avatarFilename.lastIndexOf(".")) - 2, avatarFilename.lastIndexOf("."))
                document.getElementById("txtAvatarID").value = avatarID;
                for (avatarIcon of avatarIcons) {
                    if (avatarIcon == e.target) {
                        avatarIcon.style.backgroundColor = "#ff0505"
                    } else {
                        avatarIcon.style.backgroundColor = "transparent"
                    }
                }
            }
        })
    }

})
