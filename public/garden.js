
'use strict';

const options = { weekday: 'long', month: 'long', day: 'numeric' };

// DONE
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// DONE
function nextWater(data) {
    return addDays(data.lastWatered, data.waterEvery);
};

// DONE
function nextHarvest(data) {
    return addDays(data.lastHarvested, data.harvestEvery);
};

// GET - currently getting all records
function getData(callback) {
    const token = localStorage.getItem('authToken');
    $.ajax({
        url: '/api/my-garden',
        contentType: 'application/json',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        error: jqXHR => {
            alert(jqXHR.responseJSON.message);
        }
    })
    .done(results => {
        callback(results);
    });
};

// POST
function postData(plantInfo) {
    $.ajax({
        url: '/api/my-garden',
        contentType: 'application/json',
        method: 'POST',
        data: JSON.stringify(plantInfo),
        dataType: 'json',
        error: jqXHR => {
            alert(jqXHR.responseJSON);
        }
    })
    .done(() => {
        getAndDisplayGarden();
        getAndDisplayTasks();;
    });
};

// DONE
function displayGarden(data) {
    $('#plant-list').html('');
    console.log(data);
    if (data.length === 0) {
        $('#plant-list').html(
            `<p>There are no plants in your garden!</p>`
            )
    } else {
        for (let i = 0; i < data.length; i++) {
            $('#plant-list').append(
            `<div>
                <h3>${data[i].name}</h3>
            </div>`);
        }
    };
};

// DONE
function getAndDisplayGarden() {
    getData(displayGarden);
};

function displayPlantDetails(data, target) {
    const indexOf = data.gardens[0].plants.findIndex(i => i.name === target);
    const plant = data.gardens[0].plants[indexOf];
    $('#plant-details').html(
            `<div class="${plant.name}">
                <h2 class="plant-name">${plant.name}</h2>
                <ul>
                    <li class="planted">Planted: 
                        <span class="editable">${plant.planted.toLocaleString('en-US', options)}</span> 
                        <button type="button" class="edit-button">Edit</button>
                        <form class="edit" hidden>
                            <label>Date
                                <input type="date">
                            </label>
                            <button type="submit">Submit</button>
                        </form>
                    </li>
                    <li class="water">Water every: 
                        <span class="editable">${plant.waterEvery}</span>
                        <form class="edit" hidden>
                            <input type="number">
                            <button type="submit">Submit</button>
                        </form>
                        days 
                        <button type="button" class="edit-button">Edit</button>
                        </li>
                    <li class="waterOn">Water on: 
                        <span class="editable">${plant.nextWater().toLocaleString('en-US', options)}</span> 
                        <button type="button" class="edit-button">Edit</button>
                        <form class="edit" hidden>
                            <label>Date
                                <input type="date">
                            </label>
                            <button type="submit">Submit</button>
                        </form>
                    </li>
                    <li class="harvest">Harvest every: 
                        <span class="editable">${plant.harvestEvery}</span>
                        <form class="edit" hidden>
                            <input type="number">
                            <button type="submit">Submit</button>
                        </form> 
                        days 
                        <button type="button" class="edit-button">Edit</button>
                        </li>
                    <li class="harvestOn">Harvest on: 
                        <span class="editable">${plant.nextHarvest().toLocaleString('en-US', options)}</span> 
                        <button type="button" class="edit-button">Edit</button>
                        <form class="edit" hidden>
                            <label>Date
                                <input type="date">
                            </label>
                            <button type="submit">Submit</button>
                        </form>
                    </li>
                </ul>
                <button type="button" class="delete-button">Delete</button>
                <button type="button" class="back-button">Back</button>
            </div>`);
};

function displayTasks(data) {
    $('#tasks-list').html('');
    const tasks = [];
    if (data.length === 0) {
        $('#tasks-list').html(
            `<p>No upcoming tasks</p>`
            )
    } else {
        for (let i = 0; i < data.length; i++) {
            tasks.push(
            {
                date: nextWater(data[i]),
                name: data[i].name,
                task: 'Water'
            });
        };
        tasks.sort(function(a, b) {
            return  +new Date(a.date) - +new Date(b.date);
        });
        for (let i = 0; i < tasks.length; i++) {
            $('#tasks-list').append(`<li>${tasks[i].date.toLocaleString('en-US', options)}: ${tasks[i].task} ${tasks[i].name}</li>`)
        };
    };
};

function getAndDisplayTasks() {
    getData(displayTasks);
};

function watchPlantDetailsClick() {
    $('#my-garden').on('click', 'h3', event => {
        $('#my-garden').prop('hidden', true);
        $('#plant-details').prop('hidden', false);
        const plant = event.target.textContent;
        displayPlantDetails(MOCK_GARDEN_DATA, plant);
    });
};

function watchGoBack() {
    $('#plant-details').on('click', '.back-button', event => {
        $('#plant-details').prop('hidden', true);
        $('#my-garden').prop('hidden', false);
    });
};

function watchLogout() {
    $('#logout').on('click', 'button', event => {
        window.location.href = 'index.html';
    });
};

function watchDeletePlant() {
    $('#plant-details').on('click', '.delete-button', event => {
        const array = MOCK_GARDEN_DATA.gardens[0].plants;
        const target = event.target.closest('div').className;
        const indexOf = array.findIndex(i => i.name === target);
        array.splice(indexOf, 1);
        $('#plant-details').prop('hidden', true);
        getAndDisplayGarden();
        getAndDisplayTasks();
        $('#my-garden').prop('hidden', false);
    });
};

function watchClickEdit() {
    $('#plant-details').on('click', '.edit-button', event => {
        const formTarget = event.target.closest('li').className;
        $('#plant-details').find(`.${formTarget}`).find('form').prop('hidden', false);
        $('#plant-details').find(`.${formTarget}`).find('.edit-button').prop('hidden', true);
        $('#plant-details').find(`.${formTarget}`).find('span').prop('hidden', true);
    });
};

function watchEditSubmit() {
    $('#plant-details').on('submit', '.edit', event => {
        event.preventDefault();
        queryTarget = event.target.closest('li').className;
        query = $('#plant-details').find(`.${queryTarget}`).find('input').val();
        console.log(query);
        const array = MOCK_GARDEN_DATA.gardens[0].plants;
        const target = event.target.closest('div').className;
        const indexOf = array.findIndex(i => i.name === target);
    });
};

function watchAddPlant() {
    $('.add-plant-button').on('click', event => {
        $('#add-plant-form').prop('hidden', false);
    });
};

function watchAddPlantSubmit() {
    $('#add-plant-form').on('submit', event => {
        event.preventDefault();
        const plantInfo = {
            "username": localStorage.getItem('username'),
            "name": $('#plant-name').val(),
            "waterEvery": $('#water-every').val(),
            "planted": new Date($('#planted-date').val()),
        };
        $('#plant-name').val('');
        $('#water-every').val('');
        $('#planted-date').val('');
        $('#add-plant-form').prop('hidden', true);
        postData(plantInfo);
    });
}

$(function() {
    getAndDisplayGarden();
    getAndDisplayTasks();
    watchPlantDetailsClick();
    watchGoBack();
    watchLogout();
    watchDeletePlant();
    watchClickEdit();
    watchEditSubmit();
    watchAddPlant();
    watchAddPlantSubmit();
});
