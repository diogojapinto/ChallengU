$(document).ready(function () {
    setTimeout(function() {$('.alert').slideUp(600)}, 5000);


    $('button.close').on('click', function() {
        var parent = $(this).parent();
        parent.delay(1).slideUp(600);
    });

});