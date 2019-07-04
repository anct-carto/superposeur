/* Ce fichier fait partie du code source du superposeur de zonages
Auteur : Hassen Chougar, Service Cartographie du CGET
Données : Observatoire du Territoire, Service Cartographie */


// url communes
var communesPath = 'data/communes.geojson';
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
        color: '#d6741e',
        opacity: 1,
        fillColor: '#d6741e',
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
        color: '#d6741e',
        fillColor: 'red',
        fill:false,
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
        fillColor:"white",
      };

var zrrStyle = { weight: 0.8,
                color: 'yellow',
                opacity: 1,
                fillOpacity: 0.5,
                fillColor:'yellow',
                animate:true,
                interactive:false,
              };

var zruStyle = {
                weight: 0.8,
                color: 'purple',
                opacity: 1,
                fillOpacity: 0.5,
                fillColor:'purple',
                interactive:false,
              };

var qpvStyle = {
                weight: 0.8,
                color: "#8c0000",
                opacity: 1,
                fillOpacity: 0.5,
                fillColor:"#8c0000",
                interactive:false,

              };

////////////////// PERIMETRES ///////////////////////
// création
let zonageArray = [
                    {
                      zonage:'zru',
                      style:zruStyle
                    },
                    {
                      zonage:'qpv',
                      style:qpvStyle
                    },
                    {
                      zonage:'zrr',
                      style:zrrStyle
                    }
                  ];

console.log(zonageArray);

for (var i in zonageArray) {
  var zonage = zonageArray[i].zonage; // nom du zonage
  var style = zonageArray[i].style; // style associé
  showZonage(zonage,style)
};

function showZonage(zonage,style) {
  var zonageBox = document.getElementById(zonage); // la checkbox correspondante récupérer depuis le html
  var zonageLayer = zonage.concat('Layer'); // donner un nom à la couche
  zonageBox.addEventListener('click', function() {
    fetch('data/'.concat(zonage,'.geojson'))
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

//////////////////// FONCTIONS //////////////////////////////////
// surligner les entités sur lesquelles passe la souris
var highlight;
var clearHighlight = function(layer) {
    if (highlight) {
      layer.resetFeatureStyle(highlight);
    }
    highlight = null;
  };
