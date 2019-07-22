///////////////// sidebar interaction //////////////////////////
// sidebar buttons
var searchBtn = document.getElementById('search');
var couches = document.getElementById('layer');
var donwload = document.getElementById('download');
var zonageLayers = document.getElementById('cat-zonages');
// windows to toggle
var content =  document.getElementById('content');
var contenu = document.getElementById('contenu');

// ouvrir la fenetre latérale au chargement
var interval = setInterval(function() {
    if(document.readyState === 'complete') {
        clearInterval(interval);
        content.style.left = '50px';
        content.style.width = '450px';
        content.style.paddingLeft = '20px';
        content.style.paddingRight = '20px';
        // libCom est récupéré dans recherche.js
        content.innerHTML = '<h1 style = {padding-left:50px}>'+"Recherchez une commune"+'</h1><br/>'
        zonageLayers.style.display = 'block'
        console.log("ok");
      }
    }, 1000);

// toggle on click
searchBtn.addEventListener('click', function() {
  showContent(searchBtn,content,'Recherchez une commune');
});

function showContent(button,windows,libCom) {
  if (windows.style.width == '0px') {
    windows.style.left = '50px';
    windows.style.width = '450px';
    windows.style.paddingLeft = '20px';
    windows.style.paddingRight = '20px';
   // libCom est récupéré dans recherche.js
   zonageLayers.style.display = 'block'

  } else {
    windows.style.width = '0px';
    windows.style.paddingLeft = '0px';
    windows.style.paddingRight = '0px';
    windows.innerHTML = ''
    zonageLayers.style.display = 'none'
}};

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
