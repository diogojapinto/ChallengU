$(document).ready(function () {
    var path = window.location.href;
    var n = path.lastIndexOf("/");
    window.history.pushState("", "", path.substring(0, n + 1));
});