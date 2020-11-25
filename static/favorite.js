/* draw favorite list on the page */
async function getFavList() {
    const resp = await axios.get(`${config.BASE_URL}/favoriteslist`);
    const resList = resp.data;
    drawResultList(
        $("#my-fav-wrap"),
        resList,
        "No favorites yet. Let's add some first!"
    );
}

/* favorite page remove favorite click event */
function setRemoveClick(li) {
    favor = li.element.find(".favor");
    favor.on("click", async function () {
        await li.updateFav();
        // refresh the search results
        getFavList();
    });
}
