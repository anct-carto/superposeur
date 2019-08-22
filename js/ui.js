/******************************************************************************/
/************************ INTERACTION PANNEAU LATERAL *************************/
/******************************************************************************/
// sidebar buttons
var homeBtn = document.getElementById('homeBtn');
var closeBtn = document.getElementById('closeContent');
var donwload = document.getElementById('download');
// windows to toggle
var content =  document.getElementById('content');
var intro = document.getElementById("intro");
var zonageLayers = document.getElementById('cat-zonages');

// ouvrir la fenetre latérale au chargement
var interval = setInterval(function() {
    if(document.readyState === 'complete') {
        contentDisplay();
        clearInterval(interval);
      }
    }, 500);

// sur chaque bouton, appliquer la fonction pour fermer le panneau latéral
[homeBtn,closeBtn].forEach(function (btn) {
  btn.addEventListener('click', function() {
    showContent();
    hideFeatureInfo();
  });
})


function showContent() {
  if (content.style.width === '0%') {
    contentDisplay();
  } else {
    content.style.width = '0%';
    content.style.paddingLeft = '0px';
    content.style.paddingRight = '0px';
    zonageLayers.style.display = 'none';
    document.getElementById('legend').style.marginLeft = '70px'
    intro.style.display = 'none';
    let t = setInterval(function() {
      mymap.setView([46.5, 3])
      clearInterval(t)
    },0);
  }
};

function contentDisplay() {
  content.style.width = '30%';
  content.style.marginLeft = '55px';
  content.style.paddingLeft = '25px';
  content.style.paddingRight = '20px';
  document.getElementById('legend').style.marginLeft = '620px'
  // déplacement du centre de la carte
  let t = setInterval(function() {
    mymap.setView([46.5, -2])
    clearInterval(t)
  },0);
  if (content.style.width === '30%') {
    var x = setInterval(function () {
      intro.style.display = 'block';
      zonageLayers.style.display = 'block';
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
                      "<a href='" + d.TELECHARGER +"' target='_blank'>"+
                      "Télécharger la carte</a></p>"+
                      "<p><b>Niveau(x) géographique(s) : </b>" + d.ECHELON + "</p>" +
                      "<p><b>À propos : </b>"+
                      ""+ d.DESCRIPTION_COURTE + "</p>" +
                      "<p>"+ d.DESCRIPTION_LONGUE + "</p>" +
                      "<p><b>Dernière mise à jour</b> : " + d.LAST_MAJ + "</p>" +
                      "<p><img src= 'css/img/link.svg' id ='pictoDescr'</img>" +
                      "<a href='"+ d.RESSOURCES +
                      "' target='_blank'>Cliquez ici pour en savoir plus</a></p>"
    })
  });
};

/******************************************************************************/
/****************************** FICHE TERRITOIRE ******************************/
/******************************************************************************/

let featureInfo = document.getElementById("ficheTerritoire");

function showFeatureInfo() {
  featureInfo.style.left = "25px";
  var x = setInterval(function () {
    clearInterval(x)
  }, 250);
  zonageLayers.style.left = "-2000px";
};

function hideFeatureInfo() {
  featureInfo.style.left = "2000px";
  zonageLayers.style.left = "0px";
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
