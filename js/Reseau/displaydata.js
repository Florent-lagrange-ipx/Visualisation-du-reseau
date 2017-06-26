/*

Ce script reçoit les fonctions qui permettent 
de représenter les données. 

Il s'agit notamment des fonctions 
qui dessinent le Canvas pour chacune des sections

Il y a aussi les fonctions qui gèrent l'échelle. 

Ces fonctions seront appelées dans des appels du type
simulation.on("tick", drawCanvasSec1)

Ces appels précédents seront effectués dans le script
scroller.js 
(appel de setupSecX() dans la fonction majvue
qui marque une séparation entre 2 sections)

*/

// Permet de lancer une portion de code uniquement
// au tick n°1
var firstick = 1;

var w=Math.round(width/6);
var h=Math.round(height/4)
var centers = [
[w,h],   [2*w,h],   [3*w,h],   [4*w,h],   [5*w,h], 
[w,2*h], [2*w,2*h], [3*w,2*h], [4*w,2*h], [5*w,2*h], 
[w,3*h], [2*w,3*h], [3*w,3*h], [4*w,3*h], [5*w,3*h], 
];


// Cette fonction permet d'ajuster le diamètre
// des noeuds aux dépenses du lobyist
function scalablesizes (x){
	var coef = 1
	if (Number(x)){
		coef = 1 + 7*Math.pow(x/depmax,1/3);
	}
	return coef * radius;
}

function defIDToIndex(){
	// On remplit l'annuaire
		// Dictionnaire inversé pour faciliter les liens
		// Il faut placer ce code ici à cause des appels asynchrones. 
		if (firstick){
			var NestedData = d3.nest()
							.key(function (d){return d.ID})
							.rollup(function (v){return v[0].index})
							.entries(dataset);
			IDToIndex = {};
			console.log(NestedData)
			NestedData.forEach(function (d){
				console.log(d)
				console.log([d.key, d.value])
				IDToIndex[d.key] = d.value;
			})
			firstick=0;	
		}
}

function tickedSec1 (){

		// Esapcement ! Recentrage !
		circlePos.each(function (d){
			if (d.key === "SUPPORT"){
				d.x += (width/3 - d.x)*simulation.alpha();
			} else {
				d.x += (2*width/3 - d.x)*simulation.alpha();
			}
			d.y += (height/2 - d.y)*simulation.alpha();
		}) 


		drawCanvasSec1();

}

function drawCanvasSec1 (){

		clearCanvas();
		// Traçage des halos
		// Le halo proportionnel aux dépenses
		circlePos.each(function (d){
			// Affichage du halo
			ctx.beginPath();
			ctx.moveTo(d.x, d.y);
			ctx.arc(d.x, d.y, d3.select(this).attr("r"), 0, 2*Math.PI);
			ctx.fillStyle = d3.select(this).attr("fillHalo");
			ctx.fill();
		})

		// Traçage des cercles
		circlePos.each(function (d){
			var node = d3.select(this);
			// Affichage du cercle
			ctx.beginPath();
			ctx.moveTo(d.x, d.y);
			ctx.arc(d.x, d.y, radius, 0, 2*Math.PI);
			ctx.fillStyle = node.attr("fillStyle");
			ctx.fill();

			// Dessin dans le canvas caché
			var newcol = genHiddenColor();
			ctxhid.fillStyle = newcol;
			ctxhid.beginPath();
			ctxhid.moveTo(d.x, d.y);
			ctxhid.arc(d.x, d.y, d3.select(this).attr("r"), 0, 2*Math.PI);
			ctxhid.fill();

			// Ajout de la couleur au répertoire
			colToNode[newcol] = node;

		})	
}

function setupSec1 (){

	// Renseigner ici les paramètres de la simulation
	// forces, faux liens s'il en faut pour manipuler le graphe
	simulation = d3.forceSimulation().nodes(dataByPos)
					.force("center", d3.forceCenter(width/2,height/2))
					.force("charge", d3.forceManyBody().strength(-1))
					.force("collide", d3.forceCollide().radius(function (d){
						return 2*radius + scalablesizes(d.value["Dépenses Lobby (€)"]);
					}))
					// Permettent d'éviter le hors champ lors du drag
					.force("x", d3.forceX(width/2).strength(0.4))
					.force("y", d3.forceY(height/2).strength(0.4));

	simulation.alphaMin(0.02);
	// Appel de la simulation
	simulation.on("tick", tickedSec1);

}

function tickedSec2 (){

		// Esapcement ! Recentrage !
		circlePosType.each(function (d){
			if (d.key.split(",")[0] === "SUPPORT"){
				d.x += (width/3 - d.x)*simulation.alpha();
			} else {
				d.x += (2*width/3 - d.x)*simulation.alpha();
			}
			d.y += (height/2 - d.y)*simulation.alpha();
		}) 

		drawCanvasSec2();

}

function drawCanvasSec2 (){

		clearCanvas();
		// Traçage des halos
		// Le halo proportionnel aux dépenses
		circlePosType.each(function (d){
			// Affichage du halo
			ctx.beginPath();
			ctx.moveTo(d.x, d.y);
			ctx.arc(d.x, d.y, d3.select(this).attr("r"), 0, 2*Math.PI);
			ctx.fillStyle = d3.select(this).attr("fillHalo");
			ctx.fill();
		})

		// Traçage des cercles
		circlePosType.each(function (d){
			var node = d3.select(this);
			// Affichage du cercle
			ctx.beginPath();
			ctx.moveTo(d.x, d.y);
			ctx.arc(d.x, d.y, radius, 0, 2*Math.PI);
			ctx.fillStyle = node.attr("fillStyle");
			ctx.fill();

			// Dessin dans le canvas caché
			var newcol = genHiddenColor();
			ctxhid.fillStyle = newcol;
			ctxhid.beginPath();
			ctxhid.moveTo(d.x, d.y);
			ctxhid.arc(d.x, d.y, d3.select(this).attr("r"), 0, 2*Math.PI);
			ctxhid.fill();

			// Ajout de la couleur au répertoire
			colToNode[newcol] = node;

		})	
}

function setupSec2 (){

	// Renseigner ici les paramètres de la simulation
	// forces, faux liens s'il en faut pour manipuler le graphe
	simulation = d3.forceSimulation().nodes(dataByPosType)
					.force("center", d3.forceCenter(width/2,height/2))
					.force("charge", d3.forceManyBody().strength(-1))
					.force("collide", d3.forceCollide().radius(function (d){
						return 2*radius + scalablesizes(d.value["Dépenses Lobby (€)"]);
					}))
					// Permettent d'éviter le hors champ lors du drag
					.force("x", d3.forceX(width/2).strength(0.4))
					.force("y", d3.forceY(height/2).strength(0.4));

	simulation.alphaMin(0.02);
	// Appel de la simulation
	simulation.on("tick", tickedSec2);

}

function tickedSec3 (){

		// Esapcement ! Recentrage !
		circlePosSecteur.each(function (d){
			if (d.key.split(",")[0] === "SUPPORT"){
				d.x += (width/3 - d.x)*simulation.alpha();
			} else {
				d.x += (2*width/3 - d.x)*simulation.alpha();
			}
			d.y += (height/2 - d.y)*simulation.alpha();
		})

		drawCanvasSec3();

}

function drawCanvasSec3 (){

		clearCanvas();
		// Traçage des halos
		// Le halo proportionnel aux dépenses
		circlePosSecteur.each(function (d){
			// Affichage du halo
			ctx.beginPath();
			ctx.moveTo(d.x, d.y);
			ctx.arc(d.x, d.y, d3.select(this).attr("r"), 0, 2*Math.PI);
			ctx.fillStyle = d3.select(this).attr("fillHalo");
			ctx.fill();
		})

		// Traçage des cercles
		circlePosSecteur.each(function (d){
			var node = d3.select(this);
			// Affichage du cercle
			ctx.beginPath();
			ctx.moveTo(d.x, d.y);
			ctx.arc(d.x, d.y, radius, 0, 2*Math.PI);
			ctx.fillStyle = node.attr("fillStyle");
			ctx.fill();

			// Dessin dans le canvas caché
			var newcol = genHiddenColor();
			ctxhid.fillStyle = newcol;
			ctxhid.beginPath();
			ctxhid.moveTo(d.x, d.y);
			ctxhid.arc(d.x, d.y, d3.select(this).attr("r"), 0, 2*Math.PI);
			ctxhid.fill();

			// Ajout de la couleur au répertoire
			colToNode[newcol] = node;

		})	
}

function setupSec3 (){

	// Renseigner ici les paramètres de la simulation
	// forces, faux liens s'il en faut pour manipuler le graphe
	simulation = d3.forceSimulation().nodes(dataByPosSecteur)
					.force("center", d3.forceCenter(width/2,height/2))
					.force("charge", d3.forceManyBody().strength(-1))
					.force("collide", d3.forceCollide().radius(function (d){
						return 2*radius + scalablesizes(d.value["Dépenses Lobby (€)"]);
					}))
					// Permettent d'éviter le hors champ lors du drag
					.force("x", d3.forceX(width/2).strength(0.4))
					.force("y", d3.forceY(height/2).strength(0.4));

	simulation.alphaMin(0.02);
	// Appel de la simulation
	simulation.on("tick", tickedSec3);

}

function tickedSec4 (){

		// Esapcement ! Recentrage !
		circlePosSecteur.each(function (d){
			// L'indice du secteur dans la liste des secteurs
			// Cet indice permet de lepositionner sur centers[indice]
			var virgule = d.key.indexOf(",");
			var indice = secteurslist.indexOf(d.key.slice(virgule+1));
			d.x += ((centers[indice][0]-d.x) * simulation.alpha())
			d.y += ((centers[indice][1]-d.y) * simulation.alpha())
		})

		drawCanvasSec4();

}

function drawCanvasSec4 (){

		clearCanvas();
		// Traçage des halos
		// Le halo proportionnel aux dépenses
		circlePosSecteur.each(function (d){
			// Affichage du halo
			ctx.beginPath();
			ctx.moveTo(d.x, d.y);
			ctx.arc(d.x, d.y, d3.select(this).attr("r"), 0, 2*Math.PI);
			ctx.fillStyle = d3.select(this).attr("fillHalo");
			ctx.fill();
		})

		// Traçage des cercles
		circlePosSecteur.each(function (d){
			var node = d3.select(this);
			// Affichage du cercle
			ctx.beginPath();
			ctx.moveTo(d.x, d.y);
			ctx.arc(d.x, d.y, radius, 0, 2*Math.PI);
			ctx.fillStyle = node.attr("fillStyle");
			ctx.fill();

			// Dessin dans le canvas caché
			var newcol = genHiddenColor();
			ctxhid.fillStyle = newcol;
			ctxhid.beginPath();
			ctxhid.moveTo(d.x, d.y);
			ctxhid.arc(d.x, d.y, d3.select(this).attr("r"), 0, 2*Math.PI);
			ctxhid.fill();

			// Ajout de la couleur au répertoire
			colToNode[newcol] = node;

		})	
}

function setupSec4 (){

	// Renseigner ici les paramètres de la simulation
	// forces, faux liens s'il en faut pour manipuler le graphe
	simulation = d3.forceSimulation().nodes(dataByPosSecteur)
					.force("center", d3.forceCenter(width/2,height/2))
					.force("charge", d3.forceManyBody().strength(-1))
					.force("collide", d3.forceCollide().radius(function (d){
						return 2*radius + scalablesizes(d.value["Dépenses Lobby (€)"]);
					}))
					// Permettent d'éviter le hors champ lors du drag
					.force("x", d3.forceX(width/2).strength(0.4))
					.force("y", d3.forceY(height/2).strength(0.4));

	simulation.alphaMin(0.02);
	// Appel de la simulation
	simulation.on("tick", tickedSec4);

}

function tickedSec5 (){

		// Esapcement ! Recentrage !
		circleSecteurPos.each(function (d){
			// L'indice du secteur dans la liste des secteurs
			// Cet indice permet de lepositionner sur centers[indice]
			var indice = secteurslist.indexOf(d.key);
			d.x += ((centers[indice][0]-d.x) * simulation.alpha())
			d.y += ((centers[indice][1]-d.y) * simulation.alpha())
		})

		drawCanvasSec5();

}

function drawCanvasSec5 (){

		clearCanvas();
		// Traçage des halos
		// Le halo proportionnel aux dépenses
		circleSecteurPos.each(function (d){
			// Affichage du halo
			ctx.beginPath();
			ctx.moveTo(d.x, d.y);
			ctx.arc(d.x, d.y, d3.select(this).attr("r"), 0, 2*Math.PI);
			ctx.fillStyle = d3.select(this).attr("fillHalo");
			ctx.fill();
		})

		// Traçage des cercles
		circleSecteurPos.each(function (d){
			var node = d3.select(this);
			// Affichage du cercle
			ctx.beginPath();
			ctx.moveTo(d.x, d.y);
			ctx.arc(d.x, d.y, radius, 0, 2*Math.PI);
			ctx.fillStyle = node.attr("fillStyle");
			ctx.fill();

			// Dessin dans le canvas caché
			var newcol = genHiddenColor();
			ctxhid.fillStyle = newcol;
			ctxhid.beginPath();
			ctxhid.moveTo(d.x, d.y);
			ctxhid.arc(d.x, d.y, d3.select(this).attr("r"), 0, 2*Math.PI);
			ctxhid.fill();

			// Ajout de la couleur au répertoire
			colToNode[newcol] = node;

		})	
}

function setupSec5 (){

	// Renseigner ici les paramètres de la simulation
	// forces, faux liens s'il en faut pour manipuler le graphe
	simulation = d3.forceSimulation().nodes(dataBySecteurPos)
					.force("center", d3.forceCenter(width/2,height/2))
					.force("charge", d3.forceManyBody().strength(-1))
					.force("collide", d3.forceCollide().radius(function (d){
						return 2*radius + scalablesizes(d.value["Dépenses Lobby (€)"]);
					}))
					// Permettent d'éviter le hors champ lors du drag
					.force("x", d3.forceX(width/2).strength(0.4))
					.force("y", d3.forceY(height/2).strength(0.4));

	simulation.alphaMin(0.02);
	// Appel de la simulation
	simulation.on("tick", tickedSec5);

}