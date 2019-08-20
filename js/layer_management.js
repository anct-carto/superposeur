/****************************************************************************************************************/
/******************************************* SYMBOLOGIE DES FICHIERS ********************************************/
/****************************************************************************************************************/

let acvTexture = textures.lines()
                  .orientation("vertical")
                  .stroke("rgb(255, 80, 0)")
                  .size(10)
                  .strokeWidth(10);

let afrTexture = textures.circles()
                  .lighter()
                  .size(3)
                  .fill("black")
                  .background("pink");

let amicbTexture = textures.circles()
                  .lighter()
                  .fill("white")
                  .background("darkred");

let berTexture = textures.circles()
                  .size(7.5)
                  .radius(2)
                  .fill("white")
                  .background("darkblue");

let budTexture = textures.circles()
                  .lighter()
                  .size(3)
                  .fill("grey")
                  .background("purple");

let cdtTexture = textures.lines()
                  .shapeRendering("crispEdges")
                  .stroke("rgb(3, 173, 252)")
                  .size(5)
                  .strokeWidth(2.5)

let cpierTexture = textures.circles()
                  .thicker()
                  .size(4.5)
                  .fill("yellow");

let crTexture = textures.paths()
                  .d("woven")
                  .lighter()
                  .stroke("rgb(99, 121, 57)")
                  .background("rgb(188, 189, 34)")
                  .thicker();

let cteTexture = textures.lines()
                  .shapeRendering("crispEdges")
                  .stroke("rgb(3, 252, 152)")
                  .size(5)
                  .strokeWidth(2.5);

let cvTexture = textures.circles()
                  .lighter()
                  .fill("white")
                  .background("rgb(153, 0, 153)");

let zfuTexture = textures.lines()
                  .orientation("vertical")
                  .stroke("yellow")
                  .size(10)
                  .strokeWidth(10);

let zrdTexture = textures.lines()
                  .size(8)
                  .strokeWidth(10)
                  .stroke('rgb(140, 86, 75)');

let zrrTexture = textures.lines()
                  .size(8)
                  .strokeWidth(2)
                  .stroke('green');

/****************************************************************************************************************/
/****************************************** TABLEAU .json DES STYLES ********************************************/
/****************************************************************************************************************/

let textureArray = [
                    {
                      layer:'afr',
                      lib:"Zone d'Aide à Finalité Régionale",
                      style:afrTexture,
                    },
                    {
                      layer:'acv',
                      lib:"Action Coeur de ville",
                      style:acvTexture
                    },
                    {
                      layer:'amicb',
                      lib:"Appel à Manifestation d'Intérêt Centre-bourg",
                      style:amicbTexture,
                    },
                    {
                      layer:'ber',
                      lib:"Bassin d'Emploi à Redynamiser",
                      style:berTexture,
                    },
                    {
                      layer:'bud',
                      lib:"Bassin Urbain à Dynamiser",
                      style:budTexture,
                    },
                    {
                      layer:'cdt',
                      lib:"Contrat de Développement Territorial",
                      style:cdtTexture,
                    },
                    {
                      layer:'cpier',
                      lib:"Contrat de Plan Interrégional État-Région",
                      style:cpierTexture,
                    },
                    {
                      layer:'cr',
                      lib:"Contrat de ruralité",
                      style:crTexture,
                    },
                    {
                      layer:'cte',
                      lib:"Contrat de Transition Écologique",
                      style:cteTexture,
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
                      layer:'zrd',
                      lib:"Zone de Restructuration de la Défense",
                      style:zrdTexture
                    },
                    {
                      layer:'zrr',
                      lib:"Zone de Revitalisation Rurale",
                      style:zrrTexture
                    }
                  ];

/****************************************************************************************************************/
/******************************************* AFFICHAGE des COUCHES **********************************************/
/****************************************************************************************************************/

// affichage des différents calques
for (var i in textureArray) { // pour chaque élément du tableau ...
  var layer = textureArray[i].layer; // ... récupère le nom du zonage
  var style = textureArray[i].style; // ...  le style associé ...
  var lib = textureArray[i].lib; // ... et le libellé du zonage  ...
  showLayer(layer,style,lib) // ... auquel tu appliques la fonction (ci-dessous)
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
function showLayer(layer,style,lib) { // dans la fonction

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
        // minLegendBtn.style.display = 'block' // bouton pour fermer la fenêtre de légende
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
            .style("fill-opacity","0.4")
            .style("stroke-width","0.25")
            .style("stroke","white")
            .on("mouseover", function(d) {
              tooltip.transition()
                .duration(400)
                .style("opacity", 0.95);
              tooltip.html(d.properties.lib)
                .style("left", (d3.event.pageX - 50) + "px")
                .style("top", (d3.event.pageY - 40) + "px");
              d3.select(this)
                .style("stroke","rgb(214, 116, 30)")
                .style("stroke-width","1.5")
                .style("fill-opacity","1")

            })
            .on("mousemove",mousemove)
            .on("click", function(d) {
              // ouvre le panneau latéral avec la fiche
              if (content.style.width === "0px") {
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
              d3.select("#layerInfo")
                .html("<p id = 'featureName'>" + libgeo + "</p>" +
                      "<table><tr><td>Type de contrat/zonage</td><td><b>" + lib + "</td></b></tr>"+
                      "<tr><td>Périmètre d'application</td><td><b>" + perimetre.toUpperCase() + "</b></td></tr>"+
                      "<tr><td>Nombre de communes couvertes</td><td><b>" + nbcom + "</b></td></tr></table>" +
                      "<p>"+info1()+"</p>")
                .append("button")
                .attr("id","backBtn")
                .html("<span><img src='css/img/arrow.svg' height = '15px' width = '15px'>Retour à l'accueil</span>")
                .on("click", function() {
                    hideFeatureInfo()
                });

              showFeatureInfo();
              
              clickCnt = true;
              if (clickCnt) {
                d3.select(this)
                  .style("stroke","red")
                  .style("stroke-width","2");
              } else {
                d3.select(this)
                .style("stroke","white")
                .style("stroke-width","0.25")
              }
            })
            .on("mouseout", function(d) {
              // disparition du tooltip
              tooltip.style("opacity", 0);
              tooltip.html("")
                     .style("left", "-500px")
                     .style("top", "-500px");

              switch (clickCnt) {
                case true:
                  clickCnt = false
                  console.log("OUI");
                  d3.select(this)
                    .style("stroke","red")
                    .style("stroke-width","2");
                  if (clickCnt == true) {
                    d3.selectAll(d)
                    .style("stroke","white")
                    .style("stroke-width","0.25")
                  }
                    break;
                case false:
                  console.log("NON");
                  d3.select(this)
                    .transition()
                    .duration(100)
                    .attr("transform", "scale(1)")
                    .style("fill",style.url())
                    .style("fill-opacity","0.4")
                    .style("stroke","white")
                    .style("stroke-width","0.25")
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
                .attr("height", 22.5)
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
