
async function retrieveUserByUsername(id) {
    let response = await fetch(`./checkUsername?input_username=${id}`);
    let username_availability_obj = await response.json();
    return username_availability_obj;
}

function userAvatarChangeLiveUpdate(){
    //get user choice of avatar, show the avatar picture live in the div
    const user_avatar_update_div = document.querySelector(".AvatarDiv");
    const user_avatar_choice_input = document.querySelector("#avatarID");
    user_avatar_update_div.innerHTML = `<img src="/images/Avatars/${user_avatar_choice_input.value}.png" class="avatarIcon">`
    user_avatar_choice_input.onchange = function(){changeAvatarIcon()};
    function changeAvatarIcon(){
        let user_avatar_choice_input = document.querySelector("#avatarID");
        user_avatar_update_div.innerHTML = `<img src="/images/Avatars/${user_avatar_choice_input.value}.png" class="avatarIcon">`
    }
}


window.addEventListener("load", function() {

    const username_input = document.getElementById ("new_acount_username");
    const password1_input = document.getElementById ("new_account_password1");
    const password2_input = document.getElementById ("new_account_password2");
    const username_alert_message = document.getElementById("username_alert_message");
    const password_alert_message = document.getElementById("password_alert_message");
    const create_account_button = document.getElementById("create_account_btn");
    
    if (username_alert_message) {
        username_input.addEventListener('input', async function(event){
            const user_input = username_input.value;
            const response = await retrieveUserByUsername(user_input);

            if (response.username_availability == false) {
                username_alert_message.innerHTML = `Username is not available`;
            } else {
                username_alert_message.innerHTML = `Username is  available`;
            }
        })
    };
    
    if (password_alert_message && create_account_button) {
        
        create_account_button.disabled = true;
        password2_input.addEventListener('input', async function(event){
            const password1_value = password1_input.value;
            const password2_value = password2_input.value;

            if(password1_value != password2_value) {
                password_alert_message.innerHTML = `Password does not match!`;
            } else {
                password_alert_message.innerHTML = `Matching password`;
                create_account_button.disabled = false;
            }

        })
    }

    // in the window.addEventListener call the avatar live update function
    userAvatarChangeLiveUpdate();

});


