window.addEventListener("load", async function () {


    //if it is on the user setting page
    if (document.querySelector(".user-profile")) {
        const profileUpdateBtn = document.querySelector(".profile-update-div-btn")
        const profileUpdateDiv = document.querySelector(".profile-update-div")
        const profileUpdateSubmitBtn = profileUpdateDiv.querySelector("button")
        profileUpdateSubmitBtn.disabled = true
        profileUpdateBtn.addEventListener('click', e => {
            profileUpdateDiv.classList.toggle("invisible-class");
            if (e.target.innerText == "Thinking about changing your information?") {
                e.target.innerText = "Never mind!"
            } else if (e.target.innerText == "Never mind!") {
                e.target.innerText = "Thinking about changing your information?"
            }
        })
        //listen to the current password input
        const user_current_password = profileUpdateDiv.querySelector("#current_password")
        const user_current_password_alert = profileUpdateDiv.querySelector("#current_password_alert_message")
        user_current_password.addEventListener('input', async function (event) {
            if (await checkUserPassWordCorrect(user_current_password.value)) {
                user_current_password_alert.innerHTML = `<p style="color: green">Great! Your password is good!</p>`;
                profileUpdateSubmitBtn.disabled = false;
            } else {
                user_current_password_alert.innerHTML = `<p style="color: red">Your password is wrong!</p>`;
                profileUpdateSubmitBtn.disabled = true;
            }
        });
        choiceAvatar();
    }

    //when user want to update profile
    //check the current password input match with the password in database
    //if not show the warning and disable the update button
    async function checkUserPassWordCorrect(password_input) {
        const user_input = password_input;
        let response = await fetch(`./checkUserPassword?input_password=${user_input}`);
        let use_password_checking_obj = await response.json();
        return use_password_checking_obj.result;
    };
 

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
                        avatarIcon.classList.remove("avatar-gallery-icon-grey-out")
                    } else {
                        avatarIcon.style.backgroundColor = "transparent"
                        avatarIcon.classList.add("avatar-gallery-icon-grey-out")
                    }
                }
            }
        })
    }

})