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
                user_current_password_alert.innerHTML = `Great! Your password is good!`;
                profileUpdateSubmitBtn.disabled = false;
            } else {
                user_current_password_alert.innerHTML = `Your password is wrong!`;
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