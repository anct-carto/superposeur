// communes
var communesPath = 'data/communes.geojson';
// chargement fichiers de zonage
var zruPath = 'data/zru.geojson';
var zruBox = document.getElementById("zru");
var qpvPath = 'data/qpv.geojson';
var qpvBox = document.getElementById("qpv");
var zrrPath = 'data/zrr.geojson';
var zrrBox = document.getElementsByName("zrr");

var communes, id = 0
var gridCom;
var libCom;

// ajax sur les communes
communes = fetch(communesPath) // appel au fichier ...
  .then(res => res.json()) // ... écoute de la réponse ...
  .then(res => {
    var data = res; // objet json récupéré  ..
    var libCom;
    for (var i = 0; i < res.length; i++) {
      libCom = [res.features[i].properties.libgeo];
    }
    console.log(libCom);
    // mymap.addControl(new L.Control.Search({
    //   layer: L.geoJSON(res,{style:{opacity:0}}),
    //   propertyName: 'libgeo',
    //   marker: false,
    // })
  // );
    // ... qu'on met comme argument dans la création des tuiles vectorielles
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
    }).on('click', e=> {
      event.preventDefault();
      highlight = e.layer.properties.libgeo;
      gridCom.setFeatureStyle(highlight,{
        weight: 2,
        color: 'red',
        opacity: 1,
        fillColor: 'red',
        fill: true,
        radius: 6,
        fillOpacity: 1
      });
      mymap.flyTo(e.latlng,10,{
        animate:true,
        duration:2.5
      })
    }).addTo(mymap);



    // bind tooltip
    var label;
    var tooltip;

    function showTooltip() {
      gridCom.on('mouseover', e => {
        label = e.layer.properties.libgeo; // donne moi le nom de la commune
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
    showTooltip();

    // surligner les entités sur lesquelles passe la souris
    var highlight;
    var clearHighlight = function() {
        if (highlight) {
          gridCom.resetFeatureStyle(highlight);
        }
        highlight = null;
      };


    gridCom.addEventListener('mouseover', e => {
      clearHighlight();
      highlight = e.layer.properties.libgeo;
      gridCom.setFeatureStyle(highlight, {
        color: 'red',
        fillColor: 'red',
        fill:true,
        opacity:1,
        animate:true,
        duration:1
      });

      // on récupère le nom de la commune sur laquelle passe la souris ...

    });

    gridCom.addEventListener('mouseout', function() {
      // vire moi les tooltips bordel de merde
      tooltip.remove();
    });

    gridCom.on('mouseover', function(e) {
      var layerCom = e.layer;
      mymap.addControl(new L.Control.Search(
        {layer:layerCom,
        initial: false,
  			propertyName: "libgeo",
  			marker: false}
      ));
    })
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

///////////////// sidebar interaction //////////////////////////
// sidebar buttons
var search = document.getElementById('search');
var couches = document.getElementById('layer')
var donwload = document.getElementById('download');

// windows to toggle
var content =  document.getElementById('content');

function show(button,windows) {
  if (windows.style.width == '50px') {
    windows.style.width = '450px';
    windows.style.transition = "0.2s";
    windows.style.opacity = '0.95'
  } else {
    windows.style.width = '50px'
  }};

// toggle on click
search.addEventListener('click', function() {
  show(search,content);
});
couches.addEventListener('click', function() {
  show(couches,content);
});
