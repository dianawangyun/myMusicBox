/* get the search result from backend back and show on the page*/
async function searchMusic(e) {
    e.preventDefault();
    try {
        const response = await axios.post(`${config.BASE_URL}/search`, {
            term: $("#search").val(),
            media: "music",
            entity: $("input[name=attr]:checked").val(),
            country: $("#country").val(),
            limit: 100,
            lang: "en",
        });
        $("#audio-player")[0].pause();
        showResult(response);
    } catch (err) {
        console.log(err);
    }
}

/* draw the search result onto page */
function showResult(response) {
    const resList = response.data;
    drawResultList(
        $("#results-container"),
        resList,
        "Sorry, no matched results..."
    );
}
