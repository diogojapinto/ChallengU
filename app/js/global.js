(function () {
    angular.element(document).ready(function () {
        angular.element('a[title]').tooltip();
    });
})();

$(document).ready(function () {
    var user = $("#username").text();

    var socket = io.connect('http://localhost:8081');

    socket.emit('online', {username: user});

    socket.on('notification', function (data) {
        console.log(data);
    });
});
