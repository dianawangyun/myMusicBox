describe("test taste page related functions", function () {
    it("should show taste result if USER LOGGED IN", async function () {
        await getGenreList();
        if ($("#logout").length > 0) {
            expect($("#my-taste-wrap")[0].childNodes.length).toBeGreaterThan(0);
        }
    });
});
