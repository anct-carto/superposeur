///////////////// sidebar interaction //////////////////////////
// sidebar buttons
var searchBtn = document.getElementById('search');
var couches = document.getElementById('layer');
var donwload = document.getElementById('download');
var zonageLayers = document.getElementById('cat-zonages');
// windows to toggle
var content =  document.getElementById('content');
var contenu = document.getElementById('contenu');

function showContent(button,windows,libCom) {
  if (windows.style.width == '0px') {
    windows.style.left = '50px';
    windows.style.width = '450px';
    windows.style.paddingLeft = '20px';
    windows.style.paddingRight = '20px';
   // libCom est récupéré dans recherce.js
    windows.innerHTML = '<h1 style = {padding-left:50px}>'+libCom+'</h1><br/>' +
                        'Votre commune est sous le régime de '+'undefined'+ 'zonages et contrats de politique publique.'
                        // +"<div id=cat'-zonages'><label for=''>Zonages</label><br><input type='checkbox' id = 'zrr' > ZRR<br><input type='checkbox' id = 'zru' > ZRU<br><input type='checkbox' id = 'qpv'> QPV<br></div>"
    zonageLayers.style.display = 'block'
    // zonageLayers.style.display = 'block'
  } else {
    windows.style.width = '0px';
    windows.style.paddingLeft = '0px';
    windows.style.paddingRight = '0px';
    windows.innerHTML = ''
    zonageLayers.style.display = 'none'
}};

function showLayers() {
  // do something
}

// toggle on click
searchBtn.addEventListener('click', function() {
  showContent(searchBtn,content,'Recherchez une commune');
});
couches.addEventListener('click', function() {
  showLayers();
});

/////////// fenetre à propos //////////////////////
var aPropos = document.getElementById('apropos');
aPropos.onclick = function() {
  // do something
}
