
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
const username_alert_message = document.getElementById("username_alert_message");
username_input.addEventListener('input', async function(event) {

    let user_input = username_input.value;
    const response = await retrieveUserByUsername(user_input);

    if (response.username_availability == false) {
        username_alert_message.innerHTML = `Username is not available`;
        //console.log("not available");
    } else {
        username_alert_message.innerHTML = `Username is  available`;
        //console.log("available");
    }
});

    userAvatarChangeLiveUpdate();

});