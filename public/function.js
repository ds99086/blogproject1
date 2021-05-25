
async function retrieveUserByUsername(id) {
    let response = await fetch(`./checkUsername?input_username=${id}`);
    let username_availability_obj = await response.json();
    return username_availability_obj;
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
    
    
    
    

    
    
})

});


