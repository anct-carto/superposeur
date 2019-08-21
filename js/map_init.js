let mymap;
initMap();

function initMap() {

  // FOND
  let basemap_layer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19});

  // bloquer le défilement infini de la carte
  let soutWest = L.latLng(55, -23);
  let northEast = L.latLng(37, 26);
  let bounds = L.latLngBounds(soutWest, northEast);
  mymap = L.map('mapid', {
    maxBounds: bounds,
    maxZoom: 11,
    minZoom: 6.458,
    zoomSnap: 0.25,
    layers:[basemap_layer],
    zoomControl: false
  }).setView([46.5, 6.8], 6.458,{ animation: true });
  // mymap.zoomControl.setPosition('topright');
  // contrôle zoom avec bouton de réinitialisation de vue
  mymap.addControl(new L.Control.ZoomMin({position:'topright'}))

  // ECHELLE
  L.control.scale({position: 'bottomright'}).addTo(mymap);

  // CGET LOGO
  L.Control.Watermark = L.Control.extend({
    onAdd: function(mymap) {
        let img = L.DomUtil.create('img');

        img.src = 'css/img/cget_logo.svg';
        img.style.width = '100px';

        return img;
    },
    onRemove: function(mymap) {
        // Nothing to do here
    }
  });
  L.control.watermark = function(opts) {
      return new L.Control.Watermark(opts);
  };
  L.control.watermark({ position: 'bottomright'}).addTo(mymap);

  // cercles DROM
  let gridCercles;
  const cercles_drom = 'data/cercles_drom.geojson';
  fetch(cercles_drom)
  .then(response => response.json())
  .then(data => {
    gridCercles = L.vectorGrid.slicer(data, {
      rendererFactory: L.canvas.tile,
      vectorTileLayerStyles: {
        sliced: {
          color: "#ffffff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.5,
          fillColor: 'white'
        }
      },
      interactive:false
    }).addTo(mymap)
  })
}
