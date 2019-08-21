/****************************************************************************************************************/
/******************************************* SYMBOLOGIE DES FICHIERS ********************************************/
/****************************************************************************************************************/

let acvTexture = textures.lines()
                  .orientation("vertical")
                  .stroke("rgb(255, 80, 0)")
                  .size(10)
                  .strokeWidth(10);

let afrTexture = textures.circles()
                  .lighter()
                  .size(3)
                  .fill("black")
                  .background("pink");

let amicbTexture = textures.circles()
                  .lighter()
                  .fill("white")
                  .background("darkred");

let berTexture = textures.circles()
                  .size(7.5)
                  .radius(2)
                  .fill("white")
                  .background("darkblue");

let budTexture = textures.circles()
                  .lighter()
                  .size(3)
                  .fill("grey")
                  .background("purple");

let cdtTexture = textures.lines()
                  .shapeRendering("crispEdges")
                  .stroke("rgb(3, 173, 252)")
                  .size(5)
                  .strokeWidth(2.5)

let cpierTexture = textures.circles()
                  .thicker()
                  .size(4.5)
                  .fill("yellow");

let crTexture = textures.paths()
                  .d("woven")
                  .lighter()
                  .stroke("rgb(99, 121, 57)")
                  .background("rgb(188, 189, 34)")
                  .thicker();

let cteTexture = textures.lines()
                  .shapeRendering("crispEdges")
                  .stroke("rgb(3, 252, 152)")
                  .size(5)
                  .strokeWidth(2.5);

let cvTexture = textures.circles()
                  .lighter()
                  .fill("white")
                  .background("rgb(153, 0, 153)");

let zfuTexture = textures.lines()
                  .orientation("vertical")
                  .stroke("yellow")
                  .size(10)
                  .strokeWidth(10);

let zrdTexture = textures.lines()
                  .size(8)
                  .strokeWidth(10)
                  .stroke('rgb(140, 86, 75)');

let zrrTexture = textures.lines()
                  .size(8)
                  .strokeWidth(2)
                  .stroke('green');

/****************************************************************************************************************/
/****************************************** TABLEAU .json DES STYLES ********************************************/
/****************************************************************************************************************/

let textureArray = [
                    {
                      layer:'afr',
                      lib:"Zone d'Aide à Finalité Régionale",
                      style:afrTexture,
                    },
                    {
                      layer:'acv',
                      lib:"Action Coeur de ville",
                      style:acvTexture
                    },
                    {
                      layer:'amicb',
                      lib:"Appel à Manifestation d'Intérêt Centre-bourg",
                      style:amicbTexture,
                    },
                    {
                      layer:'ber',
                      lib:"Bassin d'Emploi à Redynamiser",
                      style:berTexture,
                    },
                    {
                      layer:'bud',
                      lib:"Bassin Urbain à Dynamiser",
                      style:budTexture,
                    },
                    {
                      layer:'cdt',
                      lib:"Contrat de Développement Territorial",
                      style:cdtTexture,
                    },
                    {
                      layer:'cpier',
                      lib:"Contrat de Plan Interrégional État-Région",
                      style:cpierTexture,
                    },
                    {
                      layer:'cr',
                      lib:"Contrat de ruralité",
                      style:crTexture,
                    },
                    {
                      layer:'cte',
                      lib:"Contrat de Transition Écologique",
                      style:cteTexture,
                    },
                    {
                      layer:'cv',
                      lib:"Contrat de ville",
                      style:cvTexture,
                    },
                    {
                      layer:'zfu',
                      lib:"Zone Franche urbaine",
                      style:zfuTexture
                    },
                    {
                      layer:'zrd',
                      lib:"Zone de Restructuration de la Défense",
                      style:zrdTexture
                    },
                    {
                      layer:'zrr',
                      lib:"Zone de Revitalisation Rurale",
                      style:zrrTexture
                    }
                  ];
