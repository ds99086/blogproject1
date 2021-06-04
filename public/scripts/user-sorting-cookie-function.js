window.addEventListener("load", function () {
    const naviBar = document.querySelector(".nav")
    naviBar.addEventListener('click', e => {
        if (e.target && !(e.target.matches("#user-articles-link"))) {
            setCookie("userSortingOwnArticles", false, 10)
        } else if (e.target && e.target.matches("#user-articles-link")) {
            setCookie("userSortingOwnArticles", true, 10)        } 


    });

});


function setCookie(cname, cvalue, expiryInDays) {
    const d = new Date();
    d.setTime(d.getTime() + (expiryInDays*24*60*60*1000));
    document.cookie = `${cname}=${cvalue}; expires=${d.toUTCString()}; path=/`;
}


