async function getGenreList() {
    const resp = await axios.get(`${config.BASE_URL}/tastedata`);
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
