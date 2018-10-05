
'use strict';

const token = localStorage.getItem('authToken');
const username = localStorage.getItem('username');

// GET - getting only records for logged in user
function getData(callback) {
    $.ajax({
        url: '/api/my-garden/' + username,
        contentType: 'application/json',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .done(results => {
        callback(results);
    })
    .fail(err => {
        console.error(`Error: ${err.message}`);
    });
};

function displayGarden(data) {
    $('#plant-list').html('');
    if (data.length === 0) {
        $('#plant-list').html(
            `<div class="col-12">
                <p>There are no plants in your garden yet.</p>
            </div>`
            )
    } else {
        for (let i = 0; i < data.length; i++) {
            generatePlantInfo(data[i]);
        };
    };
};

function generatePlantInfo(data) {
    $('#plant-list').append(
        `<div class="col-4">
            <div class="plant-container" data="${data.id}">
                <h3 data="${data.id}">${data.name} &#8964;</h3> 
                <div class="${data.name}" id="${data.id}" hidden>
                    <ul>
                        <li class="waterOn">Last watered on:<br> 
                            <span class="editable">${data.lastWatered}</span> 
                            <span class="edit-button">&#9998;</span>
                            <form class="wateredOn-edit" hidden>
                                <input type="date" aria-label="date" class="wateredOn-edit-input">
                                <button type="submit" class="submit-button">Submit</button>
                            </form>
                        </li>
                        <li class="water">Water every:<br> 
                            <span class="editable">${data.waterEvery}</span>
                            days
                            <span class="edit-button">&#9998;</span>
                            <form class="waterEvery-edit" hidden>
                                <input type="number" aria-label="number of days" class="waterEvery-edit-input">
                                <button type="submit" class="submit-button">Submit</button>
                            </form>
                        </li>
                    </ul>
                    <button type="button" class="delete-button">Delete Plant</button>
                </div>
            </div>
        </div>`);
};

function getAndDisplayGarden() {
    getData(displayGarden);
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
                date: data[i].nextWater,
                name: data[i].name,
                id: data[i].id
            });
        };
        tasks.sort(function(a, b) {
            return new Date(a.date) - new Date(b.date);
        });
        for (let i = 0; i < tasks.length; i++) {
            if (new Date(tasks[i].date) <= new Date()) {
                $('#tasks-list').append(`
                <div data="${tasks[i].id}" class="overdue">
                    <p>${tasks[i].date} Water ${tasks[i].name} <span class="check">&#9745;</span></p>
                </div>`);
            } else {
                $('#tasks-list').append(`
                <div data="${tasks[i].id}" class="task-container">
                    <p>${tasks[i].date} Water ${tasks[i].name}</p>
                </div>`);
            };
        };
    };
};

function getAndDisplayTasks() {
    getData(displayTasks);
};

function watchPlantDetailsClick() {
    $('#plant-list').on('click', '.plant-container' || 'h3', event => {
        const plant = event.target.getAttribute('data');
        $(`#${plant}`).toggle();
    });
    watchDeletePlant();
    watchClickEdit();
};

function watchClickEdit() {
    $('#plant-list').on('click', '.edit-button', event => {
        const plantId = event.target.closest('div').id;
        const formTarget = event.target.closest('li').className;
        const target = $('#plant-list').find(`#${plantId}`).find(`.${formTarget}`);
        target.children('form', '.edit-button', 'span').toggle();
    });
    watchEditSubmit();
};

function watchEditSubmit() {
    $('#plant-list').on('submit', '.waterEvery-edit', event => {
        event.preventDefault();
        const plantId = event.target.closest('div').id;
        const formTarget = event.target.closest('li').className;
        const updateInfo = $('#plant-list').find(`#${plantId}`).find(`.${formTarget}`).children('form').children('input').val();
        const plantInfo = {
            waterEvery: updateInfo,
            id: plantId
        };
        putData(plantId, plantInfo);
    });
    $('#plant-list').on('submit', '.wateredOn-edit', event => {
        event.preventDefault();
        const plantId = event.target.closest('div').id;
        const formTarget = event.target.closest('li').className;
        const updateInfo = $('#plant-list').find(`#${plantId}`).find(`.${formTarget}`).children('form').children('input').val();
        const plantInfo = {
            id: plantId,
            lastWatered: updateInfo
        };
        putData(plantId, plantInfo);
    });
};

function watchClickComplete() {
    $('#tasks-list').on('click', '.check', event => {
        const plantId = event.target.closest('div').getAttribute('data');
        const plantInfo = {
            id: plantId,
            lastWatered: new Date()
        }
        putData(plantId, plantInfo);
        refreshPageInfo();
    });
};

// PUT
function putData(_id, plantInfo) {
    $.ajax({
        url: `/api/my-garden/${_id}`,
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        method: 'PUT',
        data: JSON.stringify(plantInfo),
        dataType: 'json'
    })
    .done(() => {
        refreshPageInfo();
    })
    .fail(err => {
        console.error(`Error: ${err.message}`);
    });
};

function watchAddPlant() {
    $('.add-plant-button').on('click', event => {
        $('#add-plant-form').prop('hidden', false);
        $('.add-plant-button').prop('hidden', true);
    });
    watchAddPlantSubmit();
};

function watchAddPlantSubmit() {
    $('#add-plant-form').on('submit', event => {
        event.preventDefault();
        $('.add-plant-button').prop('hidden', false);
        const plantInfo = {
            username: username,
            name: $('#plant-name').val(),
            waterEvery: $('#water-every').val(),
            planted: new Date(),
            lastWatered: new Date()
        };
        $('#plant-name').val('');
        $('#water-every').val('');
        $('#add-plant-form').prop('hidden', true);
        postData(plantInfo);
    });
};

// POST
function postData(plantInfo) {
    $.ajax({
        url: '/api/my-garden',
        contentType: 'application/json',
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data: JSON.stringify(plantInfo),
        dataType: 'json'
    })
    .done(() => {
        refreshPageInfo();
    })
    .fail(err => {
        console.error(`Error: ${err.message}`);
    });
};

function watchDeletePlant() {
    $('#plant-list').on('click', '.delete-button', event => {
        const target = event.target.closest('div').id;
        deletePlant(target);
    });
};

// DELETE
function deletePlant(_id) {
    $.ajax({
        url: '/api/my-garden/' + _id,
        contentType: 'application/json',
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .done(() => {
        refreshPageInfo();
    })
    .fail(err => {
        console.error(`Error: ${err.message}`);
    });
};

function refreshPageInfo() {
    getAndDisplayGarden();
    getAndDisplayTasks();
};

function watchLogout() {
    $('#logout').on('click', 'button', event => {
        window.location.href = 'index.html';
    });
};

$(function() {
    refreshPageInfo();
    watchPlantDetailsClick();
    watchLogout();
    watchAddPlant();
    watchClickComplete();
});
