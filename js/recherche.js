/*

	@ File : recherche.js
	@ Author : Hassen Chougar, Service Cartographie du CGET
	@ Date : 08/2019

	@ For : ViZonage - Carte interactive des contrats et zonages de politiques publiques
	@ Main file : index.html

	@ Description : script gérant la recherche de communes.
                  Il fait appel à la variable "communesPath", créée dans le script
                  map_init.js.
                  Attention : selon le type de fichier en entrée (geojson ou topojson),
                              le code n'est pas le même ....
*/


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

          // flyTp de la carte sur la commune trouvée
          mymap.setView([lat,lng-0.25], 11.12, {animate:true, duration:1.5});

          // enlever le contour de la commune recherchée au click n'importe où
          mymap.on("click", function() {
            comFound.remove()
          });
        }
      }
    })
  });
