(function () {
    angular.element(document).ready(function () {
        angular.element('a[title]').tooltip();
    });
})();

var postpone = function (user) {
    $.ajax({
        type    : "POST",
        url     : "/answer-request",
        data    : {user: user, answType: "postpone"},
        success : function (data) {
            //$('.alert').slideUp(600);
        },
        dataType: 'json'
    });
};

$(document).ready(function () {

    /*function accept(user) {

     }*/

    var user = $("#username").text();

    var socket = io.connect('http://127.0.0.1:8081/');     //TODO change ip

    socket.emit('online', {username: user});

    socket.on('notification', function (data) {
        console.log(data);
        var userName = data.split(" ", 2)[1];
        console.log(userName);
        angular.element('.alert-group').append('<div id="alert-' + userName + '" class="alert alert-info" style="padding: 3px"> <strong></strong>' + data + '<br><button id="add" type="button" class="btn btn-sky btn-sm text-uppercase" style="padding-left: 4em; margin-left: 1em; margin-top: 1em" onclick="accept(\'' + userName + '\')"> <i class="fa fa-pencil"></i>Accept</button><button id="add" type="button" class="btn btn-sky btn-sm text-uppercase" style="padding-left: 4em; margin-top: 1em" onclick="postpone(\'' + userName + '\')"> <i class="fa fa-pencil"></i>Postpone</button></div>');
    });
});
