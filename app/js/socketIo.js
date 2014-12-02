$(document).ready(function () {
    var user = $("#username").text();
    console.log(user);

    var socket = io.connect('http://localhost:8081');

    socket.emit('online', {username: user});

    socket.on('notification', function (data) {
        console.log(data);
    });
});
