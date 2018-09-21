
'use strict';

const options = { weekday: 'long', month: 'long', day: 'numeric' };

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

function nextWater(data) {
    return addDays(data.lastWatered, data.waterEvery);
};

  function nextHarvest(data) {
    return addDays(data.lastHarvested, data.harvestEvery);
};

function getGarden(callbackFn) {
    //setTimeout(function(){ callbackFn(MOCK_GARDEN_DATA)}, 100);
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

function getTasks(callbackFn) {
    //setTimeout(function(){ callbackFn(MOCK_GARDEN_DATA)}, 100);
};

function displayTasks(data) {
    $('#tasks-list').html('');
    const tasks = [];
    if (data.gardens[0].plants.length === 0) {
        $('#tasks-list').html(
            `<p>No upcoming tasks</p>`
            )
    } else {
        for (let i = 0; i < data.gardens[0].plants.length; i++) {
            tasks.push(
            {
                date: data.gardens[0].plants[i].nextWater(),
                name: data.gardens[0].plants[i].name,
                task: 'Water'
            },
            {
                date: data.gardens[0].plants[i].nextHarvest(),
                name: data.gardens[0].plants[i].name,
                task: 'Harvest'
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
    getTasks(displayTasks);
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

function watchLoginSubmit() {
    $('#login-form').on('submit', event => {
        event.preventDefault();
        const username = $('.username').val();
        const password = $('.password').val();
        loginUser(username, password);
    });
};

function loginUser(_username, _password) {
    const user = {
      username: _username,
      password: _password
    };
    $.ajax({
        url: '/api/auth/login',
        data: JSON.stringify(user),
        contentType: 'application/json',
        method: 'POST',
        error: jqXHR => {
            $('#login-error').prop('hidden', false);
            $('#login-error').html(`<p>Error: ${jqXHR.responseJSON.message}</p>`);
        }
    })
    .done(token => {
        localStorage.setItem('authToken', token.authToken);
        localStorage.setItem('username', token.username);
        window.location.href = 'my-garden.html';
    })
};

function watchRegisterClick() {
    $('#login').on('click', '.register', event => {
        $('#login').prop('hidden', true);
        $('#register-success').prop('hidden', true);
        $('#register-error').prop('hidden', true);
        $('#register').prop('hidden', false);
        $('#register-error').html('');
        $('#login-error').prop('hidden', true);
    })
}

function watchRegisterSubmit() {
    $('#register-form').on('submit', event => {
        event.preventDefault();
        const username = $('.register-username').val();
        const password = $('.register-password').val();
        const firstName = $('.register-firstName').val();
        const lastName = $('.register-lastName').val();
        registerUser(username, password, firstName, lastName);  
    });
};

function registerUser(_username, _password, _firstName, _lastName) {
    const user = {
      username: _username,
      password: _password,
      firstName: _firstName,
      lastName: _lastName
    };
    $.ajax({
        url: '/api/users',
        data: JSON.stringify(user),
        contentType: 'application/json',
        method: 'POST',
        error: jqXHR => {
            $('#register-error').prop('hidden', false);
            $('#register-error').html(`<p>Error: ${jqXHR.responseJSON.message}</p>`);
        }
    })
    .done(() => {
        $('#register-success').prop('hidden', false);
        $('#register-error').prop('hidden', true);
        $('#login').prop('hidden', false);
        $('#register').prop('hidden', true);
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

$(function() {
    getAndDisplayGarden();
    getAndDisplayTasks();
    watchPlantDetailsClick();
    watchGoBack();
    watchLoginSubmit();
    watchLogout();
    watchDeletePlant();
    watchClickEdit();
    watchEditSubmit();
    watchRegisterSubmit();
    watchRegisterClick();
});
