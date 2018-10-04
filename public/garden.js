
'use strict';

// GET - getting only records for logged in user
function getData(callback) {
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    const userInfo = {
        user: username
    };
    $.ajax({
        url: '/api/my-garden/' + username,
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
    const token = localStorage.getItem('authToken');
    $.ajax({
        url: '/api/my-garden',
        contentType: 'application/json',
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data: JSON.stringify(plantInfo),
        dataType: 'json',
        error: jqXHR => {
            alert(jqXHR.responseJSON);
        }
    })
    .done(() => {
        refreshPageInfo();
    });
};

function watchPlantDetailsClick() {
    $('#plant-list').on('click', '.plant-container' || 'h3', event => {
        const plant = event.target.getAttribute('data');
        $(`#${plant}`).toggle();
    });
    watchDeletePlant();
    watchClickEdit();
};

function displayGarden(data) {
    $('#plant-list').html('');
    console.log(data);
    if (data.length === 0) {
        $('#plant-list').html(
            `<div class="col-12">
                <p>There are no plants in your garden yet.</p>
            </div>`
            )
    } else {
        for (let i = 0; i < data.length; i++) {
            $('#plant-list').append(
            `<div class="col-4">
                <div class="plant-container" data="${data[i].id}">
                <h3 data="${data[i].id}">${data[i].name} &#8964;</h3> 
                <div class="${data[i].name}" id="${data[i].id}" hidden>
                    <ul>
                        <li class="waterOn">Last watered on:<br> 
                            <span class="editable">${data[i].lastWatered}</span> 
                            <span class="edit-button">&#9998;</span>
                            <form class="wateredOn-edit" hidden>
                                <input type="date" class="wateredOn-edit-input">
                                <button type="submit" class="submit-button">Submit</button>
                            </form>
                        </li>
                        <li class="water">Water every:<br> 
                            <span class="editable">${data[i].waterEvery}</span>
                            days
                            <span class="edit-button">&#9998;</span>
                            <form class="waterEvery-edit" hidden>
                                <input type="number" class="waterEvery-edit-input">
                                <button type="submit" class="submit-button">Submit</button>
                            </form>
                        </li>
                    </ul>
                    <button type="button" class="delete-button">Delete Plant</button>
                </div>
                </div>
            </div>`);
        }
    };
};

function watchClickEdit() {
    $('#plant-list').on('click', '.edit-button', event => {
        console.log(event.target);
        console.log(event.target.closest('div').id);
        const plantTarget = event.target.closest('div').id;
        const formTarget = event.target.closest('li').className;
        $('#plant-list').find(`#${plantTarget}`).find(`.${formTarget}`).children('form').toggle();
        $('#plant-list').find(`#${formTarget}`).find(`.${formTarget}`).children('.edit-button').toggle();
        $('#plant-list').find(`#${formTarget}`).find(`.${formTarget}`).children('span').toggle();
    });
    watchEditSubmit();
};

function watchEditSubmit() {
    $('#plant-list').on('submit', '.waterEvery-edit', event => {
        event.preventDefault();
        const plantId = event.target.closest('div').id;
        const plantInfo = {
            waterEvery: $('.waterEvery-edit-input').val(),
            id: plantId
        };
        console.log(plantInfo);
        putData(plantId, plantInfo);
    });
    $('#plant-list').on('submit', '.wateredOn-edit', event => {
        event.preventDefault();
        const plantId = event.target.closest('div').id;
        const plantInfo = {
            id: plantId,
            lastWatered: $('.wateredOn-edit-input').val(),
        };
        console.log(plantInfo);
        putData(plantId, plantInfo);
    });
};

// PUT
function putData(_id, plantInfo) {
    const token = localStorage.getItem('authToken');
    $.ajax({
        url: `/api/my-garden/${_id}`,
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        method: 'PUT',
        data: JSON.stringify(plantInfo),
        dataType: 'json',
        error: jqXHR => {
            alert(jqXHR.responseJSON);
        }
    })
    .done(() => {
        refreshPageInfo();
    });
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
            if (new Date(tasks[i].date) < new Date()) {
                $('#tasks-list').append(`
                <div data="${tasks[i].id}" class="overdue">
                    <p>${tasks[i].date} Water ${tasks[i].name}</p>
                    <form class="complete-task">
                        <input type="checkbox" data="${tasks[i].id}">
                    </form>
                </div>`);
            } else {
                $('#tasks-list').append(`
                <div data="${tasks[i].id}" class="task-container">
                    <p>${tasks[i].date} Water ${tasks[i].name}</p>
                    <form class="complete-task">
                        <input type="checkbox" data="${tasks[i].id}">
                    </form>
                </div>`);
            };
        };
    };
};

function watchClickComplete() {
    $('#tasks-list').on('click', '.complete-task', 'input', event => {
        console.log(event.target.closest('div').getAttribute('data'));
        const plantId = event.target.closest('div').getAttribute('data');
        const plantInfo = {
            id: plantId,
            lastWatered: new Date()
        }
        putData(plantId, plantInfo);
        refreshPageInfo();
    });
};

function getAndDisplayTasks() {
    getData(displayTasks);
};

function watchLogout() {
    $('#logout').on('click', 'button', event => {
        window.location.href = 'index.html';
    });
};

function watchDeletePlant() {
    $('#plant-list').on('click', '.delete-button', event => {
        const target = event.target.closest('div').id;
        deletePlant(target);
    });
};

function deletePlant(_id) {
    const token = localStorage.getItem('authToken');
    $.ajax({
        url: '/api/my-garden/' + _id,
        contentType: 'application/json',
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        error: jqXHR => {
            alert(jqXHR.responseJSON.message);
        }
    })
    .done(() => {
        refreshPageInfo();
    })
};

function refreshPageInfo() {
    getAndDisplayGarden();
    getAndDisplayTasks();
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
            username: localStorage.getItem('username'),
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
}

$(function() {
    getAndDisplayGarden();
    getAndDisplayTasks();
    watchPlantDetailsClick();
    watchLogout();
    watchAddPlant();
    watchClickComplete();
});
