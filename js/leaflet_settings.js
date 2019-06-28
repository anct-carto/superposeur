// bloquer le défilement infini de la carte
var soutWest = L.latLng(53, -20);
var northEast =L.latLng(40, 20);
var bounds = L.latLngBounds(soutWest, northEast);
var mymap = L.map('mapid', {
  maxBounds: bounds,
  maxZoom: 11,
  minZoom: 6
}).setView([46.5, -1.8], 6);
mymap.zoomControl.setPosition('topright');

// FOND
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
}).addTo(mymap);

mymap.createPane('parcelPane');

// ECHELLE
L.control.scale({position: 'bottomright'}).addTo(mymap);
// setInterval(function(){
//     mymap.setView([0, 0]);
//     setTimeout(function(){
//         mymap.setView([60, 0]);
//     }, 2000);
// }, 4000);
