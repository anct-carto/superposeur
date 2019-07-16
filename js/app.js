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
      interactive: false, // pour pouvoir afficher des tooltips et clicker sur les communes
      getFeatureId: function(f) {
				return f.properties.codgeo; // pour l'affichage des tooltips
			}
    }).on('click', e => { // au click ...
      mymap.flyTo([e.latlng.lat,e.latlng.lng-0.25],10,{ // zoom la carte sur la commune clickée ...
        animate:true,
        duration:1.5
      });
      showContent(search,content,highlight); // ... et ouvre la fenetre laterale
      highlight = e.layer.properties.codgeo;
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
        label = e.layer.properties.codgeo; // donne moi le nom de la commune
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
      highlight = e.layer.properties.codgeo;
      gridCom.setFeatureStyle(highlight, {
        color: '#d6741e',
        fillColor: 'red',
        fillOpacity:0.5,
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
        weight: 0.35,
        color: "#004494",
        // color: "#3e62a4",
        opacity: 1,
        fill:true,
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
// création d'un tableau avec les styles par zonage
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

// boucle lancant la fonction d'affichage du zonage pour chaque zonage présent dans le tableau
// for (var i in zonageArray) {
//   var zonage = zonageArray[i].zonage; // nom du zonage
//   var style = zonageArray[i].style; // style associé
//   showZonage(zonage,style)
// };
//
// // fonction faisant appel au fichier et affichant le zonage voulu
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

//////////////////// FONCTIONS //////////////////////////////////
// surligner les entités sur lesquelles passe la souris
var highlight;
var clearHighlight = function(layer) {
    if (highlight) {
      layer.resetFeatureStyle(highlight);
    }
    highlight = null;
  };

// /////////////// Textures ///////////////////////////////////
// ajout d'un calque svg vide à leaflet
var afr = document.getElementById("afr");
var qpvTexture = textures.circles().radius(2).background("darkorange");
var zruTexture = textures.circles().radius(5).background("green")
var zrrTexture = textures.circles().radius(1).background("yellow")
let textureArray = [
                    {
                      zonage:'zru',
                      style:zruTexture
                    },
                    {
                      zonage:'qpv',
                      style:qpvTexture
                    },
                    {
                      zonage:'zrr',
                      style:zrrTexture
                    }
                  ];

for (var i in textureArray) {
  var zonage = textureArray[i].zonage; // nom du zonage
  var style = textureArray[i].style; // style associé
  showLayer(zonage,style)
};

function showLayer(zonage,style) {
  var zonageBox = document.getElementById(zonage);
  console.log(zonage);
  zonageBox.addEventListener("click", function() {
    if (zonageBox.checked) {
      L.svg(zonage).addTo(mymap);
      console.log("checked");
      // appel au fichier json
      d3.json('data/'.concat(zonage,'.geojson'))
        .then(function (data) {
          // sélectionne le calque svg précedemment créé)
          svg = d3.select(mymap.getPanes().overlayPane).select("svg");
          g = svg.append("g").attr("class", "leaflet-zoom-hide");
          // adapte l'objet d3 à la projection de leaflet
          var transform = d3.geoTransform({point:projectPoint});
          var path = d3.geoPath().projection(transform);
          g.call(style);
          zonageLayer = g.selectAll("path")
            .attr("class",zonage)
            .data(data.features)
            .enter()
            .append("path")

            .style("fill",style.url());
            // .style("fill","red")
            // .style("fillOpacity","0.5");
          mymap.on("moveend", update);
          update();

          // projection
          function projectPoint(x, y) {
            var point = mymap.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
          };
          function update() {
            zonageLayer.attr("d", path);
          }
        })
    } else {
      console.log("unchecked");
      // L.svg(zonage).removeFrom(mymap);
      zonageLayer.attr("class",zonage).remove()
    }
  })
}
