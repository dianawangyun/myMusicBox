$("#search-form").on("submit", showResults);

const BASE_URL = "http://127.0.0.1:5000";

async function showResults(e) {
    e.preventDefault();
    try {
        const response = await axios.post(`${BASE_URL}`, {
            term: $("#search").val(),
            media: $("input[name=attr]:checked").val(),
        });
        $("#audio-player")[0].pause();
        createResultsHTML(response);
    } catch (err) {
        console.log(err);
    }
}

function createResultsHTML(response) {
    $("#results-list").html("");
    const resList = response.data;
    for (let item of resList) {
        if (item.kind == "song") {
            const li = new SongMusic(item);
            $("#results-list").append(li.element);
        } else if (item.kind == "music-video") {
            const li = new SongVideo(item);
            $("#results-list").append(li.element);
        }
    }
}
