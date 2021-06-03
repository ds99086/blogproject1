window.addEventListener("load", async function () {
    const naiDiv = document.querySelector(".nav")
    const sortingDiv = document.querySelector("#catalogue")

    naiDiv.addEventListener('click', async e => {
        if (e.target && e.target.matches(".nav-dropdown")) {
            let dropdownDiv = e.target;
            if(dropdownDiv.getAttribute("status")=="down"){
                dropdownDiv.innerHTML = `<img src="../images/pullupIcon.png" alt="sorting button" class="pullupIcon-icon">`
                dropdownDiv.setAttribute("status", "up")
                sortingDiv.style.display = "flex";

            } else if (dropdownDiv.getAttribute("status")=="up"){
                dropdownDiv.innerHTML = `<img src="../images/dropdownIcon.png" alt="sorting button" class="dropdown-icon">`
                dropdownDiv.setAttribute("status", "down")
                sortingDiv.style.display = "none";
            }        
        }
    })
})