var username = $("h4").val();
console.log(username);

var socket = io.connect('http://localhost:8081');

socket.emit('online', {username: username});

socket.on('notification', function (data) {
    console.log(data);
});