// /*************** globals ****************/	

var requestId = 0;
var animStartTime = 0;
var dt = 0, t = 0, stopTime = 0, resumeTime = 0, animTime = 0;
var pause = false;
var bolPulseA = true, bolPulseB = true;
var fps = 60; 			// frames per secon
var timetext = '';
var timeRate = 1;

var feedback = document.getElementById('test');

var frameSlide = document.getElementById("instant");
var slideDisplay = document.getElementById("instantValue");

var intNumber      = document.getElementById("intNumber");
var intNumberValue = document.getElementById("intNumberValue");

var pxScale = 50;

var Ymax = 50;			// {Ymax}
var Xmax = 0.5;			// {Xmax}
var Ymin = -Ymax;
var Ypx_max = 150;
var Xpx_max = 500;

var tpi = 2*Math.PI;

var xStep = 10;

var A1 = pxScale*1;			// pxScale*{Amplitude} in cm, pxScalepx/cm
var A2 = pxScale*1;			// 2nd wave

var lambda1 = pxScale*10;			// pxScale*{lambda1} wavelength, in cm
var lambda2 = pxScale*10;			// pxScale*{lambda1} wavelength, in cm

var T1 = 10;					// {T1} in seconds
var vx = 0.001*lambda1/T1;			// {c} speed, in cm/ms*/

var T2;
var k1, k2;
var omega1, omega2;

var dc_A = 2;		// {dc_A} A offset, in cm
var dc_B = 2;		// {dc_B} B offset, in cm
var phase= -tpi/1;			// {Phase} as a fraction of 2pi

var CLCK = document.getElementById("timeText");

var o11 = document.getElementById("curve_1c");
var o12 = document.getElementById("curve_1d"); 
var o21 = document.getElementById("curve_2c");
var o22 = document.getElementById("curve_2d"); 
var o31 = document.getElementById("curve_3c");
var o32 = document.getElementById("curve_3d"); 

var gBrick = document.getElementById("brick"); 
var frameSlide = document.getElementById("instant");
var counter = document.getElementById("counter");

// /*************** animation controls ****************/	

function init() {
	calculatedVariables();
	animate();
}

function calculatedVariables(){
	
	T2 = T1 * lambda2/lambda1;		// bad Physics, to keep vx fixed
	
	k1 = tpi/lambda1;				// wave number
	k2 = tpi/lambda2;				// wave number
	
	omega1 = 0.001*tpi/T1;	// angular frequency, per ms
	omega2 = 0.001*tpi/T2;	// angular frequency, per ms
	
}

function animate() {		// control on/off and pace
	if (!pause){
		setTimeout(function() {
			dt = Date.now() - resumeTime;
			requestId = window.requestAnimationFrame(animate);
			animTime = t + dt*timeRate;
			draw(animTime);
		}, 1000 / fps);
	}
};

// /*************** display controls ****************/	

function draw(q){
	
	//feedback.innerHTML = Math.round((q)/1000) + '.' + Math.round((q)/100) % 10 + ' s';
	timetext = Math.floor((q)/1000) + '.' + Math.floor((q)/100) % 10 + ' s';
	showTime1(q);
	
	frameSlide.value = q;
	
	var stringPath11 = "M ";
	var stringPath12 = " ";
	var stringPath21 = "M ";
	var stringPath22 = " ";
	var stringPath31 = "M ";
	var stringPath32 = " ";	
	
	for (var i =  -Xpx_max/(2*xStep); i < (Xpx_max+xStep)/(2*xStep); i++) {
		x0 = -250-lambda1/2 + vx * (q);
		
		if ((bolPulseA || bolPulseB) && x0 > 250) {
			reset();
		}
		
		// ***** green, curve 1******/
		
		x11 = i*xStep ;
		x12 = x11 - xStep/4 ;
		if (bolPulseA && (x12 < x0 || x12 > x0+lambda1/2)) {
			y1 = 0;
			} else {
			y1 = - A1*Math.pow(Math.sin(k1*(x11)-omega1*q),dc_A);
		}
		stringPath11 = stringPath11 + " " + x11 + " " + y1 + " L";
		// stringPath12 = stringPath12 + " M " + x12 + " " + y1 + "h " + xStep/2;
		
		// ***** red, curve 2******/
		
		x21 = x11 ;
		x22 = x12;
		if (bolPulseB && (x12 > -x0 || x12 < -(x0+lambda2/2))) {
			y2 = 0;
			} else {
			//y2=0;
			y2 = -A2*Math.pow(Math.sin(k2*x21+omega2*q),dc_B);
		}
		stringPath21 = stringPath21 + " " + x21 + " " + y2 + " L ";
		// stringPath22 = stringPath22 + " M " + x22 + " " + y2 + "h " + xStep/2;
		
		// ***** blue, curve 1+2******/
		
		x31 = x11 ;
		x32 =  x12;
		y3 = y1 + y2;
		stringPath31 = stringPath31 + " " + x31 + " " + y3 + " L ";
		stringPath32 = stringPath32 + " M " + x32 + " " + y3 + "h " + xStep/2;
		
		if (Math.abs(i) < 1) {
			brickY = y3; 
			stringBrickPosition = 'translate(0 ' + brickY + ')'
		}
		
	}
	
	o11.setAttributeNS(null,"d", stringPath11);
	o12.setAttributeNS(null,"d", stringPath12);
	
	o21.setAttributeNS(null,"d", stringPath21);
	o22.setAttributeNS(null,"d", stringPath22);
	
	o31.setAttributeNS(null,"d", stringPath31);
	o32.setAttributeNS(null,"d", stringPath32);
	
	gBrick.setAttributeNS(null,"transform", stringBrickPosition);
}

function showTime1(z){
	
	showTime2 (Math.floor(z/1000), Math.floor(z/100) % 10);
	
	if ((bolPulseA || bolPulseB) && (z>15000)){
		reset();
	}
}

function showTime2(s,t) {
	CLCK.innerHTML = s + "." + t + " s";
}

// /*************** button controls ****************/

function start() {
	animStartTime = Date.now();
	resumeTime = animStartTime;
	calculatedVariables();
	animate();
}

function reset() {
	animStartTime = Date.now();
	resumeTime = animStartTime;
	t = 0;
	dt= 0;
	stopTime = 0;
	
	draw(t);
	
}

function pauseAnim() {
	pause ^= true;
	if (pause){
		stopTime = animTime;		// save anim elapsed time till pause
		} else {
		t = stopTime;
		dt = 0;
		resumeTime = Date.now();	// play again since...
	}
	animate()
}

function setInstant(val) {
	//slideDisplay.innerHTML = 1*val;
	stopTime = 1*val;
	
	t = 1*val;
	dt = 0;
	resumeTime = Date.now();	// play again since...
	animTime = t;
	//animate();
	draw(t);
}

function updateRangeValue() {
	intNumberValue.innerHTML = intNumber.value;
}

var f = {
    adjustA1: function(val) {
        A1 = pxScale*val;
		
		draw(animTime);
	},
	
	adjustA2: function(val) {
        A2 = pxScale*val;
		
		draw(animTime);
	},
	
	adjustL: function(val) {
		xStep = val*1;
        lambda1 = pxScale*val;
		k1 = tpi/lambda1;				// wave number
		draw(animTime);
	},
	
	adjustL2: function(val) {
        lambda2 = lambda1*Math.pow(2,val);		// 2^{-1, 0, 1} = 0.5, 1, 2
		k2 = tpi/lambda2;				// wave number
		calculatedVariables();
		draw(animTime);
	},
	
	adjustSloMo: function(val) {
		pauseAnim ();
        timeRate = val*1;
		pauseAnim ();
	},
	
	flipA: function() {
        A1 = -A1;
		document.getElementById("input_A1").value = A1/pxScale;
		
		draw(animTime);
	},
	
	flipB: function() {
		A2 = -A2;
		document.getElementById("input_A2").value = A2/pxScale;
		
		draw(animTime);
	},
	
	pulseA: function() {
	bolPulseA ^= true;
	dc_A = (dc_A == 1) ? 2 : 1;
	draw(animTime);
	
	},
	
	pulseB: function() {
	bolPulseB ^= true;
	dc_B = (dc_B == 1) ? 2 : 1;
	draw(animTime);
	
	},
	};
	
	updateRangeValue();	