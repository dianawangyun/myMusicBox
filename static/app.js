$(document).ready(function () {
    $("#search-form").on("submit", (e) => {
        searchMusic(e);
    });
});

function drawResultList(container, data, infoText) {
    container.html("");
    const $ul = $("<ul>").attr({
        class:
            "row d-flex justify-content-center justify-content-xl-start grid",
    });
    container.append($ul);
    if (data.length === 0) {
        const $li = $("<li>").text(infoText).attr({
            class: "mx-auto",
            style: "width: 300px",
        });
        $ul.append($li);
    } else {
        for (let item of data) {
            if (item.kind == "song") {
                $ul.append(new SongMusic(item).element);
            } else if (item.kind == "music-video") {
                $ul.append(new SongVideo(item).element);
            }
        }
        $ul.imagesLoaded(function () {
            $(".grid").masonry({
                itemSelector: ".grid-item",
                gutter: 50,
                fitWidth: true,
            });
        });
    }
}
