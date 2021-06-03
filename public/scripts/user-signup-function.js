window.addEventListener("load", async function () {

    const username_input = document.getElementById("new_acount_username");
    const password1_input = document.getElementById("new_account_password1");
    const password2_input = document.getElementById("new_account_password2");
    const username_alert_message = document.getElementById("username_alert_message");
    const password_alert_message = document.getElementById("password_alert_message");
    const create_account_button = document.getElementById("create_account_btn");

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
        //add listener to avatar gallery
        //update avatars once user click on icon
        choiceAvatar()
    };

    async function retrieveUserByUsername(id) {
        let response = await fetch(`./checkUsername?input_username=${id}`);
        let username_availability_obj = await response.json();
        return username_availability_obj;
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

