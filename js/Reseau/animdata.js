// Rendre les noeuds cliquables
// Afficher le nom

var moncanvas = document.querySelector(".visible");

function animSec1(){

	moncanvas.addEventListener("mousemove", function (e){

		// On repère les coordonnées du clic
		var mouseX = e.layerX;
		var mouseY = e.layerY;

		// On obtient la couleur du pixel puis le noeud
		// Click sur le canvas visible
		// Couleur dans le canvas caché
		var col = ctxhid.getImageData(mouseX, mouseY, 1, 1).data;
		var colString = "rgb(" + col[0] + "," + col[1] + ","+ col[2] + ")";
		console.log(colString)
		var node = colToNode[colString];
	
		// Si on est sur un noeud, afficher son nom
		// Sinon, redissiner pour effacer les autres noms
		if (node){
			var data = node["_groups"][0][0]["__data__"];
			console.log(data)
			drawCanvasSec1();
			ctx.save()
			ctx.font = "bold 7pt Arial,sans-serif"
			ctx.fillStyle = "white"
			ctx.fillText(data.key, data.x-14, data.y-8)
			ctx.restore()
		} else {
			drawCanvasSec1();
		}

	})

}

// Ce code permet de faire du drag&slide sur les nodes
canvas
      .call(d3.drag()
          .subject(dragsubject)
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

hidden
      .call(d3.drag()
          .subject(dragsubject)
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

function dragsubject() {
    return simulation.find(d3.event.x, d3.event.y);
}

function dragstarted() {
	console.log("start")
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d3.event.subject.fx = d3.event.subject.x;
  d3.event.subject.fy = d3.event.subject.y;
}

function dragged() {
	console.log("move")
  d3.event.subject.fx = d3.event.x;
  d3.event.subject.fy = d3.event.y;
}

function dragended() {
	console.log("end")
  if (!d3.event.active) simulation.alphaTarget(0);
  d3.event.subject.fx = null;
  d3.event.subject.fy = null;
}