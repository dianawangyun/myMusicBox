$("#search-form").on("submit", showResults);

const BASE_URL = "http://127.0.0.1:5000";

/* get the search result from backend back and show on the page*/
async function showResults(e) {
    e.preventDefault();
    try {
        const response = await axios.post(`${BASE_URL}/search`, {
            term: $("#search").val(),
            media: "music",
            entity: $("input[name=attr]:checked").val(),
            country: $("#country").val(),
            limit: 100,
            lang: "en",
        });
        $("#audio-player")[0].pause();
        createResultsHTML(response);
    } catch (err) {
        console.log(err);
    }
}

/* draw the search result onto page */
function createResultsHTML(response) {
    $("#results-container").html("");
    const $ul = $("<ul>").attr({
        class:
            "row d-flex justify-content-center justify-content-xl-start grid",
        id: "results-list",
    });
    $("#results-container").append($ul);

    const resList = response.data;
    // when no matched results returned
    if (resList.length === 0) {
        const $li = $("<li>").text("Sorry, no matched results...").attr({
            class: "mx-auto",
            style: "width: 200px",
        });
        $("#results-list").append($li);
    } else {
        for (let item of resList) {
            // create different li for song and video
            if (item.kind == "song") {
                const li = new SongMusic(item);
                setFavClick(li);
                $("#results-list").append(li.element);
            } else if (item.kind == "music-video") {
                const li = new SongVideo(item);
                setFavClick(li);
                $("#results-list").append(li.element);
            }
        }

        $("#results-list").imagesLoaded(function () {
            $("#results-list").masonry({
                itemSelector: ".grid-item",
                gutter: 50,
                fitWidth: true,
            });
        });
    }
}

/* search page fav button click event */
function setFavClick(li) {
    favor = li.element.find(".favor");
    favor.on("click", async function () {
        li.updateFav();
        li.changeBtnStyle();
    });
}

$(document).ready(function () {
    checkFavPage();
    checkTastePage();
});

function checkFavPage() {
    if ($("#my-fav-wrap").is(":visible")) {
        //if the container is visible on the page
        getFavList();
    } else {
        setTimeout(checkFavPage, 50); //wait 50 ms, then try again
    }
}

/* draw favorite list on the page */
async function getFavList() {
    const resp = await axios.get(`${BASE_URL}/favoriteslist`);
    $("#my-fav-wrap").html("");
    const resList = resp.data;
    // when no matched results returned
    if (resList.length === 0) {
        const $li = $("<li>")
            .text("No favorites yet. Let's add some first!")
            .attr({
                class: "mx-auto",
                style: "width: 300px",
            });
        $("#my-fav-wrap").append($li);
    } else {
        // create different li for song and video
        for (let item of resList) {
            if (item.kind == "song") {
                const li = new SongMusic(item);
                setRemoveClick(li);
                $("#my-fav-wrap").append(li.element);
            } else if (item.kind == "music-video") {
                const li = new SongVideo(item);
                setRemoveClick(li);
                $("#my-fav-wrap").append(li.element);
            }
        }
        $("#results-list").imagesLoaded(function () {
            $(".grid").masonry({
                itemSelector: ".grid-item",
                gutter: 50,
                fitWidth: true,
            });
        });
    }
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

function checkTastePage() {
    if ($("#my-taste-wrap").is(":visible")) {
        //if the container is visible on the page
        getGenreList();
    } else {
        setTimeout(checkTastePage, 50); //wait 50 ms, then try again
    }
}

async function getGenreList() {
    const resp = await axios.get(`${BASE_URL}/tastedata`);
    $("#my-taste-wrap").html("");
    const resList = resp.data;
    drawChart(resList);
}

function drawChart(resList) {
    let myChart = echarts.init(document.querySelector("#my-taste-wrap"));
    option = {
        tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
            orient: "horizontal",
            left: "center",
            itemGap: 15,
            textStyle: {
                fontSize: 14,
            },
        },
        series: [
            {
                name: "Genre",
                type: "pie",
                radius: ["45%", "70%"],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: "center",
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: "24",
                        fontWeight: "bold",
                    },
                },
                labelLine: {
                    show: false,
                },
                data: resList,
            },
        ],
    };
    myChart.setOption(option);
    window.addEventListener("resize", function () {
        myChart.resize();
    });
}
