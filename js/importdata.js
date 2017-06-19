var dataset;
var nbloby;
var affiliations;


var nodes;
var circles;
var simulation;
var firstick = 1;
var NameToIndex;

// Création du faux DOM
// Il reçoit les éléments grphiques avec 
// en attribut ce qu'il faut pour les afficher
detachedContainer = document.createElement("custom")
var CustomDOM = d3.select(detachedContainer);

d3.csv("data/Noeuds-positions.csv", function (data){
	dataset=data;
	nbloby=dataset.length;
});

d3.csv("data/Affiliation.csv", function (data){
	affiliations = data;

	// Réduction des données à un thème
	var theme = "Exploitation of indigenous fossil energy";
	for (var i=0; i<nbloby; i++){
		if (dataset[i][theme]){} else {
			dataset[i]=0;
		}
	}
	while (dataset.indexOf(0)!==-1){
		dataset.splice(dataset.indexOf(0),1);
	}
	nbloby=dataset.length;
	var namelist=[];
	for (var i=0; i<nbloby; i++){
		namelist.push(dataset[i].Name)
	}
	for (var i=0; i<affiliations.length; i++){
		if ((namelist.indexOf(affiliations[i].source)===-1) 
			|| (namelist.indexOf(affiliations[i].target)===-1))
			{
				affiliations[i]=0;
			}
	}
	while (affiliations.indexOf(0)!==-1){
		affiliations.splice(affiliations.indexOf(0),1);
	}

	console.log(affiliations);
	console.log(dataset);

	// On renseigne les forces
	simulation = d3.forceSimulation().nodes(dataset)
					.force("center", d3.forceCenter(width/2,height/2))
					.force("charge", d3.forceManyBody().strength(-10))
					.force("link", d3.forceLink(affiliations)
						.id(function (d){
							return d.Name;
						})
						.strength(function (d){
							return 0.05;
						})
					);		

	simulation.on("tick", ticked);

	// Binding des data avec les noeuds
	circles = CustomDOM.selectAll("custom.circle")
				.data(dataset)
				.enter()
				.append("custom")
				.attr("class", "circle")
				.attr("r", 5)

	function ticked (){

		ctx.clearRect(0,0,width,height);
		// On remplie l'annuaire
		// Dictionnaire inversé pour faciliter les liens
		if (firstick){
			var NestedData = d3.nest()
							.key(function (d){return d.Name})
							.rollup(function (v){return v[0].index})
							.entries(dataset);
			NameToIndex = {};
			console.log(NestedData)
			NestedData.forEach(function (d){
				NameToIndex[d.key] = d.value;
			})
			
			console.log(NameToIndex);
			firstick=0;	
		}

		// Traçage des liens
		ctx.strokeStyle = "red"
		ctx.lineWidth = 1;
		affiliations.forEach(function (d){
			ctx.beginPath()
			var beginindex = NameToIndex[d.source.Name];
			var endindex = NameToIndex[d.target.Name];
			ctx.moveTo(Math.round(dataset[beginindex].x), Math.round(dataset[beginindex].y));
			ctx.lineTo(Math.round(dataset[endindex].x), Math.round(dataset[endindex].y));
			ctx.closePath();
			ctx.stroke();
		});

		// Les cercles
		ctx.beginPath();
		circles.each(function (d){
			ctx.moveTo(d.x, d.y);
			ctx.arc(d.x, d.y, d3.select(this).attr("r"), 0, 2*Math.PI);		
		})
		ctx.fillStyle = "green"
		ctx.fill();

	}

});
