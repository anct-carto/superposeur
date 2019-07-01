///////////////// sidebar interaction //////////////////////////
// sidebar buttons
var search = document.getElementById('search');
var couches = document.getElementById('layer');
var donwload = document.getElementById('download');

// windows to toggle
var content =  document.getElementById('content');

function showContent(button,windows,libCom) {
  if (windows.style.width == '0px') {
    windows.style.width = '450px';
    windows.style.left = '50px';
    windows.style.transition = "0.2s";
    windows.style.opacity = '0.95'
    windows.innerHTML = '<h1>'+libCom+'</h1>'
  } else {
    windows.style.width = '0px';
    windows.innerHTML = ''
}};

function showLayers() {
  // do something
}

// toggle on click
search.addEventListener('click', function() {
  showContent(search,content,'Recherchez une commune');
});
couches.addEventListener('click', function() {
  showLayers();
});
