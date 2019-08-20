///////////////// sidebar interaction //////////////////////////
// sidebar buttons
var homeBtn = document.getElementById('homeBtn');
var closeBtn = document.getElementById('closeContent')
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
    showContent(content);
    hideFeatureInfo();
  });
})

function showContent() {
  if (content.style.width === '0px') {
    contentDisplay()
  } else {
    content.style.width = '0px';
    content.style.paddingLeft = '0px';
    content.style.paddingRight = '0px';
    zonageLayers.style.display = 'none';
    intro.style.display = 'none'
  }
};

function contentDisplay() {
  content.style.width = '450px';
  content.style.marginLeft = '50px';
  content.style.paddingLeft = '40px';
  content.style.paddingRight = '20px';
  if (content.style.width === '450px') {
    var x = setInterval(function () {
      intro.style.display = 'block';
      zonageLayers.style.display = 'block';
      clearInterval(x)
    }, 175);
  }
};


/////////////////// menu déroulant checkbox ////////////////////
var expandBtn = document.querySelectorAll('.expandBtn');
var showDes = 1;

expandBtn.forEach(btn => {
  btn.addEventListener('click', function() {
    showDes++;
    this.classList.toggle('collapsed'); //
    var description = this.nextElementSibling; // récupère l'élément situé après le bouton dans le html
    if (showDes % 2 == 0) {
      description.style.maxHeight = '200px';
    } else {
      description.style.maxHeight = '0px'
    }
  })
})

var lb = document.querySelectorAll('.libZonage');
var labels = document.querySelectorAll('tr');
let count = 1;
console.log(labels);
labels.forEach(label => {
  label.addEventListener('click', function() {
    count++;
    console.log(count % 2);
    // if (count % 2 == 1) {
    //   label.style.background = "rgba(0,0,0,0.5)";
    //   label.style.padding = "10px";
    //   label.style.borderRadius = "5px";
    // } else if (count % 2 == 0) {
    //   label.style.background = "";
    //   label.style.padding = "";
    //   label.style.borderRadius = "";
    // }
  })
})

//////////////////// fenetre à propos //////////////////////
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

// fiche territoire
let featureInfo = document.getElementById("layerInfo");

function showFeatureInfo() {
  var x = setInterval(function () {
    featureInfo.style.display = "block";
    clearInterval(x)
  }, 250);
    zonageLayers.style.left = "-500px";
}

function hideFeatureInfo() {
  featureInfo.style.display = "none";
  zonageLayers.style.left = "0px";
}
