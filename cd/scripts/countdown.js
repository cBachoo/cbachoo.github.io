var x = setInterval(function () {
    var countDate = new Date("Dec 7, 2018").getTime();
    var now = new Date().getTime(); //current time

    var distance = countDate - now;
    // time calculations for days, hours, minutes, and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    //display the result in the element with id="countdown"
    document.getElementById("countdown").innerHTML = days + "d " + hours + "h " + minutes + "m "
        + seconds + "s ";

    //if countdown is finished, write some text
    if (distance < 0) {
        clearInterval(x);
        document.getElementById("countdown").innerHTML = "Countdown Finished!";
    }
}, 1000);