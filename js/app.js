/* Ce fichier fait partie du code source du superposeur de zonages
Auteur : Hassen Chougar, Service Cartographie du CGET
Données : Observatoire du Territoire, Service Cartographie */


// url communes
var communesPath = 'data/communes.geojson';
// url fichiers de zonage
var zruPath = 'data/zru.geojson';
var zruBox = document.getElementById("zru");
var qpvPath = 'data/qpv.geojson';
var qpvBox = document.getElementById("qpv");
var zrrPath = 'data/zrr.geojson';
var zrrBox = document.getElementById("zrr");

var communes, id = 0
// calque des communes, vide pour l'instant
var gridCom;

///////////////////////// REQUETES SUR LES COMMUNES ////////////////////////
// ajax sur les communes
communes = fetch(communesPath) // appel au fichier ...
  .then(res => res.json()) // ... écoute de la réponse ...
  .then(res => {
    var data = res; // objet json récupéré  ..
    // console.log(data);
    // création des tuiles vectorielles comprenant les communes
    gridCom = L.vectorGrid.slicer(res, {
      rendererFactory: L.canvas.tile, // affichage par canvas ou svg (svg + lourd)
      vectorTileLayerStyles: {
        sliced: comStyle
      },
      hoverStyle: { // ne fonctionne pas
        fillColor: 'black',
        fillOpacity: 0.5
      },
      maxZoom: 22,
      indexMaxZoom: 5,
      interactive: true, // pour pouvoir afficher des tooltips et clicker sur les communes
      getFeatureId: function(f) {
				return f.properties.libgeo; // pour l'affichage des tooltips
			}
    }).on('click', e => { // au click ...
      mymap.flyTo([e.latlng.lat,e.latlng.lng-0.25],10,{ // zoom la carte sur la commune clickée ...
        animate:true,
        duration:1.5
      });
      showContent(search,content,highlight); // ... et ouvre la fenetre laterale
      highlight = e.layer.properties.libgeo;
      console.log(highlight);
      gridCom.setFeatureStyle(highlight,{
        weight: 2,
        color: 'red',
        opacity: 1,
        fillColor: 'red',
        fill: true,
        radius: 6,
        fillOpacity: 1
      });
    }).addTo(mymap);

    // bind tooltip
    var label;
    var tooltip;
    showTooltip();

    function showTooltip() {
      gridCom.on('click', e => {
        label = e.layer.properties.libgeo; // donne moi le nom de la commune
        // fout le dans un tooltip qui va s'afficher aux coordonnées de la commune
        tooltip = L.tooltip( {direction: 'right',className:'leaflet-tooltip'})
                    .setContent(label)
                    .setLatLng(e.latlng)
                    .addTo(mymap);
      });
      // gridCom.on('click', e=> {
       //   tooltip.remove();
      //   clearHighlight();
      // })
    };

    // on récupère le nom de la commune sur laquelle passe la souris ...
    gridCom.addEventListener('mouseover', e => {
      clearHighlight(gridCom);
      highlight = e.layer.properties.libgeo;
      gridCom.setFeatureStyle(highlight, {
        color: 'red',
        fillColor: 'red',
        fill:true,
        opacity:1,
        animate:true,
        duration:5
      });
    });
    // gridCom.on('click', e => {
    //   tooltip = L.tooltip( {direction: 'right',className:'leaflet-tooltip'})
    //               .setContent(label)
    //               .setLatLng(e.latlng)
    //               .addTo(mymap)
    // })
    //
    gridCom.addEventListener('mouseout', function() {
      clearHighlight(gridCom);
      // vire moi les tooltips bordel de merde
      // tooltip.remove();
    });
});


//////////////////// STYLES COUCHES //////////////////////////////
var comStyle = {
        weight: 0.8,
        color: "#3e62a4",
        opacity: 1,
        fillOpacity: 0.5,
        fillColor:"white"};

var zruStyle = { weight: 0.8,
                color: 'purple',
                opacity: 1,
                fillOpacity: 0.5,
                fillColor:'purple' };

var qpvStyle = { weight: 0.8,
          color: "#8c0000",
          opacity: 1,
          fillOpacity: 0.5,
          fillColor:"#8c0000"};

////////////////// afficher les périmètres ///////////////////////

// function displayZonage(perimetre,checkbox,path,style) {
//   checkbox.addEventListener('change', function() {
//     if (checkbox.checked) {
//       console.log('checked');
//       var perimetre = fetchZonage(path,style);
//       console.log(perimetre);
//     }
//     else {
//       console.log('unchecked');
//     }
//   });
// };

let zonageArray = [{'zru':zruStyle,'qpv':qpvStyle}];
for (var i in zonageArray) {
  console.log(zonageArray[i].zru);
  showZonage(zonageArray[i])
}

//showZonage('zru',zruStyle)
//showZonage('qpv',qpvStyle)
//showZonage('zrr',comStyle)

function showZonage(zonage,style) {
  // var zonage = zonageName[i];
  console.log(zonage);
  zonageStyle = zonage+style
  var zonageBox = zonage + 'Box'; // nom checkbox
  var zonageBox = document.getElementById(zonage); // la récupérer depuis le html
  var zonageLayer = zonage+'Layer'; // nom de la couche
  // console.log(zonageBox);
  // console.log(zonage+'.geojson'); // chemin
  zonageBox.addEventListener('change', function() {
    fetch('data/'+zonage+'.geojson')
      .then(res => res.json())
      .then(res => {
        if (zonageBox.checked) {
          console.log('checked');
          zonageLayer = L.geoJSON(res,{style:style});

          zonageLayer.addTo(mymap);
        } else {
          console.log('unchecked');
          mymap.removeLayer(zonageLayer)
        }
      })
    })
};

var MELOstyle;
function defineStyle(feature) {
  MELOstyle = feature.properties.codgeo+"Style";
  console.log(MELOstyle);
  return MELOstyle;
}

//////////////////// FONCTIONS //////////////////////////////////
// surligner les entités sur lesquelles passe la souris
var highlight;
var clearHighlight = function(layer) {
    if (highlight) {
      layer.resetFeatureStyle(highlight);
    }
    highlight = null;
  };
