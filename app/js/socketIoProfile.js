

var socket = io.connect('http://localhost:8081');


socket.on('notification', function (data) {
    console.log(data);
});