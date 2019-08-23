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

L.svg({interactive: false,animate:false}).addTo(mymap); // au préalable, création d'un conteneur svg auquel on fait appel ...
// initialisation du conteneur svg
let g, svg;
legendWindow = document.getElementById('legend');

function showLayer(layer,style,stroke,lib) { // dans la fonction

  let zonageBox = document.getElementById(layer); // récupère la checkbox correspondante

  zonageBox.addEventListener("change", function() { // au click ...
    var layerChecked;
    svg = d3.select(mymap.getPanes().overlayPane)
            .select("svg") // sélectionne le conteneur svg créé par L.svg()
            .attr("pointer-events", "auto");

    // tooltip
    var tooltip = d3.select("body").append("div")
                .attr("class", "d3-tooltip")
                .style("opacity", 0);

    if (zonageBox.checked) {
      showLegend();
      function showLegend() {
        if (legendWindow.style.width = "0px") {
          d3.select("#legendTitle").style("display","block");
          // bouton (désactivé)pour fermer la fenêtre de légende
          // minLegendBtn.style.display = 'block'
          legendWindow.style.padding = "10px"; // fenetre de légende
          legendWindow.style.width = "250px"; // fenetre de légende
        };
      // légende dynamique
        var legend = d3.select("#legend")
                      .append("svg")
                      .attr("class","legendItem")
                      .attr("id","legendItem-"+layer)
                      .append("g");

        // texture dans rectangle
        legend.append("rect")
              .attr("width", 40)
              .attr("height", 22.5)
              .style("fill",style.url())
              .style("stroke-width","0.3")
              .style("stroke","grey")

        // libellé de légende
        legend.append("text")
              .text(lib)
              .attr('x', 50)
              .attr('y', 15)
      };

      // objet svg qui va accueillir les topojson des zonages
      g = svg.append("g")
             .attr("class", "leaflet-zoom-hide")
             .attr("class",layer);

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

          // nombre d'entités (à afficher ultérieurement dans le poste de légende correspondant)
          console.log(zonages.length);

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
              // 1. au clic sur une entité, ouvre le panneau latéral ...
              if (panel.style.width === "0px") {
                showContent();
                mymap.setZoom(6.458);
                mymap.setView([46.5, 3]);
              };

              // 2. au clic, surligne l'entité sélectionnée
              if (!d3.select(this).classed("selected")) {
                // change le style du précédent élément
                d3.selectAll("#previous")
                  .classed("selected",false)
                  .style("fill-opacity","0.5")
                  .style("stroke",stroke)
                  .style("stroke-width","1");
                // assigne un id à l'élément sélectionné pour le supprimer après
                d3.select(this)
                  .classed("selected",true)
                  .attr("id","previous");
                // change le style de l'élément cliqué
                d3.select(this)
                  .style("fill-opacity","1")
                  .style("stroke","red")
                  .style("stroke-width","2.5");
              } else {
                d3.select(this)
                  .classed("selected", false);
                // remet le style initial
                d3.select(this)
                  .transition()
                  .style("fill-opacity","0.5")
                  .style("stroke",stroke)
                  .style("stroke-width","1")
              };

              // 3. au clic, dessine la fiche territoire

              ficheTerritoire();

              function ficheTerritoire() {
                // récupération des informations composant la fiche
                libgeo = d.properties.lib;
                perimetre = d.properties.perimetre;
                nbcom = d.properties.nbcom;
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
                  .html("<span>" +
                        "<img src='css/img/arrow.svg'>" +
                        "Retour à l'accueil</span>")
                  .on("click", function() {
                    // enlève la fiche territoire
                    hideFiche();
                    // cette fonction se trouve dans ui.js

                    // déselectionne l'entité
                    d3.selectAll("#previous")
                      .classed("selected",false)
                      .style("stroke",stroke)
                      .style("stroke-width","1");
                  });
                  // montre la fiche territoire
                  showFiche();
                  // la fonction se trouve dans ui.js

                  // affichage du champ "info1" si présence de donnée
                  function info1() {
                    if (d.properties.info1 != null) {
                      return d.properties.info1
                    } else {
                      return ''
                    }
                  };
              }
            }).on("mouseout", function(d) {
              // disparition du tooltip
              tooltip.style("opacity", 0);
              tooltip.html("")
                     .style("left", "-500px")
                     .style("top", "-500px");
              // clic sur un contrat/zonage dans la carte
              if (!d3.select(this).classed("selected")) {
                d3.select(this).classed("selected", false);
                d3.select(this)
                  .transition()
                  .duration(100)
                  .attr("transform", "scale(1)")
                  .style("fill",style.url())
                  .style("fill-opacity","0.5")
                  .style("stroke",stroke)
                  .style("stroke-width","1");
              } else {
                console.log("OUI");
                d3.select(this)
                  .style("stroke","red")
             };
            });

          // fonction permettant à la tooltip de suivre le curseur
          function mousemove() {
            tooltip.style("left", (d3.event.pageX - 50) + "px")
               .style("top", (d3.event.pageY - 40) + "px");
          };



          // animation à l'affichage des couches
          d3.selectAll("."+layer)
            .style("opacity",0)
            .transition()
            .ease(d3.easeLinear)
            .duration(250)
            .style("opacity",1)

          // au zoom, remet les couches à la bonne échelle
          mymap.on("moveend", update);
          update();

           // mettre à jour l'emprise du calque en meme temps que leaflet
          function update() {
            return layerChecked.attr("d", path);
          }
        })

    } else { // au décochage de la checkbox correspondante ...

      // enlève le contrat/zonage coché
      d3.selectAll(".".concat(layer))
        .transition()
        .duration(500)
        .style("opacity",0)
        .transition()
        .duration(500)
        .remove();

      // enlève le poste de légende correspondant
      d3.select("#legendItem-"+layer).remove();
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
