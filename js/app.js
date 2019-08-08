/* Ce fichier fait partie du code source du superposeur de zonages
Auteur : Hassen Chougar, Service Cartographie du CGET
Données : Observatoire des Territoires, Service Cartographie */


// url communes
var communesPath = 'data/communes.topojson';
var communes, id = 0
// calque des communes, vide pour l'instant
var gridCom;
var comStyle = {
        weight: 0.25,
        color: "white",
        // color: "#004494",
        opacity: 1,
        fill:true,
        fillOpacity: 1,
        fillColor:"#b5b5b5",
      };

///////////////////////// REQUETES SUR LES COMMUNES ////////////////////////
var loaded = false;
drawCommunes();

function drawCommunes() {
  // ajax sur les communes
  fetch(communesPath) // appel au fichier ...
    .then(res => res.json()) // ... écoute de la réponse ...
    .then(res => {
      loaded = true
      // création des tuiles vectorielles comprenant les communes
      gridCom = L.vectorGrid.slicer(res, {
        rendererFactory: L.canvas.tile, // affichage par canvas ou svg (svg + lourd)
        vectorTileLayerStyles: {
          sliced: comStyle, // argument "sliced" si fichier geojson en entrée
          foo: comStyle // argument "foo" si fichier topojson en entrée
        },
        // hoverStyle: { // ne fonctionne pas
        //   fillColor: 'black',
        //   fillOpacity: 0.2
        // },
        maxZoom: 22,
        indexMaxZoom: 5,
        interactive: false, // pour pouvoir afficher des tooltips et clicker sur les communes
        getFeatureId: function(f) {
  				return f.properties.insee_com; // pour l'affichage des tooltips
  			}
      }).on('click', e => { // au click ...
        mymap.flyTo([e.latlng.lat,e.latlng.lng-0.25],10,{ // zoom la carte sur la commune clickée ...
          animate:true,
          duration:1.5
        });
        showContent(search,content,highlight); // ... et ouvre la fenetre laterale
        highlight = e.layer.properties.insee_com;
        console.log(highlight);
        gridCom.setFeatureStyle(highlight,{
          weight: 2,
          color: '#d6741e',
          opacity: 1,
          fillColor: '#d6741e',
          fill: true,
          radius: 6,
          fillOpacity: 1
        });
      }).addTo(mymap);

      // récupèrer l'attribut _dataLayerNames pour y appliquer le style(si fichier topojson)
      console.log(gridCom._dataLayerNames);

      // bind tooltip
      var label;
      var tooltip;
      showTooltip();

      function showTooltip() {
        gridCom.on('mouseover', e => {
          label = e.layer.properties.insee_com; // donne moi le nom de la commune
          // fout le dans un tooltip qui va s'afficher aux coordonnées de la commune
          tooltip = L.tooltip( {direction: 'right',className:'leaflet-tooltip'})
                      .setContent(label)
                      .setLatLng(e.latlng)
                      .addTo(mymap);
        });
        gridCom.on('mouseout', e=> {
           tooltip.remove();
          clearHighlight();
        })
      };

      // on récupère le nom de la commune sur laquelle passe la souris ...
      gridCom.addEventListener('mouseover', e => {
        clearHighlight(gridCom);
        highlight = e.layer.properties.insee_com;
        gridCom.setFeatureStyle(highlight, {
          color: '#d6741e',
          fillColor: 'red',
          fillOpacity:0.5,
          opacity:1,
          animate:true,
          duration:5
        });
      });
      gridCom.on('click', e => {
        tooltip = L.tooltip( {direction: 'right',className:'leaflet-tooltip'})
                    .setContent(label)
                    .setLatLng(e.latlng)
                    .addTo(mymap)
      })

      gridCom.addEventListener('mouseout', function() {
        clearHighlight(gridCom);
        // vire moi les tooltips bordel de merde
        tooltip.remove();
      });

      // affichage des limites administratives
      drawBorders();
  })
};

function drawBorders() {
  fetch('data/borders.topojson')
    .then(res => res.json())
    .then(res => {
      features = res;
      console.log(features);
      depGrid = L.vectorGrid.slicer(res, {
        rendererFactory: L.canvas.tile,
        vectorTileLayerStyles: {
          borders: function(feature) {
            if (feature.maille === 'dep') {
              return {
                color:"white",
                opacity:1,
                weight:.75,
              }
            } else {
              return {
                color:"white",
                opacity:1,
                weight:1.5,
              }
            }
          }
        }
    }).addTo(mymap)
  })
};

//Création des labels
// conversion des textes en éléments svg
function svgText(txt) {
  return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><text x="0" y = "10">'
  + txt + '</text></svg>';
}


var createLabelIcon = function(labelClass,labelText){
  return L.divIcon({
    className: svgText(labelClass),
    html: svgText(labelText)
  })
};

let labelReg, labelDep, labelCan;

fetchLabel();

// affichage des labels selon le zoom
function fetchLabel() {
  fetch('data/labels.geojson')
      .then(res => res.json())
      .then(res => {
        labelReg = new L.geoJSON(res, {
            pointToLayer: function (feature, latlng) {
              return L.marker(latlng,{
                icon:createLabelIcon("labelClassReg", feature.properties.libgeom),
                interactive: false
              })
            },
            filter : function (feature, layer) {
              return feature.properties.STATUT == "région";
            },
            className:"labels",
            rendererFactory: L.canvas()
          }).addTo(mymap);

        labelDep = new L.geoJSON(res, {
            pointToLayer: function (feature, latlng) {
              return L.marker(latlng,{
                icon:createLabelIcon("labelClassDep", feature.properties.libgeom),
                interactive: false
              })
            },
            filter : function (feature, layer) {
              return feature.properties.STATUT == "département";
            },
            className:"labels"
          });

        labelCan = new L.geoJSON(res, {
            pointToLayer: function (feature, latlng) {
              return L.marker(latlng,{
                icon:createLabelIcon("labelClassCan", feature.properties.libgeom),
                interactive: false
              })
            },
            filter : function (feature, layer) {
              return feature.properties.STATUT == "sous-prefecture";
            },
            className:"labels"
          });

          mymap.on('zoomend', function() {
            let zoom = mymap.getZoom();

            switch (true) {
              case zoom < 8 :
              labelDep.remove()
              labelCan.remove()
              break;
              case zoom >= 8 && zoom < 9:
              labelCan.remove()
              labelDep.addTo(mymap);
              break;
              case zoom >= 9 :
              labelCan.addTo(mymap);
              break;
            }
          });
    });
};




// surligner les entités sur lesquelles passe la souris
var highlight;
var clearHighlight = function(layer) {
    if (highlight) {
      layer.resetFeatureStyle(highlight);
    }
    highlight = null;
  };

//////////////////// STYLES COUCHES //////////////////////////////

// var zrrStyle = { weight: 0.8,
//                 color: 'yellow',
//                 opacity: 1,
//                 fillOpacity: 0.5,
//                 fillColor:'yellow',
//                 animate:true,
//                 interactive:false,
//               };
// var zruStyle = {
//                 weight: 0.8,
//                 color: 'purple',
//                 opacity: 1,
//                 fillOpacity: 0.5,
//                 fillColor:'purple',
//                 interactive:false,
//               };
// var qpvStyle = {
//                 weight: 0.8,
//                 color: "#8c0000",
//                 opacity: 1,
//                 fillOpacity: 0.5,
//                 fillColor:"#8c0000",
//                 interactive:false,
//
//               };

////////////////// PERIMETRES ///////////////////////
// création d'un tableau avec les styles par zonage
// let zonageArray = [
//                     {
//                       zonage:'zru',
//                       style:zruStyle
//                     },
//                     {
//                       zonage:'qpv',
//                       style:qpvStyle
//                     },
//                     {
//                       zonage:'zrr',
//                       style:zrrStyle
//                     }
//                   ];

// for (var i in zonageArray) {
//   var zonage = zonageArray[i].zonage; // nom du zonage
//   var style = zonageArray[i].style; // style associé
//   showZonage(zonage,style)
// };
//
// // fonction faisant appel au fichier et affichant le zonage voulu (en L.GeoJSON())
// function showZonage(zonage,style) {
//   var zonageBox = document.getElementById(zonage); // la checkbox correspondante récupérer depuis le html
//   var zonageLayer = zonage.concat('Layer'); // donner un nom à la couche
//   zonageBox.addEventListener('click', function() {
//     fetch('data/'.concat(zonage,'.geojson'))
//       .then(res => res.json())
//       .then(res => {
//         console.log(res);
//         if (zonageBox.checked) {
//           console.log('checked');
//           zonageLayer = L.geoJSON(res,{
//             style:style,
//             onEachFeature:function(feature,layer) {
//               layer.bindTooltip(feature.properties.libgeo,{className:'Tooltips'})
//             }
//           });
//           zonageLayer.addTo(mymap);
//         } else {
//           console.log('unchecked');
//           mymap.removeLayer(zonageLayer)
//         }
//       })
//     })
// };
