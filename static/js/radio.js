$(document).ready(function(){

    $('#map').css('display', 'none');

    var radios = document.forms["Trends"].elements["Trend"];

    for(var i = 0, max = radios.length; i < max; i++) {
        radios[i].onclick = function() {
            if (this.value === "Sunburst") {
                $("#map").fadeOut(500);
                $("#sun-burst").fadeIn(500);
            } else {
                $("#sun-burst").fadeOut(500);
                $("#map").fadeIn(500);
            }
        }
    }

});