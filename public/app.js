
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
                    "harvestDate": new Date().toString(),
                    "lastWatered": new Date().toString()
                },
                {
                    "name": "Basil",
                    "planted": new Date().toString(),
                    "waterEvery": "2 days",
                    "harvestDate": new Date().toString(),
                    "lastWatered": new Date().toString()
                },
                {
                    "name": "Carrots",
                    "planted": new Date().toString(),
                    "waterEvery": "3 days",
                    "harvestDate": new Date().toDateString(),
                    "lastWatered": new Date().toString()
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
                    "harvestDate": new Date().toString(),
                    "lastWatered": new Date().toString()
                },
                {
                    "name": "Lettuce",
                    "planted": new Date().toString(),
                    "waterEvery": "2 days",
                    "harvestDate": new Date().toString(),
                    "lastWatered": new Date().toString()
                },
                {
                    "name": "Cucumbers",
                    "planted": new Date().toString(),
                    "waterEvery": "3 days",
                    "harvestDate": new Date().toString(),
                    "lastWatered": new Date().toString()
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
    $('#plant-details').html(
        `<h2>${plant.name}</h2>
        <ul>
            <li>Planted: ${plant.planted}</li>
            <li>Last watered: ${plant.lastWatered}</li>
            <li>Water every: ${plant.waterEvery}</li>
            <li>Last harvested: ${plant.harvestDate}</li>
        </ul>
        <button type="button" class="edit-button">Edit</button>
        <button type="button" class="back-button">Back</button>`);
};

function watchPlantDetailsClick() {
    $('#my-garden').on('click', 'h3', event => {
        getPlantDetails(displayPlantDetails);
    });
};

function watchGoBack() {
    $('#plant-details').on('click', '.back-button', event => {
        $('#plant-details').prop('hidden', true);
        $('#my-garden').prop('hidden', false);
    });
};

function watchLoginSubmit() {
    $('#login').on('submit', '#login-form', event => {
        event.preventDefault();
        $('#login').prop('hidden', true);
        $('#my-garden').prop('hidden', false);
    })
}

$(function() {
    getAndDisplayGarden();
    watchPlantDetailsClick();
    watchGoBack();
    watchLoginSubmit();
})
