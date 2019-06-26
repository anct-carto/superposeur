// cercles DROM
const cercles_drom = 'data/cercles_drom.geojson';
fetch(cercles_drom, {method: 'post'})
.then(response => response.json())
.then(data => {
  L.geoJSON(data, {
    style: {
      color: "#ffffff",
      weight: 0.5,
      opacity: 0.7,
      fillOpacity: 0.5
    }
  }).addTo(mymap)
});
