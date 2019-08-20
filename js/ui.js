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
        clearInterval(interval);
        contentDisplay();
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
  if (content.style.width === '0px') {
    contentDisplay();
  } else {
    content.style.width = '0px';
    content.style.paddingLeft = '0px';
    content.style.paddingRight = '0px';
    zonageLayers.style.display = 'none';
    intro.style.display = 'none';
    let t = setInterval(function() {
      mymap.setView([46.5, 3])
      clearInterval(t)
    },300);
  }
};

function contentDisplay() {
  content.style.width = '500px';
  content.style.marginLeft = '50px';
  content.style.paddingLeft = '40px';
  content.style.paddingRight = '20px';
  // déplacement du centre de la carte
  let t = setInterval(function() {
    mymap.setView([46.5, 6.8])
    clearInterval(t)
  },300);
  if (content.style.width === '500px') {
    var x = setInterval(function () {
      intro.style.display = 'block';
      zonageLayers.style.display = 'block';
      clearInterval(x)
    }, 175);
  }
};



/******************************************************************************/
/************************** MENUS CONTRATS/ZONAGES ****************************/
/******************************************************************************/

var expandBtn = document.querySelectorAll('.expandBtn');
var showDes = 1;

expandBtn.forEach(btn => {
  btn.addEventListener('click', function() {
    showDes++;
    this.classList.toggle('collapsed');
    // récupère l'élément situé après le bouton dans le html
    var description = this.nextElementSibling;
    if (showDes % 2 == 0) {
      description.style.maxHeight = '200px';
    } else {
      description.style.maxHeight = '0px'
    }
  })
});

// rendu des balises <li> cliquables
let lb = document.querySelectorAll('.zonage');
let count = 1;
lb.forEach(label => {
  label.addEventListener('click', function() {
    count++;
    console.log(count);
    console.log(count % 2);
    if (count % 2 == 0) {
      label.style.background = "rgba(0,0,0,0.5)";
      label.style.borderRadius = "5px";
    } else {
      label.style.background = "";
      label.style.padding = "";
      label.style.borderRadius = "";
    }
  })
});

// Ajout des informations au menu déroulant depuis le fichier data/descriptions.csv
getCheckBoxInfo();

function getCheckBoxInfo() {
  d3.csv("data/descriptions.csv")
  .then(data => {
    data.forEach(d => {
      div = document.getElementById(d.ACRONYME.toLowerCase().concat("-desc"))
      div.innerHTML = "<p><b><a href='" + d.TELECHARGER +
                      "' target='_blank'>Télécharger la carte  </b>" +
                      "<img src= 'css/img/download.svg' id ='downloadImg'</img></a></p>"+
                      "<p><b>Niveau(x) géographique(s) : </b>" + d.ECHELON + "</p>" +
                      "<p><b>A propos</b></p>"+
                      "<p>"+ d.DESCRIPTION_COURTE + "</p>" +
                      "<p><a href='"+ d.RESSOURCES +
                      "' target='_blank'>Cliquez ici pour en savoir plus</a></p>"
    })
  });
};

/******************************************************************************/
/****************************** FICHE TERRITOIRE ******************************/
/******************************************************************************/

let featureInfo = document.getElementById("layerInfo");

function showFeatureInfo() {
  var x = setInterval(function () {
    featureInfo.style.display = "block";
    clearInterval(x)
  }, 250);
    zonageLayers.style.left = "-550px";
};

function hideFeatureInfo() {
  featureInfo.style.display = "none";
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
