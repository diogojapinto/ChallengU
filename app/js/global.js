(function () {
    angular.element(document).ready(function () {
        angular.element('a[title]').tooltip();
    });
})();

$(document).ready(function () {
    var user = $("#username").text();

    var socket = io.connect('http://127.0.0.1:8081/');     //TODO change ip

    socket.emit('online', {username: user});

    socket.on('notification', function (data) {
        console.log(data);
        angular.element('.alert-group').append('<div class="alert alert-info"> <strong></strong>' + data + '</div>');
    });
});
