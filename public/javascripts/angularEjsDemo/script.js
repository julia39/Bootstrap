
$(document).ready(function () {
    $(".navbar-right li:last-child").mouseenter(function () {
        $("#profile-details").show();
    });
    $("body").click(function () {
        $("#profile-details").hide();
    });

//    $('#slider1').bxSlider({
//        mode: 'fade',
//        auto: true,
//        autoControls: true,
//        pause: 1000
//    });
    $('.carousel').carousel({
        interval: 4000,
        mode: 'fade',
        auto: true,
        autoControls: true,
    })

});
