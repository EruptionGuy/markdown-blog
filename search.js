const searchForm = document.getElementById("search");
const searchInput = document.getElementById("searchInput");

searchForm.addEventListener("submit", function (e) {
e.preventDefault();
const query = searchInput.value.trim();
if (query) {
    const encoded = encodeURIComponent(query);
    window.location.href = `/search.html?q=${encoded}`;
}
});
