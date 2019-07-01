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
var zrrBox = document.getElementsByName("zrr");

var communes, id = 0
var gridCom;

// ajax sur les communes
communes = fetch(communesPath) // appel au fichier ...
  .then(res => res.json()) // ... écoute de la réponse ...
  .then(res => {
    var data = res; // objet json récupéré  ..
    // console.log(data);

    gridCom = L.vectorGrid.slicer(res, {
      rendererFactory: L.canvas.tile,
      vectorTileLayerStyles: {
        sliced: comStyle
      },
      hoverStyle: {
        fillColor: 'black',
        fillOpacity: 0.5
      },
      maxZoom: 22,
      indexMaxZoom: 5,
      interactive: true,
      getFeatureId: function(f) {
				return f.properties.libgeo;
			}
    }).on('click', e => {
      showContent(search,content,highlight);
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
      mymap.flyTo([e.latlng.lat,e.latlng.lng-0.25],10,{
        animate:true,
        duration:1.5
      });
    }).addTo(mymap);

    // bind tooltip
    var label;
    var tooltip;
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

    showTooltip();

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
//////////////////// FONCTIONS //////////////////////////////////

// fonction import des fichiers de zonage
function fetchZonage(zonage,style) {
  fetch(zonage, {method: 'get'})
    .then(response => response.json())
    .then(response => {
      L.geoJSON(response,{
        style: style
      })
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

//////////////////// STYLES COUCHES //////////////////////////////
var comStyle = {
        weight: 0.8,
        color: "#3e62a4",
        opacity: 1,
        fillOpacity: 0.5,
        fillColor:"white"};

var zruStyle = { weight: 0.8,
                color: "blue",
                opacity: 1,
                fillOpacity: 0.5,
                fillColor:"blue" };

var qpvStyle = { weight: 0.8,
          color: "#8c0000",
          opacity: 1,
          fillOpacity: 0.5,
          fillColor:"#8c0000"};
