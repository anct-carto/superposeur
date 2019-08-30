/*

	@ File : map_init.js
	@ Author : Hassen Chougar, Service Cartographie du CGET
	@ Date : 08/2019

	@ For : ViZonage - Carte interactive des contrats et zonages de politiques publiques
	@ Main file : index.html

	@ Description : script d'initialisation du conteneur et de la carte Leaflet.
                  C'est ici qu'est paramétrée la carte Leaflet. C'est également
                  ici que sont ajoutés les cercles des DROM.

*/

let mymap;
initMap();

function initMap() {

  // FOND
  let basemap_layer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>&copy; <a href="https://carto.com/attributions">Fond cartographique CARTO</a>',
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
    zoomControl: false,
    renderer: L.canvas()
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

        img.src = 'css/img/CGET-logotype.png';
        img.href = 'https://cartotheque.cget.gouv.fr/';
        // img.src = 'css/img/cget_logo.svg';
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
            fill:true,
            fillColor: '#d4dadc',
            // fillColor: 'white',
            fillOpacity: 1,
            color: "#b7b1a8",
            weight: 2,
            opacity: 1,
          }
        },
        interactive:false
      }).addTo(mymap);
    })
    // guyane
    // fetch('data/guyane.geojson')
    //   .then(res => res.json())
    //   .then(guyane => {
    //     gridGuyane = L.vectorGrid.slicer(guyane, {
    //       rendererFactory: L.canvas.tile,
    //       vectorTileLayerStyles: {
    //         sliced: {
    //           fill:true,
    //           fillColor: '#fafaf8',
    //           fillOpacity: 1,
    //           color:'white',
    //           weight:2,
    //           opacity:1
    //         }
    //       },
    //       interactive:false
    //     }).addTo(mymap);
    //   });
};

/******************************************************************************/
/************************** COMMUNES + LIMITES ADMIN **************************/
/******************************************************************************/

var communesPath = 'data/communes.topojson';
var communes, id = 0
// calque des communes, vide pour l'instant
var gridCom;
var comStyle = {
        weight: 0.2,
        color: "#004494",
        color: "white",
        opacity: 1,
        fill:true,
        fillOpacity: 1,
        fillColor:"#b7b1a8",
        // fillColor:"#b5b5b5",
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
          communes: comStyle // argument "foo" si fichier topojson en entrée
        },
        // hoverStyle: { // ne fonctionne pas
        //   fillColor: 'black',
        //   fillOpacity: 0.2
        // },
        maxZoom: 22,
        indexMaxZoom: 5,
        interactive: false, // pour pouvoir afficher des tooltips et clicker sur les communes
        getFeatureId: function(f) {
  				return f.properties.libgeo; // pour l'affichage des tooltips
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


// surligner les entités sur lesquelles passe la souris
var highlight;
var clearHighlight = function(layer) {
    if (highlight) {
      layer.resetFeatureStyle(highlight);
    }
    highlight = null;
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
                weight:.5,
              }
            } else {
              return {
                color:"white",
                opacity:1,
                weight:2.5,
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

// fetchLabel();

// affichage des labels selon le zoom
function fetchLabel() {
  fetch('data/labels.geojson')
      .then(res => res.json())
      .then(res => {
        labelReg = new L.geoJSON(res, {
            pointToLayer: function (feature, latlng) {
              return L.marker(latlng,{
                icon:createLabelIcon("labelClassReg", feature.properties.libgeom),
                interactive: false,
                className:"regLabels"
              })
            },
            filter : function (feature, layer) {
              return feature.properties.STATUT == "région";
            },
            className:"regLabels",
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
            className:"depLabels",
            rendererFactory: L.canvas()
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
            className:"spLabels",
            rendererFactory: L.canvas()
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
