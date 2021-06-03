window.addEventListener("load", async function () {

    //Variables to control where the application is with loading articles and how many it should load at a time
    const loadArticleCount = 5;
    let loadArticleNext = 0;

    //get the sorting info from the hidden elements in home page
    const article_sorting_attribute = document.querySelector(".sorting-attribute").innerText;
    const article_sorting_order = document.querySelector(".sorting-order").innerText;
    const article_sorting_filter = document.querySelector(".sorting-filter").innerText;
    const article_sorting_filter_name = document.querySelector(".sorting-filter-Name").innerText;

    //load articles title on oage
    displayNextArticlesOnPage();
    document.querySelector('#article-load-button').addEventListener("click", displayNextArticlesOnPage);

    async function displayNextArticlesOnPage() {
        document.querySelector('#article-load-button').removeEventListener("click", displayNextArticlesOnPage);

        let articlesJsonArray = await getArticleArray(loadArticleNext, loadArticleCount, article_sorting_attribute, article_sorting_order, article_sorting_filter_name, article_sorting_filter);
        //at this step articles are in order

        for (let i = 0; i < articlesJsonArray.length; i++) {
            await displayPartialArticleOnPage(articlesJsonArray[i]);
        }

        if (articlesJsonArray.length < loadArticleCount) {
            document.querySelector('#article-load-button').style.background = "red";
            document.querySelector('#article-load-button').innerText = "No more articles";
        } else {
            document.querySelector('#article-load-button').addEventListener("click", displayNextArticlesOnPage);
            loadArticleNext += loadArticleCount;
        }
    }

    async function displayPartialArticleOnPage(articleObj) {
        let articleDivElement = document.createElement("div");
        articleDivElement.classList.add("article");
        let authorID = articleObj.authorID;
        let userJSON = await getArticleAuthorName(authorID);

        articleDivElement.innerHTML = `
                <h3 class="article-title""><a href="./article-details?articleID=${articleObj.articleID}">${articleObj.title}</a></h3>
                <h4 class="article-author" author-username="${userJSON.username}">Published by:${userJSON.username}</h4>
                <h6 class="article-publishDate" data-publishDate="${articleObj.publishDate}">Published on: ${articleObj.publishDate} </h6>
                <p class="article-body"></p>
                <div class="article-read-more button" data-article-id="${articleObj.articleID}">Show full content</div>`;

        let articlesDiv = document.querySelector("#articles-inner");
        articlesDiv.appendChild(articleDivElement);

        articleDivElement.querySelector('.article-read-more').addEventListener('click', e => {
            if (e.target.innerText == "Show full content") {
                let articleContentDiv = e.target.previousElementSibling;
                articleContentDiv.innerHTML = `${articleObj.bodyContentOrLinkToContent}`;
                let readMoreButtonDiv = e.target;
                readMoreButtonDiv.style.background = "red";
                readMoreButtonDiv.innerText = 'Close full content';
            } else if (e.target.innerText == "Close full content") {
                let articleContentDiv = e.target.previousElementSibling;
                articleContentDiv.innerHTML = ``;
                let readMoreButtonDiv = e.target;
                readMoreButtonDiv.innerText = 'Show full content';
                readMoreButtonDiv.style.background = "teal";
            }
        });
    }

    //get artiles array base on the ariticle numbers on page now
    async function getArticleArray(from, count, arttibute, order, filterName, filter) {
        let articlesResponseObj = await fetch(`./loadHomepageArticles?from=${from}&number=${count}&attribute=${arttibute}&order=${order}&filterName=${filterName}&filter=${filter}`);
        let articlesJsonArray = await articlesResponseObj.json();
        return articlesJsonArray;
    }

    async function getArticleAuthorName(userID) {
        let authorNameResponseObj = await fetch(`./loadArticleAuthorName?articleID=${userID}`);
        let authorNameJson = await authorNameResponseObj.json();
        return authorNameJson;
    }

    //sorting function(three sorting options)
    let sortingByDateSelection = document.getElementById("dateSorting")
    sortingByDateSelection.addEventListener('change', e => {
        window.location.href = sortingByDateSelection.value;
    })
    let sortingByTitleSelection = document.getElementById("titleSorting")
    sortingByTitleSelection.addEventListener('change', e => {
        window.location.href = sortingByTitleSelection.value;
    })
    let sortingByUsernameSelection = document.getElementById("usernameSorting")
    sortingByUsernameSelection.addEventListener('change', e => {
        window.location.href = sortingByUsernameSelection.value;
    })
})