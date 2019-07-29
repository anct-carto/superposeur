///////////////// sidebar interaction //////////////////////////
// sidebar buttons
var searchBtn = document.getElementById('search');
var couches = document.getElementById('layer');
var donwload = document.getElementById('download');
var zonageLayers = document.getElementById('cat-zonages');
// windows to toggle
var content =  document.getElementById('content');
var contenu = document.getElementById('contenu');
var appName = document.getElementById("appName");

// ouvrir la fenetre latérale au chargement
var interval = setInterval(function() {
    if(document.readyState === 'complete') {
        clearInterval(interval);
        content.style.left = '50px';
        content.style.width = '450px';
        content.style.paddingLeft = '20px';
        content.style.paddingRight = '20px';
        // libCom est récupéré dans recherche.js
        zonageLayers.style.display = 'block'
        appName.style.display = 'block'
      }
    }, 1000);

// toggle on click
searchBtn.addEventListener('click', function() {
  showContent(searchBtn,content);
});

function showContent(button,windows) {
  if (windows.style.width === '0px') {
    windows.style.left = '50px';
    windows.style.width = '450px';
    windows.style.paddingLeft = '20px';
    windows.style.paddingRight = '20px';
    appName.style.display = 'block'
    zonageLayers.style.display = 'block';
  } else {
    windows.style.width = '0px';
    windows.style.paddingLeft = '0px';
    windows.style.paddingRight = '0px';
    zonageLayers.style.display = 'none';
    appName.style.display = 'none'
}};

/////////////////// éléments checkbox ////////////////////
var expandBtn = document.getElementsByClassName('expandBtn');
var i;

for (i = 0; i<expandBtn.length; i++) { // pour chaque bouton ...
  expandBtn[i].addEventListener('click', function() {
    this.classList.toggle('collapsed'); //
    var content = this.nextElementSibling;
    content.classList.toggle('collapsed');
    if (content.style.height === '0px') {
        content.style.height= '100px';
        this.style.transform = 'rotate(270deg)' // animation sur le bouton d'expand
      } else {
        content.style.height = '0px'
        this.style.transform = 'rotate(90deg)'
      }
    })
};


/////////// fenetre à propos //////////////////////
var aProposBtn = document.getElementById('aPropos-btn');
var aPropos = document.getElementById('aPropos')
var close = document.getElementsByClassName('close')[0];

// ouvre la popup
aProposBtn.onclick = function() {
  aPropos.style.display = 'block';
}

// ferme la Popup
close.onclick = function() {
  aPropos.style.display = 'none';
}

window.onclick = function(event) {
  if (event.target == aPropos) {
    aPropos.style.display = "none";
  }
}
