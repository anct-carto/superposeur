/****************************************************************************************************************/
/******************************************* AFFICHAGE des COUCHES **********************************************/
/****************************************************************************************************************/

// affichage des différents calques
for (var i in textureArray) { // pour chaque élément du tableau ...
  let layer = textureArray[i].layer; // ... récupère le nom du zonage
  let style = textureArray[i].style; // ...  le style associé ...
  let stroke = textureArray[i].stroke;
  let lib = textureArray[i].lib; // ... et le libellé du zonage  ...
  showLayer(layer,style,stroke,lib) // ... auquel tu appliques la fonction (ci-dessous)
};
// /!\ toutes les variables LAYER fait référence aux ZONAGE /!\


/****************************************************************************************************************/
/******************************* FONCTION PRINCIPALE : GESTION DES COUCHES **************************************/
/****************************************************************************************************************/

// initialisation : ajout d'un moteur de rendu svg comportant déjà les éléments svg et g
// voir ==> https://groups.google.com/forum/#!topic/leaflet-js/bzM9ssegitU

L.svg({interactive: true,animate:true}).addTo(mymap); // au préalable, création d'un conteneur svg auquel on fait appel ...
var g, svg;
var y = 0;
var l = 25;
var coords;
legendWindow = document.getElementById('legend');
var clickCnt = false;
function showLayer(layer,style,stroke,lib) { // dans la fonction

  var zonageBox = document.getElementById(layer); // récupère la checkbox correspondante

  zonageBox.addEventListener("change", function() { // au click ...
    var layerChecked
    svg = d3.select(mymap.getPanes().overlayPane)
            .select("svg") // sélectionne le conteneur svg créé par L.svg()
            .attr("pointer-events", "auto");

    // tooltip
    var tooltip = d3.select("body").append("div")
                .attr("class", "d3-tooltip")
                .style("opacity", 0);

    if (zonageBox.checked) {
      // légende dynamique
      var legend = d3.select("#legend-svg")
                      .attr("height",function() {
                        return l;
                      })
                     .append("g")
                     .attr("class",layer)
      if (legendWindow.style.width = "0px") {
        d3.select("#legendTitle").style("display","block");
        // bouton pour fermer la fenêtre de légende
        // minLegendBtn.style.display = 'block'
        legendWindow.style.padding = "10px"; // fenetre de légende
        legendWindow.style.width = "250px"; // fenetre de légende
      }

      // objet svg qui va accueillir les topojson des zonages
      g = svg.append("g").attr("class", "leaflet-zoom-hide").attr("class",layer);

      console.log(layer+" checked");

      // lecture du fichier
      d3.json('data/'.concat(layer,'.topojson'))
        .then(data => {
          // adapte l'objet d3 à la projection de leaflet
          var transform = d3.geoTransform({
            point:projectPoint
          });

          var path = d3.geoPath().projection(transform);

          // accès au propriétés du fichier
          zonages = topojson.feature(data,data.objects.zonage).features;
          // /!\ "zonage" correspond au NOM D'OBJET du fichier, généré dans le script R ! ne PAS CHANGER /!\

          // appel au style correspondant au zonage ...
          g.call(style);

          // affichage du zonage sélectionné
          layerChecked = g.selectAll("path")
            .data(zonages)
            .attr("class",layer)
            .enter()
            .append("path")
            .style("fill",style.url()) // ... applique le style du zonage
            .style("fill-opacity","0.5")
            .style("stroke-width","1")
            .style("stroke",stroke)
            .on("mouseover", function(d) {
              tooltip.transition()
                .duration(400)
                .style("opacity", 0.95);
              tooltip.html(d.properties.lib)
                .style("left", (d3.event.pageX - 50) + "px")
                .style("top", (d3.event.pageY - 40) + "px");
              d3.select(this)
                .transition()
                .ease(d3.easeBack)
                .duration(100)
                .style("stroke","rgb(214, 116, 30)")
                .style("stroke-width","2.5")
                .style("fill-opacity","1")

            })
            .on("mousemove",mousemove)
            .on("click", function(d) {
              // ouvre le panneau latéral avec la fiche
              if (content.style.width === "0%") {
                showContent();
              };

              d3.selectAll("."+layer)
                .transition()
                .duration(200);
              // d3.select(".selected").classed("selected", false);
              // d3.select(this).classed("selected", true);
              // récupération des informations composant la fiche
              libgeo = d.properties.lib;
              perimetre = d.properties.perimetre;
              nbcom = d.properties.nbcom;
              // affichage du champ "info1" si présence de donnée
              function info1() {
                if (d.properties.info1 != null) {
                  return d.properties.info1
                } else {
                  return ''
                }
              };

              // Fiche territoire
              d3.select("#ficheTerritoire")
                // contenu html fiche
                .html("<p id = 'featureName'>" + libgeo + "</p>" +
                      "<table><tr><td>Type de contrat/zonage</td><td><b>"
                      + lib + "</td></b></tr>"+
                      "<tr><td>Périmètre d'application</td><td><b>"
                      + perimetre.toUpperCase() + "</b></td></tr>"+
                      "<tr><td>Nombre de communes couvertes</td><td><b>"
                      + nbcom + "</b></td></tr></table>" +
                      "<p>"+info1()+"</p>")
                 // bouton retour
                .append("button")
                .attr("id","backBtn")
                .html("<span><img src='css/img/arrow.svg' height = '15px' width = '15px'>Retour à l'accueil</span>")
                .on("click", function() {
                    hideFeatureInfo()
                });

              showFeatureInfo();

              // clic sur un contrat/zonage dans la carte
              clickCnt = true;
              if (clickCnt) {
                d3.select(this)
                  .style("stroke","red")
                  .style("stroke-width","3");
              } else {
                d3.select(this)
                .style("stroke",stroke)
                .style("stroke-width","1")
              }
            })
            .on("mouseout", function(d) {
              // disparition du tooltip
              tooltip.style("opacity", 0);
              tooltip.html("")
                     .style("left", "-500px")
                     .style("top", "-500px");
              // clic sur un contrat/zonage dans la carte
              switch (clickCnt) {
                // si l'utilisateur a cliqué ...
                case true:
                  clickCnt = false
                  d3.select(this)
                    .style("stroke","red")
                    .style("stroke-width","2");
                  if (clickCnt == true) {
                    d3.selectAll(d)
                    .style("stroke","white")
                    .style("stroke-width","0.25")
                  }
                    break;
                // sinon ... remet le style initial par défaut
                case false:
                  d3.select(this)
                    .transition()
                    .duration(100)
                    .attr("transform", "scale(1)")
                    .style("fill",style.url())
                    .style("fill-opacity","0.5")
                    .style("stroke",stroke)
                    .style("stroke-width","1")
                    break;
              }
            });

          // fonction permettant à la tooltip de suivre le mouvement de la souris
          function mousemove() {
            tooltip.style("left", (d3.event.pageX - 50) + "px")
               .style("top", (d3.event.pageY - 40) + "px");
          }

          // animation à l'affichage des couches
          d3.selectAll("."+layer)
            .style("opacity",0)
            .transition()
            .ease(d3.easeLinear)
            .duration(250)
            .style("opacity",1)

          // LEGENDE DYNAMIQUE
          legend.append("rect")
                .attr("class","rect-".concat(layer))
                .attr("width", 40)
                .attr("height", 20.5)
                .style("fill",style.url())
                .style("stroke-width","0.3")
                .style("stroke","grey")
                .attr("y",y);

          // libellé de légende
          legend.append("text")
                .text(lib)
                .attr("class","text-legend")
                .attr('x', 50)
                .attr('y', 15+y)
                .attr("id",layer.concat("-legend"));

          // au zoom, remet les couches à la bonne échelle
          mymap.on("moveend", update);
          update();

           // mettre à jour l'emprise du calque en meme temps que leaflet
          function update() {
            return layerChecked.attr("d", path);
          }

          // attributs de hauteur et de position pour les postes de légende
          y += 30
          l+=25
        })

    } else { // au décochage de la checkbox correspondante ...

      y-=30
      l-=25

      d3.select("#legend-svg")
                      .attr("height",function() {
                        return l;
                      });
      console.log(layer.concat("box unchecked"));

      // enlève le zonage coché
      d3.selectAll(".".concat(layer)).remove()
      d3.select(".rect-".concat(layer)).remove()
      d3.select("#".concat(layer+"-legend")).remove()

      // efface la fiche TERRITOIRE
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
