const searchForm = document.getElementById("search");
const searchForm2 = document.getElementById("search2");
const searchInput = document.getElementById("searchInput");
const searchInput2 = document.getElementById("searchInput2");

searchForm.addEventListener("submit", function (e) {
e.preventDefault();
const query = searchInput.value.trim();
if (query) {
    const encoded = encodeURIComponent(query);
    window.location.href = `/search.html?q=${encoded}`;
}
});

searchForm2.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = searchInput2.value.trim();
    if (query) {
        const encoded = encodeURIComponent(query);
        window.location.href = `/search.html?q=${encoded}`;
    }
});