


const MOCK_GARDEN_DATA = {
    gardens: [
        {
            id: "1111111",
            username: "User1",
            plants: [
                {
                    name: "Tomatoes",
                    planted: new Date('2018-09-18'),
                    waterEvery: 3,
                    nextWater: function() {
                        return addDays(this.lastWatered, this.waterEvery)
                    },
                    harvestEvery: 80,
                    nextHarvest: function() {
                        return addDays(this.lastHarvested, this.harvestEvery)
                    },
                    lastHarvested: new Date('2018-09-18'),
                    lastWatered: new Date('2018-09-18')
                },
                {
                    name: "Basil",
                    planted: new Date('2018-09-19'),
                    waterEvery: 3,
                    nextWater: function() {
                        return addDays(this.lastWatered, this.waterEvery)
                    },
                    harvestEvery: 80,
                    nextHarvest: function() {
                        return addDays(this.lastHarvested, this.harvestEvery)
                    },
                    lastHarvested: new Date('2018-09-19'),
                    lastWatered: new Date('2018-09-19')
                },
                {
                    name: "Carrots",
                    planted: new Date('2018-09-20'),
                    waterEvery: 3,
                    nextWater: function() {
                        return addDays(this.lastWatered, this.waterEvery)
                    },
                    harvestEvery: 80,
                    nextHarvest: function() {
                        return addDays(this.lastHarvested, this.harvestEvery)
                    },
                    lastHarvested: new Date('2018-09-20'),
                    lastWatered: new Date('2018-09-20')
                },
            ],
        },
        {
            "id": "222222",
            "username": "User2",
            "plants": [
                {
                    name: "Tomatoes",
                    planted: new Date('2018-09-18'),
                    waterEvery: 3,
                    nextWater: function() {
                        return addDays(this.lastWatered, this.waterEvery)
                    },
                    harvestEvery: 80,
                    nextHarvest: function() {
                        return addDays(this.lastHarvested, this.harvestEvery)
                    },
                    lastHarvested: new Date('2018-09-18'),
                    lastWatered: new Date('2018-09-18')
                },
                {
                    name: "Basil",
                    planted: new Date('2018-09-19'),
                    waterEvery: 3,
                    nextWater: function() {
                        return addDays(this.lastWatered, this.waterEvery)
                    },
                    harvestEvery: 80,
                    nextHarvest: function() {
                        return addDays(this.lastHarvested, this.harvestEvery)
                    },
                    lastHarvested: new Date('2018-09-18'),
                    lastWatered: new Date('2018-09-18')
                },
                {
                    name: "Carrots",
                    planted: new Date('2018-09-20'),
                    waterEvery: 3,
                    nextWater: function() {
                        return addDays(this.lastWatered, this.waterEvery)
                    },
                    harvestEvery: 80,
                    nextHarvest: function() {
                        return addDays(this.lastHarvested, this.harvestEvery)
                    },
                    lastHarvested: new Date('2018-09-18'),
                    lastWatered: new Date('2018-09-18')
                },
            ],
        }
    ]
};

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

function getGarden(callbackFn) {
    setTimeout(function(){ callbackFn(MOCK_GARDEN_DATA)}, 100);
};

function displayGarden(data) {
    $('#plant-list').html('');
    if (data.gardens[0].plants.length === 0) {
        $('#plant-list').html(
            `<p>There are no plants in your garden! Would you like to <span class="add-plant">add one</span>?</p>`
            )
    } else {
        for (let i = 0; i < data.gardens[0].plants.length; i++) {
            $('#plant-list').append(
            `<div>
                <h3>${data.gardens[0].plants[i].name}</h3>
            </div>`);
        }
    };
};

function getAndDisplayGarden() {
    getGarden(displayGarden);
};

function displayPlantDetails(data, target) {
    const indexOf = data.gardens[0].plants.findIndex(i => i.name === target);
    console.log(indexOf);
    const plant = data.gardens[0].plants[indexOf];
    $('#plant-details').html(
        `<div class="${plant.name}">
            <h2 class="plant-name">${plant.name}</h2>
            <ul>
                <li>Planted: ${plant.planted.toString()}</li>
                <li>Water every: ${plant.waterEvery} days</li>
                <li>Water on: ${plant.nextWater()}</li>
                <li>Harvest every: ${plant.harvestEvery} days</li>
                <li>Harvest on: ${plant.nextHarvest()}</li>
            </ul>
            <button type="button" class="edit-button">Edit</button>
            <button type="button" class="delete-button">Delete</button>
            <button type="button" class="back-button">Back</button>
        </div>`);
};

function watchPlantDetailsClick() {
    $('#my-garden').on('click', 'h3', event => {
        $('#my-garden').prop('hidden', true);
        $('#plant-details').prop('hidden', false);
        const plant = event.target.textContent;
        console.log(plant);
        displayPlantDetails(MOCK_GARDEN_DATA, plant);
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
        $('.username').val('');
        $('.password').val('');
        window.location.href = '../garden/my-garden.html';
        getAndDisplayGarden();
    });
};

function watchLogout() {
    $('#logout').on('click', 'button', event => {
        $('#logout').prop('hidden', true);
        $('#login').prop('hidden', false);
        $('#my-garden').prop('hidden', true);
        $('#plant-details').prop('hidden', true);
        $('#tasks').prop('hidden', true);
    });
};

function watchDeletePlant() {
    $('#plant-details').on('click', '.delete-button', event => {
        const array = MOCK_GARDEN_DATA.gardens[0].plants;
        const target = event.target.closest('div').className;
        const indexOf = array.findIndex(i => i.name === target);
        console.log(indexOf);
        array.splice(indexOf, 1);
        $('#plant-details').prop('hidden', true);
        getAndDisplayGarden();
        $('#my-garden').prop('hidden', false);
    })
}

$(function() {
    getAndDisplayGarden();
    watchPlantDetailsClick();
    watchGoBack();
    watchLoginSubmit();
    watchLogout();
    watchDeletePlant();
});
