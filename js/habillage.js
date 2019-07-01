let gridCercles;
// cercles DROM
const cercles_drom = 'data/cercles_drom.geojson';
fetch(cercles_drom, {method: 'get'})
.then(response => response.json())
.then(data => {
  gridCercles = L.vectorGrid.slicer(data, {
    rendererFactory: L.canvas.tile,
    vectorTileLayerStyles: {
      sliced: {
        color: "#ffffff",
        weight: 0.5,
        opacity: 1,
        fillOpacity: 0.5,
        fillColor: 'white'
      }
    },
    interactive:false
  }).addTo(mymap)
});
