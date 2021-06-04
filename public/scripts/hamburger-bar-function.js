window.addEventListener("load", async function () {
    // This allows to reveal and hide the navigation drawer on small screens when the hamburger button is clicked
    document.querySelector('.navigation_hamburger').addEventListener('click', function () {
        document.querySelectorAll('.navigation_list').forEach(nav => nav.classList.toggle('navigation_tray_reveal'));
    });
});