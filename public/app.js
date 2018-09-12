const MOCK_GARDEN_DATA = {
    "gardens": [
        {
            "id": "1111111",
            "plants": [
                {
                    "name": "tomatoes",
                    "planted": Date.now(),
                    "waterEvery": "3 days",
                    "fertilizeEvery": "14 days"
                },
                {
                    "name": "basil",
                    "planted": Date.now(),
                    "waterEvery": "2 days",
                    "fertilizeEvery": "28 days"
                },
                {
                    "name": "carrots",
                    "planted": Date.now(),
                    "waterEvery": "3 days",
                    "fertilizeEvery": "28 days"
                }
            ],
            "username": "User1",
        },
        {
            "id": "222222",
            "plants": [
                {
                    "name": "strawberries",
                    "planted": Date.now(),
                    "waterEvery": "3 days",
                    "fertilizeEvery": "14 days"
                },
                {
                    "name": "lettuce",
                    "planted": Date.now(),
                    "waterEvery": "2 days",
                    "fertilizeEvery": "28 days"
                },
                {
                    "name": "cucumbers",
                    "planted": Date.now(),
                    "waterEvery": "3 days",
                    "fertilizeEvery": "28 days"
                }
            ],
            "username": "User2",
        }
    ]
};

function getGarden(callbackFn) {
    setTimeout(function(){ callbackFn(MOCK_GARDEN_DATA)}, 100);
}

function displayGarden(data) {
    for (let i = 0; i < data.gardens[0].plants.length; i++) {
        $('#my-garden').append(
        `<h3>${data.gardens[0].plants[i].name}</h2>`);
    }

}

function getAndDisplayGarden() {
    getGarden(displayGarden);
}

$(function() {
    getAndDisplayGarden();
})