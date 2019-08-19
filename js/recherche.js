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
      minChars: 2,
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
                       .setContent(com)
                       .setLatLng([lat,lng])
                       .addTo(mymap)
          })
          // mouvement de la carte sur la commune trouvée
          mymap.flyTo([lat,lng+0.15], 11.12, { animate:true, duration:1.5});

          // enlever le contour de la commune recherchée au click n'importe où
          mymap.on("click", function() {
            comFound.remove()
          })
        }
      }
    })
  });

// prevent refresh
// searchButton.addEventListener('click', function(event){
//   event.preventDefault();
//   comFound.remove()
//   let ajaxCom = fetch(communesPath) // appel au fichier ...
//     .then(res => res.json()) // ... écoute de la réponse ...
//     .then(data => {
//       searchField.addEventListener()
//       let com = searchField.value;
//       for (var i in data.features) {
//         if (data.features[i].properties.libgeo.toLowerCase() == com.toLowerCase()) {
//           let libCom = com.toString();
//           console.log(libCom);
//           console.log('trouvé'); // vérifier que la commune se trouve dans la liste
//           var geom = data.features[i]; // récupère la géométrie de la commune
//           var centroid = turf.centroid(data.features[i]); // récupère le centroide
//           var lat = centroid.geometry.coordinates[1];
//           var lng = centroid.geometry.coordinates[0]-0.25;
//           comFound = L.geoJSON(geom, {
//             style: {
//               fillColor: 'red',
//               fillOpacity: 1,
//               weight:0
//             }
//           })
//           .addEventListener('load', showContent(search,content,libCom))
//             .addTo(mymap);
//
//           // mouvement de la carte sur la commune trouvée
//           mymap.flyTo([lat,lng],
//                       10,{
//                           animate:true,
//                           duration:2.5
//                         });
//           show(search,content,libCom);
//         }
//       }
//     })
// });

//////////////// AUTOCOMPLETION ///////////////////
// fetch(communesPath)
//   .then(res => res.json())
//   .then(data => {
//     console.log(data.features);
//     let listCom = data.features.map((e) => {
//       return e.properties.libgeo;
//     });
//     new Awesomplete(searchField,{
//       minChars: 2,
//       list: listCom});
//     searchField.addEventListener('awesomplete-selectcomplete', e => {
//       let comValue = e.text.value;
//     })
//   });
// searchField.addEventListener('input',autoSuggest)
//
// function autoSuggest(inp,array) {
//   inp.addEventListener('input', e => {
//     if (inp.value.toLowerCase() == "") { // si pas de valeur ...
//       liste.innerHTML = ""; // aucune liste de suggestions
//     } else {
//       creerListe(); // on fait appel à la précédente liste créant les balises p
//       fetch(communesPath) // appel au fichier ...
//       .then(res => res.json()) // ... écoute de la réponse ...
//       .then(data => {
//         array = data.features.properties.libgeo;
//
//       })
//   }
// };

// function createListe() {
// 	// création de balises <p> dans le document html
// 	var com1 = document.createElement('p');
// 	var com2 = document.createElement('p');
// 	var com3 = document.createElement('p');
// 	var com4 = document.createElement('p');
// 	tabSuggest = [pays1,pays2,pays3,pays4];
// 	console.log(tabSuggest);
// 	liste.innerHTML = ""; // la liste dans medailles.html est vide ;
// 	for (var p in tabSuggest) { // pour chaque commune dans tab ...
// 		liste.appendChild(tab[p]); // ajoute le dans la liste du html
// 	};
// 	for (var e in tabSuggest) {
// 		tab[e].innerHTML = ""; // on vide le tableau pour effacer les suggestions
//   }
// };
