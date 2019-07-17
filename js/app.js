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
        fillOpacity: 0.2
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
        weight: 0.2,
        color: "#004494",
        // color: "#3e62a4",
        opacity: 1,
        fill:true,
        fillOpacity: 0.25,
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
var afrTexture = textures.circles()
                  .lighter()
                  .fill("black")
                  .background("blue");
var qpvTexture = textures.circles()
                  .lighter()
                  .fill("white")
                  .background("darkred");
var zfuTexture = textures.circles()
                  .radius(5)
                  .background("green")
var zrrTexture = textures.circles()
                  .radius(1)
                  .background("yellow")

let textureArray = [
                    {
                      layer:'afr',
                      style:afrTexture
                    },
                    {
                      layer:'qpv',
                      style:qpvTexture
                    },
                    {
                      layer:'zfu',
                      style:zfuTexture
                    },
                    {
                      layer:'zrr',
                      style:zrrTexture
                    }
                  ];

// affichage des différents calques
for (var i in textureArray) { // pour chaque élément du tableau ...
  var layer = textureArray[i].layer; // ... récupère le nom du zonage
  var style = textureArray[i].style; // .. et le style associé ...
  showLayer(layer,style) // ... auquel tu appliques la fonction
};


// initialisation : ajout d'un moteur de rendu svg comportant déjà les éléments svg et g
// voir ==> https://groups.google.com/forum/#!topic/leaflet-js/bzM9ssegitU
L.svg({clickable:true,interactive:true}).addTo(mymap); // au préalable, création d'un conteneur svg auquel on fait appel ...
// FONCTION d'AFFICHAGE DES DIFFERENTES COUCHES
function showLayer(layer,style) { // dans la fonction
  var zonageBox = document.getElementById(layer); // récupère la checkbox correspondante
  zonageBox.addEventListener("change", function() { // au click ...

    if (zonageBox.checked) {
      console.log(layer+" checked");
      var tabZonages = [];
      d3.json('data/'.concat(layer,'.json')) // lecture du fichier
        .then(function (data) {
          console.log(data.objects);
          // adapte l'objet d3 à la projection de leaflet
          var transform = d3.geoTransform({point:projectPoint});
          var path = d3.geoPath().projection(transform);
          zonages = topojson.feature(data,data.objects.zonage).features;
          console.log(zonages);
          svg = d3.select("#mapid").select("svg"); // sélectionne le conteneur svg créé par L.svg()
          g = svg.append("g").attr("class", "leaflet-zoom-hide").attr("class",layer);
          g.call(style); // appel au style correspondant au zonage
          layerChecked = g.selectAll("path")
            .data(zonages)
            // .data(data.features)
            .attr("class",layer)
            .enter()
            .append("path")
            .style("fill-opacity","0.5")
            .style("fill",style.url()) // applique le style du zonage
          // au zoom, remet les couches à la bonne échelle
          mymap.on("moveend", update);
          update();

          console.log(layerChecked);

          function update() { // mettre à jour l'emprise du calque en meme temps que leaflet
            return layerChecked.attr("d", path);
          };

        })
    } else { // au décochage de la checkbox correspondante ...
      // enlève le zonage identifié dans le DOM par la classe du zonage
      d3.selectAll(".".concat(layer)).remove()
    }
  })
}

// fonctions utilisées pour l'affichage des objets D3
function projectPoint(x, y) { // fonction de chgt de projection pour d3.geoTransform
  var point = mymap.latLngToLayerPoint(new L.LatLng(y, x));
  this.stream.point(point.x, point.y);
};
