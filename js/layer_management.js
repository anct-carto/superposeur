/////////////////////////////////// SYMBOLOGIE ///////////////////////////////////
let afrTexture = textures.circles()
                  .lighter()
                  .size(3)
                  .fill("black")
                  .background("pink");

let cvTexture = textures.circles()
                  .lighter()
                  .fill("white")
                  .background("darkred");

let zfuTexture = textures.circles()
                  .size(5)
                  .fill("darkorange")
                  .stroke("darkorange")

let acvTexture = textures.circles()
                  .size(10)
                  .fill("pink")

let crTexture = textures.lines()
                        .orientation("vertical")
                        .strokeWidth(1)
                        .shapeRendering("crispEdges");

let zrrTexture = textures.lines()
                  .size(8)
                  .strokeWidth(2)
                  .stroke('green')
                  // .background("yellow")

let textureArray = [
                    {
                      layer:'afr',
                      lib:"Zone d'Aide à Finalité Régionale",
                      style:afrTexture,
                    },
                    {
                      layer:'ber',
                      lib:"Bassin d'Emploi à Redynamiser",
                      style:afrTexture,
                    },
                    {
                      layer:'cr',
                      lib:"Contrat de ruralité",
                      style:crTexture,
                    },
                    {
                      layer:'cv',
                      lib:"Contrat de ville",
                      style:cvTexture,
                    },
                    {
                      layer:'zfu',
                      lib:"Zone Franche urbaine",
                      style:zfuTexture
                    },
                    {
                      layer:'zrr',
                      lib:"Zone de Revitalisation Rurale",
                      style:zrrTexture
                    },
                    {
                      layer:'acv',
                      lib:"Action Coeur de ville",
                      style:acvTexture
                    }
                  ];

/////////////////////////////////// COUCHES ///////////////////////////////////

// affichage des différents calques
for (var i in textureArray) { // pour chaque élément du tableau ...
  var layer = textureArray[i].layer; // ... récupère le nom du zonage
  var style = textureArray[i].style; // .. et le style associé ...
  var lib = textureArray[i].lib; // .. et le style associé ...
  showLayer(layer,style,lib) // ... auquel tu appliques la fonction
};

// /!\ toutes les variables LAYER fait référence aux ZONAGE /!\

// initialisation : ajout d'un moteur de rendu svg comportant déjà les éléments svg et g
// voir ==> https://groups.google.com/forum/#!topic/leaflet-js/bzM9ssegitU

L.svg({interactive: true}).addTo(mymap); // au préalable, création d'un conteneur svg auquel on fait appel ...
var g, svg;
var y = 0;
var l = 25;
// FONCTION d'AFFICHAGE DES DIFFERENTES COUCHES

/////////////////////////// FONCTION PRINCIPALE ////////////////////////////////

legendWindow = document.getElementById('legend');

function showLayer(layer,style,lib) { // dans la fonction

  var zonageBox = document.getElementById(layer); // récupère la checkbox correspondante

  zonageBox.addEventListener("change", function() { // au click ...
    var layerChecked
    svg = d3.select(mymap.getPanes().overlayPane)
            .select("svg") // sélectionne le conteneur svg créé par L.svg()
            .attr("pointer-events", "auto");

    // tooltip
    var div = d3.select("body").append("div")
                .attr("class", "d3-tooltip")
                .style("opacity", 0);

    if (zonageBox.checked) {
      var legend = d3.select("#legend-svg")
                      .attr("height",function() {
                        return l;
                      })
                     .append("g")
                     .attr("class",layer) // légende dynamique

      if (legendWindow.style.width = "0px") {
        d3.select("#legendTitle").style("display","block");
        // minLegendBtn.style.display = 'block'
        legendWindow.style.padding = "10px"; // fenetre de légende
        legendWindow.style.width = "200px"; // fenetre de légende
      }

      // objet svg accueillan les couches des zonages
      g = svg.append("g").attr("class", "leaflet-zoom-hide").attr("class",layer);

      console.log(layer+" checked");

      d3.json('data/'.concat(layer,'.topojson')) // lecture du fichier
        .then(function (data) {
          console.log(data);
          // adapte l'objet d3 à la projection de leaflet
          var transform = d3.geoTransform({
            point:projectPoint
          });
          var path = d3.geoPath().projection(transform);

          zonages = topojson.feature(data,data.objects.zonage).features;

          g.call(style); // appel au style correspondant au zonage ...

          layerChecked = g.selectAll("path")
            .data(zonages)
            .attr("class",layer)
            .enter()
            .append("path")
            .style("fill",style.url()) // ... applique le style du zonage
            .style("fill-opacity","0.5")
            .style("stroke","white")
            .style("stroke-width","1")
            .on("mouseover", function(d) {
              div.transition()
                .duration(200)
                .style("opacity", 0.95);
              div.html(d.properties.lib)
                .style("left", (d3.event.pageX - 100) + "px")
                .style("top", (d3.event.pageY - 40) + "px");
              d3.select(this)
                .style("stroke","darkred")
                .style("stroke-opacity","0.25")
                .style("fill","yellow")
                .style("fill-opacity","0.05")
                .transition()
                .ease(d3.easeBack)
                .duration(1000) //surlignage
            })
            .on("mouseout", function(d) {
              div.style("opacity", 0);
              div.html("")
                  .style("left", "-500px")
                  .style("top", "-500px");
              d3.select(this).style("stroke","white")
                .style("fill",style.url()) // ... applique le style du zonage
                .style("fill-opacity","0.65") //hightlight du layer
                .transition()
                .ease(d3.easeBack)
                .duration(1000)
            })
            .on("click", function(d) {
              console.log(d);
              libgeo = d.properties.lib;
              codgeo = d.properties.id;
              d3.select("#layerInfo")
              .html(codgeo+" "+libgeo);
              console.log(codgeo,libgeo);
              console.log("ok");
              libgeo = []
            });

          // LEGENDE DYNAMIQUE
          legend.append("rect")
                .attr("class","rect-".concat(layer))
                .attr("width", 40)
                .attr("height", 22.5)
                .style("fill",style.url())
                .style("stroke-width","0.3")
                .style("stroke","grey")
                .attr("y",y);

          legend.append("text")
                .text(lib)
                .attr("class","text-legend")
                .attr('x', 50)
                .attr('y', 15+y)
                .attr("id",layer.concat(" legend"));

          mymap.on("moveend", update); // au zoom, remet les couches à la bonne échelle
          update();

          y += 30
          l+=25
          function update() { // mettre à jour l'emprise du calque en meme temps que leaflet
            return layerChecked.attr("d", path);
          }

        })

    } else { // au décochage de la checkbox correspondante ...

      y-=30
      l-=25

      d3.select("#legend-svg")
                      .attr("height",function() {
                        return l;
                      })
      console.log(layer.concat("box unchecked"));
      d3.selectAll(".".concat(layer)).remove() // enlève le zonage coché
      d3.select(".rect-".concat(layer)).remove()
      d3.select("#".concat(layer+" legend")).remove()
    }

    // masquer la fenetre de légende si aucun zonage n'est sélectionné
    checkCheckbox();
  })
}

// fonctions utilisées pour l'affichage des objets D3
function projectPoint(x, y) { // fonction de chgt de projection pour d3.geoTransform
  var point = mymap.latLngToLayerPoint(new L.LatLng(y, x));
  this.stream.point(point.x, point.y);
};


// masquer la fenetre de légende quand au désaffichage de toutes les cases
function legendControl() {
    d3.select("#legendTitle").style("display","none");
    legendWindow.style.width = "0px"; // fenetre de légende
    legendWindow.style.padding = "0px"; // fenetre de légende
    // minLegendBtn.style.display = 'none'
}

function checkCheckbox() {
  var countCheckbox = document.querySelectorAll('input:checked');
  if (countCheckbox.length === 0) {
    console.log("all checkboxes unchecked");
    legendControl()
  }
}

// réduire la fenetre de légende
// var minLegendBtn = document.getElementById("minLegend");
// minLegendBtn.addEventListener('click', function() {
//   if (legendWindow.style.width === "250px") {
//     legendControl();
//     d3.selectAll("g").remove()
//   }
// });
