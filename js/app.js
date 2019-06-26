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
communes = fetch(communesPath) // appel au fichier ...
  .then(res => res.json()) // ... écoute de la réponse ...
  .then(res => {
    var data = res;
    console.log(res); // objet json récupéré  ..

    // ... qu'on met comme argument dans la création des tuiles vectorielles
    var gridCom = L.vectorGrid.slicer(res, {
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
        duration:0.5
      })
    }).addTo(mymap);

    // surligner les entités sur lesquelles passe la souris
    var highlight;
    var clearHighlight = function() {
        if (highlight) {
          gridCom.resetFeatureStyle(highlight);
        }
        highlight = null;
      };

    // bind tooltip
    var label;
    var tooltip;

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
      label = e.layer.properties.libgeo; // donne moi le nom de la commune
      // fout le dans un tooltip qui va s'afficher aux coordonnées de la commune
      tooltip = L.tooltip( {direction: 'right',className:'leaflet-tooltip'})
                  .setContent(label)
                  .setLatLng(e.latlng)
                  .addTo(mymap);
    });

    gridCom.addEventListener('mouseout', function() {
      clearHighlight();
      // vire moi les tooltips bordel de merde
      tooltip.remove();
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

// ... pour le mettre dans une div
// var tooltipWrap = document.createElement("div"); //creates div
// tooltipWrap.className = 'tooltip'; //adds class
// tooltipWrap.appendChild(document.createTextNode('<p>'+label+'</p>')); //add the text node to the newly created div.
// // coordonnées du curseur de souris
// var x = event.clientX;
// var y = event.clientY;
// console.log('coords',x,y);
// tooltipWrap.setAttribute('style','left:'+x+'px;'+'top:'+y+'px');
// console.log(tooltipWrap);
