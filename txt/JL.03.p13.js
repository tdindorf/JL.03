var W = 400,
H = 200,
r = 5;
var svg, circles, page;
var datasetZ = [];
var datasetN = [];
var dataset0 = [];

var TWOPI = 2 * Math.PI;
var c = 0.1;
var fps = 60;
var bolAnimate = true;
var bolTraveling;
var omega, k, period, lambda, speed, amplitude;
var resumeTime, timeRate, circles, nodeList;

init();

function init() {
	resumeTime = 0;
	timeRate = 1;
	speed = 0.02;	//in px/ms lambda/period;
	lambda = 4*50;
	
	amplitude = 0.4;
	
	period = lambda/speed;
	
	createSVG('#div01');
	
	calcVars();
	calcZ(0);
	calcN(0);
	calc0();
	
	populateCircles();
	populateNodes();
	
	if (bolAnimate) {
		animate();
		} else {
		draw(0);
	}
	//inform(datasetN);
}

function animate(time) {		// control on/off and pace
	//if (!pause){
	setTimeout(function() {
		dt = Date.now() - resumeTime;
		requestId = window.requestAnimationFrame(animate);
		animTime = time + dt*timeRate;
		draw(animTime);
	}, 1000 / fps);
//}
};

function calcVars() {
	bolAnimate = true;
	k = TWOPI / lambda;
	omega = TWOPI /period; // angular frequency, per ms
}

function draw(t) {
	calcZ(t);
	calcN(t);
	drawCircs();
	drawNodes();
}

function drawCircs() {
	circles.data(datasetZ)
    .attr("cx", function(d, i) {
		return d.x;
	})
    .attr("cy", function(d, i) {
		return d.y;
	})
    .attr("r", r);
}

function drawNodes(){
	nodeList.data(datasetN)
	.attr("x", function(d,i) { return d.x; })
	.attr("y", function(d,i) { return d.y; })
	.text( function (d,i) { return d.t; });
}

function calcZ(t) {
	datasetZ = [];
	for (i = 0; i < W / (2 * r)+10; i++) {
		var x = i * r * 2;
		datasetZ.push({
			x: x,
			y: Math.round(amplitude*(-0.5*H*
			(bolTraveling ? Math.sin(omega * t - k * x) : Math.sin(omega * t) * Math.sin(k * x))
			))
		});
	}
}

function calc0() {
	dataset0 = [];
	for (i = 0; i < W / (2 * r)+10; i++) {
		var x = i * r * 2;
		dataset0.push({
			x: x,
			y: 0
		});
	}
}

function calcN(t) {
	datasetN = [];
	for (i = 0; i <= 4*W / lambda+4; i++) {
		var x = -lambda + i * lambda/4 + bolTraveling * (speed*t)%(lambda);
		datasetN.push({
			x: x,
			y: 5,
			t: i%2 ? 'M':'N'
		});
	}
}

function populateCircles() {
	circles = page.selectAll('.circ')
    .data(datasetZ)
	.enter().append('circle');
	
	paths = page.selectAll('.path')
	.append("path")
	.attr("d", "M0 0 L0 400");
	
	circles0 = page.selectAll('.circ')
    .data(dataset0)
	.enter().append('circle')
	.attr("cx", function(d, i) {
		return d.x;
	})
    .attr("cy", function(d, i) {
		return d.y;
	})
    .attr("r", r)
	.attr('opacity',0.2);
}

function populateNodes(){
	nodeList = page.selectAll('.node')
	.data(datasetN)
	.enter().append('text')
	.attr('id', function(d, i) {return 'node0' + i})
	.attr("font-family", "sans-serif")
	.attr("font-size", "20px")
	.attr("fill", "black")
	.text( function (d,i) { return 'M '; });
}

function createSVG(locationID) {
	svg = d3.select(locationID)
	.append("svg")
	.attr("width", W)
	.attr("height", H)
	.attr('viewBox','0 0 ' + W + ' ' +H)
	
	page = d3.select("svg")		// container for all elements; shifted for y=0 in middle
	.append("g")
	.attr("id", 'page')
	.attr("transform", 'translate(' + 0 + ' ' + H/2 + ')')
	}
	
	function inform(arr) {
	var par = d3.select('#info');
	par.text('fog');
	var myStr = '';
	for (i = 0; i < arr.length; i++) {
	myStr = myStr + '/' + arr[i].x + ' - ' + arr[i].y + '/' ;
	}
	par.text(myStr);
	}														