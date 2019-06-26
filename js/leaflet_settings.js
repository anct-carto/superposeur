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


// chargement fond esri

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
}).addTo(mymap);

mymap.createPane('parcelPane');
