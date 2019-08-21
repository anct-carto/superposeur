/* Ce fichier fait partie du code source du superposeur de zonages
Auteur : Hassen Chougar, Service Cartographie du CGET
Données : Observatoire du Territoire, Service Cartographie */


let searchField = document.getElementById('searchField');
let searchButton = document.getElementById('searchButton');

// prevent refresh
searchButton.addEventListener('click', function(event){
  event.preventDefault();
});

// supprimer la géométrie de la commune à chaque nouvelle recherche
let comFound = L.vectorGrid.slicer().addTo(mymap);
let codgeo;

// requête ajax sur les communes
fetch(communesPath)
  .then(res => res.json())
  .then(data => {
    comFound.remove(); // enlève le contour de la commune précédente
    // pour un geojson ...
    // let listCom = data.features.map((e) => {
    //   return e.properties.libgeo
    // });
    // pour un topojson ...
    let features = data.objects.communes.geometries;
    let listCom = [];
    for (i in features) {
      listCom.push(features[i].properties.libgeo);
    }

    new Awesomplete(searchField,{ //
      minChars: 1,
      list: listCom});

    searchField.addEventListener('awesomplete-selectcomplete', e => {
      let comValue = e.text.value;
      let com = searchField.value;
      for (let i in features) {
        if (features[i].properties.libgeo.toLowerCase() == com.toLowerCase()) {
          // enlève la géométrie de la commune précédemment recherchée
          comFound.remove();
          let libCom = com.toString();
          console.log('trouvé'); // vérifier que la commune se trouve dans la liste
          let geomCom = features[i];
          codgeo = geomCom.properties.codgeo;
          let lat = geomCom.properties.lat;
          let lng = geomCom.properties.long;
          // ajout de la géométrie de la commune à la carte
          comFound = new L.vectorGrid.slicer(data, {
            rendererFactory: L.canvas.tile,
            vectorTileLayerStyles: {
              communes: function(feature) {
                let name = feature.libgeo;
                if (name === com) {
                  console.log("géométrie trouvée");
                  return {
                    weight:4,
                    color: '#004494',
                    fillOpacity: 1,
                  }
                } else {
                  return {
                    fillOpacity: 0,
                    stroke: false,
                    fill: false,
                    opacity: 0,
                    weight: 0
                  }
                }
              }
            }
          }).addTo(mymap);

          // nom COMMUNE
          comFound.on("load", function() {
            tooltip = L.tooltip()
                       .setContent(com+" - Code : "+codgeo)
                       .setLatLng([lat,lng])
                       .addTo(mymap)
          })
          // mouvement de la carte sur la commune trouvée
          mymap.setView([lat,lng+0.15], 11.12, {animate:true, duration:1.5});

          // enlever le contour de la commune recherchée au click n'importe où
          mymap.on("click", function() {
            comFound.remove()
          });
        }
      }
    })
  });
  let zoomMin = document.getElementsByClassName('leaflet-control-zoom-min');
  console.log(zoomMin);
  for (btn in zoomMin) {
    console.log(btn[0]);
  }
