// The dropdown menu
var period_select = d3.select('#period-select');

// Create a map object
var myMap = L.map("mosquitoes-vector", {
    center: [8.7832, 34.5085],
    zoom: 3,
    zoomControl:false
  });

// Leaflet basemap options: https://leaflet-extras.github.io/leaflet-providers/preview/
L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 18,
	ext: 'png'
}).addTo(myMap);

L.control.zoomslider({position:'topright'}).addTo(myMap);
L.control.mousePosition().addTo(myMap);
L.control.scale({position:'bottomleft', metric:false, maxWidth:200}).addTo(myMap);
L.control.pan().addTo(myMap);

var ctlSidebar = L.control.sidebar('leaflet-side-bar').addTo(myMap);
var ctlEasybutton = L.easyButton('glyphicon-transfer', function(){
  ctlSidebar.toggle(); 
}).addTo(myMap);


var vector_url = "/data/mosquitoes";
var malaria_vector_slide_input = document.querySelector('#year_range');

d3.json(vector_url).then(function(response_raw) {

  var circles_layer;

  period_select.on('change',function(){

    if(myMap.hasLayer(circles_layer)){
      myMap.removeLayer(circles_layer);
    }

    var response = response_raw.filter(d => d.Year_Group === this.value);

    var circles_list = [];

    response.forEach(d => {

      circles_list.push(L.circle([d.Lat, d.Long], {        
        color: "#1ED4AB",
        fillColor: "#1ED4AB",}))

    });

    circles_layer = L.layerGroup(circles_list);
    circles_layer.addTo(myMap);

  });

});

