
//window.onload(){
//CanvasText = new CanvasText;

/*Can = document.getElementById("canvas");
	Con = Canvas.getContext('2d');
	
	CanvasText.config({
	canvas: Can, 
	context: Con,
	fontFamily: "Verdana",
	fontSize: "14px",
	fontWeight: "normal",
	fontColor: "#000",
	lineHeight: "22"
});*/
//}


window.requestAnimFrame = (function(callback) {		// establish optimal frame rate
	return window.requestAnimationFrame || 
	window.webkitRequestAnimationFrame || 
	window.mozRequestAnimationFrame || 
	window.oRequestAnimationFrame || 
	window.msRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / fps);
	};
})();

var fps=30;
var startTime = (new Date()).getTime();			// animation parameters
var amplitude = 150;
var period = 2000;					// period in ms

var element = document.getElementById("canvas1");	// reference canvas
var c = element.getContext("2d");

var width = element.width;				//canvas dimensions
var height = element.height;

var imageData = c.createImageData(width, height);	// array of pixel data
var pos = 0;					// index position into imagedata array

var lambda = 20	;				// wavelength in px
var number = 3	;				// source separation in wavelengths
var twoPI = 2*Math.PI;
var textYshift = 6
//var phase = 0
//var t1

//lambda = prompt("Wavelength (in pixels): ", lambda);	// inputs
//number = prompt("Source separation (in wavelengths): ", number );

lambda = lambda * 1				// 'prompt' returns string; convert it to number
separation = lambda * number			// source separation in px

k = Math.PI*2/lambda				// k = wave number

yS1 = (height-separation)/2; // position of S1		// source positions
xS1 = width / 2;

yS2 = (height+separation)/2; // position of S2
xS2 = width / 2;

/**						// optional delay to start of animation
	setTimeout(function() {
	startTime = (new Date()).getTime();
	animate();
	}, 500);				// delay in ms
**/

//animate()						//run animation

// ***************** functions ******************** //

function animate() {
	time = (new Date()).getTime() - startTime;	 // update moment in time
	phase = (time*2*Math.PI/period)%(2*Math.PI);	// limit number size to 2pi
	
	//c.clearRect(0, 0, width, height);	// for shape animations
	drawPattern();
	
	requestAnimFrame(function() {animate();});	// request new frame
}

function drawPattern() {
	pos = 0;					// reset array position for re-drawing
	
	for (y = 0; y < height; y++) {			// walk top-to-bottom (each row)
		for (x = 0; x < width; x++) {			// walk left-to-right (each column):
			
			x1 = x - xS1;			// distance of pixel from source
			y1 = y - yS1;
			
			x2 = x - xS2;
			y2 = y - yS2;
			
			d1 = Math.sqrt(x1*x1 + y1*y1);
			d2 = Math.sqrt(x2*x2 + y2*y2);
			
			t1 = Math.sin(d1*k - phase);		// phase difference wrt source
			t2 = Math.sin(d2*k - phase);
			
			a1 = 15* height/d1			// decay rate wrt distance
			a2 = 15* height/d2
			
			r = (t1+t2) * 200;			// calculate RGB values based phase
			g = 125 + (t1+t2) * 80;
			b = 235 + (t1+t2) * 20;
			a = a1 + a2
			// set RGB and alpha values of pixel; cap at 255:
			imageData.data[pos++] = Math.max(0,Math.min(255, r));
			imageData.data[pos++] = Math.max(0,Math.min(255, g));
			imageData.data[pos++] = Math.max(0,Math.min(255, b));
			imageData.data[pos++] = Math.max(0,Math.min(255, a));
		}}
		
		c.putImageData(imageData, 0, 0);		// copy the image data back onto the canvas
		addLines();				// add overlay
}

function addLines() {
	c.beginPath(); 
	c.strokeStyle = 'red';
	c.fillStyle = 'yellow';
	c.arc(xS1, yS1, 6, 0, twoPI);		// sources
	c.stroke();
	c.fill();
	c.beginPath(); 
	c.arc(xS2, yS2, 6, 0, twoPI);
	c.stroke();
	c.fill();
	
	
	c.beginPath(); 
	c.strokeStyle = 'lightgrey'
	c.moveTo(0, height/2);
	c.lineTo(width, height/2);			// x- axis
	c.stroke();
	
	c.beginPath(); 
	c.strokeStyle = 'lightgrey'
	c.moveTo(width-20, 0);
	c.lineTo(width-20, height);			// y- axis
	c.stroke();
	
	c.beginPath(); 
	c.strokeStyle = 'orange'
	c.moveTo(width/2, 0);
	c.lineTo(width/2, height);			// y- axis
	c.stroke();
	
	c.font = '16pt Tahoma';
	c.fillStyle = 'black';
	//c.fillText('λ = ' + lambda + ' px', 10, 40)
	//c.fillText('d = ' + number + ' λ' , 10, 100)
	c.fillText('S1', width/2-30, yS1+textYshift)
	c.fillText('S2', width/2-30, yS2+textYshift)
	
	c.fillText('P2', width-30, height/2+textYshift-170)
	c.fillText('P1', width-30, height/2+textYshift-60)
	c.fillText('P0', 370, 200+textYshift)
	c.fillText('P1', width-30, height/2+textYshift+60)
	c.fillText('P2', width-30, height/2+textYshift+170)
	
	c.fillText('Q', width/2-8, height/2+textYshift+170)
	c.fillText('M', width/2-8, height/2+textYshift)
	
	// + lambda*number + ' px'
	//c.fillText('ϕ = ' + (Math.round(phase*180/Math.PI) + '° '), 10, 160)
	}	