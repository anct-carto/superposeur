// !!!!!!!!!!!!!!!!!!!!!!!!!!! ce script est expérimental et ne doit pas être utilisé !!!!!!!!!!!!

// let csv = [
//   {id:"acv",nom:"Action coeur"},
//   {id:"ber",nom:"Bassin n'yemmak"},
// ];

let tableau = [];
let csv = d3.csv("data/descriptions.csv")
              .then(res => {
                res.forEach(el => {
                  tableau.push(el);
                })
              }
            );

tableau.forEach(el => {
  console.log(el);
});

let ul = document.createElement("ul");
listeZonages.appendChild(ul);
tableau.forEach(id => {
  console.log(id);
  let liZonage = document.createElement("li");
  liZonage.className = "zonage";

  let input = document.createElement("input");
  input.type = "checkbox";
  input.id = id.ACRONYME.toLowerCase();

  let label = document.createElement("label");
  label.htmlFor = id.ACRONYME.toLowerCase();
  label.className = "libZonage";
  label.innerHTML = id.NOM;

  let plusBtn = document.createElement("button");
  plusBtn.type = "button";
  plusBtn.className = "expandBtn";
  plusBtn.title = "Cliquez pour dérouler";

  let divDescription = document.createElement("div");
  divDescription.className = "description";
  divDescription.id = id.ACRONYME.toLowerCase()+"-desc";

  // appendChild
  [input,label,plusBtn,divDescription].forEach(el => {
    liZonage.appendChild(el)
  });

  ul.appendChild(liZonage);
});
