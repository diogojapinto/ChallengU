(function () {
    angular.element(document).ready(function () {
        angular.element('a[title]').tooltip();
    });
})();

var accept = function (user) {
    $.ajax({
        type    : "POST",
        url     : "/answer-request",
        data    : {user: user, answType: "accept"},
        success : function (data) {
            $('#alert-' + user).slideUp(600);
            window.location.href = "/profile/" + data.friendName;
        },
        dataType: 'json'
    });
};

var postpone = function (user) {
    $.ajax({
        type    : "POST",
        url     : "/answer-request",
        data    : {user: user, answType: "postpone"},
        success : function (data) {
            $('#alert-' + user).slideUp(600);
        },
        dataType: 'json'
    });
};

$(document).ready(function () {

    var user = $("#username").text();

    var socket = io.connect('http://127.0.0.1:8081/');

    socket.emit('online', {username: user});

    socket.on('notification', function (data) {
        console.log(data);
        var userName = data.message.split(" ", 2)[1];
        console.log(userName);
        if (data.type === "amizade") {
            angular.element('.alert-group').append('<div id="alert-' + userName + '" class="alert alert-info" style="padding: 3px"> <strong></strong>' + data.message + '<br><button id="add" type="button" class="btn btn-sky btn-sm text-uppercase" style="padding-left: 4em; margin-left: 1em; margin-top: 1em" onclick="accept(\'' + userName + '\')"> <i class="fa fa-pencil"></i>Accept</button><button id="add" type="button" class="btn btn-sky btn-sm text-uppercase" style="padding-left: 4em; margin-top: 1em" onclick="postpone(\'' + userName + '\')"> <i class="fa fa-pencil"></i>Postpone</button></div>');
        } else if (data.type === "info") {
            angular.element('.alert-group').append('<div id="alert-' + userName + '" class="alert alert-info"> <strong></strong>' + data.message + '</div>');
        }
    });

});
