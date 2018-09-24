
'use strict';

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
        localStorage.setItem('username', user.username);
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

$(function() {
    watchLoginSubmit();
    watchRegisterSubmit();
    watchRegisterClick();
});
