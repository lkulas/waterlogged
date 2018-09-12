
const MOCK_GARDEN_DATA = {
    "gardens": [
        {
            "id": "1111111",
            "username": "User1",
            "plants": [
                {
                    "name": "Tomatoes",
                    "planted": new Date().toString(),
                    "waterEvery": "3 days",
                    "fertilizeEvery": "14 days"
                },
                {
                    "name": "Basil",
                    "planted": new Date().toString(),
                    "waterEvery": "2 days",
                    "fertilizeEvery": "28 days"
                },
                {
                    "name": "Carrots",
                    "planted": new Date().toString(),
                    "waterEvery": "3 days",
                    "fertilizeEvery": "28 days"
                }
            ],
        },
        {
            "id": "222222",
            "username": "User2",
            "plants": [
                {
                    "name": "Strawberries",
                    "planted": new Date().toString(),
                    "waterEvery": "3 days",
                    "fertilizeEvery": "14 days"
                },
                {
                    "name": "Lettuce",
                    "planted": new Date().toString(),
                    "waterEvery": "2 days",
                    "fertilizeEvery": "28 days"
                },
                {
                    "name": "Cucumbers",
                    "planted": new Date().toString(),
                    "waterEvery": "3 days",
                    "fertilizeEvery": "28 days"
                }
            ],
        }
    ]
};

function getGarden(callbackFn) {
    setTimeout(function(){ callbackFn(MOCK_GARDEN_DATA)}, 100);
};

function displayGarden(data) {
    for (let i = 0; i < data.gardens[0].plants.length; i++) {
        $('#my-garden').append(
        `<div>
            <h3>${data.gardens[0].plants[i].name}</h3>
            <button type="button" class="delete-button">Delete</button>
        </div>`);
    };
};

function getAndDisplayGarden() {
    getGarden(displayGarden);
};

function getPlantDetails(callbackFn) {
    setTimeout(function(){ callbackFn(MOCK_GARDEN_DATA)}, 100);
};

function displayPlantDetails(data) {
    $('#my-garden').prop('hidden', true);
    $('#plant-details').prop('hidden', false);
    const plant = data.gardens[0].plants[0];
    $('#plant-details').append(
        `<h2>${plant.name}</h2>
        <ul>
            <li>Planted: ${plant.planted}</li>
            <li>Water every: ${plant.waterEvery}</li>
            <li>Fertilize every: ${plant.fertilizeEvery}</li>
        </ul>`);
};

function watchPlantDetailsClick() {
    $('#my-garden').on('click', 'h3', event => {
        getPlantDetails(displayPlantDetails);
    })
}

$(function() {
    getAndDisplayGarden();
    watchPlantDetailsClick();
})
