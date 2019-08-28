/*

	@ File : ui.js
	@ Author : Hassen Chougar, Service Cartographie du CGET
	@ Date : 08/2019

	@ For : ViZonage - Carte interactive des contrats et zonages de politiques publiques
	@ Main file : index.html

	@ Description : script nécessaire à la gestion dynamique de certains éléments
                  d'interface : sidebar, sidepanel, boutons sidebar, fiche
                  territoire, checkboxes, popup "à propos".
                  Certaines des fonctions présentes dans ce fichier sont
                  également appelées au sein du ficher layer_management.js :
                   -> showContent();
                   -> showFiche() et hideFiche();
                   -> showFiche() et hideFiche();

                 A manipuler avec précaution.
*/

/******************************************************************************/
/************************ INTERACTION PANNEAU LATERAL *************************/
/******************************************************************************/
// sidebar buttons
var homeBtn = document.getElementById('homeBtn');
var closeBtn = document.getElementById('closeContent');
// var donwload = document.getElementById('download');
// elements to toggle
var panel =  document.getElementById('sidebar-panel');
var intro = document.getElementById("intro");
var listeZonages = document.getElementById('cat-zonages');

// ouvrir la fenetre latérale au chargement
var interval = setInterval(function() {
    if(document.readyState === 'complete') {
        panelSlide();
        clearInterval(interval);
      }
    }, 500);

// sur chaque bouton, appliquer la fonction pour fermer le panneau latéral
[homeBtn,closeBtn].forEach(function (btn) {
  btn.addEventListener('click', function() {
    showContent();
    hideFiche();
  });
})


function showContent() {
  if (panel.style.width === '0px') {
    panelSlide();
  } else {
    panel.style.width = '0px';
    panel.style.paddingLeft = '0px';
    panel.style.paddingRight = '0px';
    listeZonages.style.display = 'none';
    document.getElementById('legend').style.marginLeft = '70px'
    intro.style.display = 'none';
    let t = setInterval(function() {
      mymap.setZoom(6.458);
      mymap.setView([46.5, 3]);
      clearInterval(t)
    },0);
  }
};

function panelSlide() {
  panel.style.width = '500px';
  panel.style.marginLeft = '55px';
  panel.style.paddingLeft = '25px';
  panel.style.paddingRight = '20px';
  document.getElementById('legend').style.marginLeft = '620px'
  // déplacement du centre de la carte
  let t = setInterval(function() {
    mymap.setView([46.5, -2])
    clearInterval(t)
  },0);
  if (panel.style.width === '500px') {
    var x = setInterval(function () {
      intro.style.display = 'block';
      listeZonages.style.display = 'block';
      clearInterval(x)
    },400);
  }
};



/******************************************************************************/
/************************** MENUS CONTRATS/ZONAGES ****************************/
/******************************************************************************/

let expandBtn = document.querySelectorAll('.expandBtn');
let showDes = 1;

// style description
let descriptionStyle = 'rgba(0,0,0,0.5)';

expandBtn.forEach(btn => {
  btn.addEventListener('click', function() {
    showDes++;
    this.classList.toggle('collapsed');
    // récupère l'élément situé après le bouton dans le html
    var description = this.nextElementSibling;
    if (showDes % 2 == 0) {
      description.style.maxHeight = '400px';
      this.parentNode.style.background = descriptionStyle;
    } else {
      description.style.maxHeight = '0px'
      this.parentNode.style.background = ''
    }
  })
});

// rendu des balises <li> cliquables
let libZonage = document.querySelectorAll('.libZonage');
libZonage.forEach(label => {
    label.addEventListener('click', function() {
      // récupère le précédent élément du label, soit l'input/checkbox
      input = label.previousElementSibling;
      // récupère l'élément parent, soit la balise li
      li = label.parentNode;
      if (input.checked) {
        li.style.background = "";
        label.style.borderRadius = "";
      } else {
        li.style.background = descriptionStyle;
        label.style.borderRadius = "5px";
      }
    });
});


// Ajout des informations au menu déroulant depuis le fichier data/descriptions.csv
getExpanded();

function getExpanded() {
  d3.csv("data/descriptions.csv")
  .then(data => {
    data.forEach(d => {
      div = document.getElementById(d.ACRONYME.toLowerCase().concat("-desc"))
      div.innerHTML = "<hr><p><img src= 'css/img/download.svg' id ='pictoDescr'</img>" +
                      "<a href='cartes/" + d.ACRONYME.toLowerCase().concat("-01.jpg") +"' target='_blank'>"+
                      "Télécharger la carte papier</a></p>"+
                      "<p><b>Niveau(x) géographique(s) : </b>" + d.ECHELON + "</p>" +
                      "<p><b>À propos : </b>"+
                      ""+ d.DESCRIPTION_COURTE + "</p>" +
                      "<p>"+ d.DESCRIPTION_LONGUE + "</p>" +
                      "<p><b>Dernière mise à jour</b> : " + d.LAST_MAJ + "</p>" +
                      "<p><img src= 'css/img/link.svg' id ='pictoDescr'</img>" +
                      "<a href='"+ d.RESSOURCES +
                      "' target='_blank'>En savoir plus</a></p>"
    })
  });
};

/******************************************************************************/
/****************************** FICHE TERRITOIRE ******************************/
/******************************************************************************/

let featureInfo = document.getElementById("ficheTerritoire");

function showFiche() {
  // featureInfo.style.left = "25px";
  featureInfo.style.display = "block";
  var x = setInterval(function () {
    clearInterval(x)
  }, 250);
  // listeZonages.style.left = "-2000px";
  listeZonages.style.display = "none";
};

function hideFiche() {
  // featureInfo.style.left = "2000px";
  // listeZonages.style.left = "0px";
  featureInfo.style.display = "none";
  listeZonages.style.display = "block";
};


/******************************************************************************/
/************************** FENETRE A PROPOS **********************************/
/******************************************************************************/

var aProposBtn = document.getElementById('aPropos-btn');
var aPropos = document.getElementById('aPropos')
var closePopup = document.getElementById('closePopup');

// ouvre la popup
aProposBtn.onclick = function() {
  aPropos.style.display = 'block';
}

// ferme la Popup
closePopup.onclick = function() {
  aPropos.style.display = 'none';
}

// au click n'importe où dans le navigateur
window.onclick = function(event) {
  if (event.target == aPropos) {
    aPropos.style.display = "none";
  }
}
