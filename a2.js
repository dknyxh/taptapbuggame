//PRE-GAME - page1
var inGame = 0
var level = 0
//IN-GAME - page2
var ctx;
var bugList = [];
var foodList = [];
var header;
var isPause = 0;
var timeLet;
var scoreGet;
//Time
var startTime;
var eTime;
var lastTime;
//A counter to count how many secs have passed
var buggen;
var buggenTo;
//FrameID;
var frameID;
//CLASS DECALRE
function Bug(x,y,type,level){
	this.x = x;
	this.y = y;
	this.bugColor;
	this.direction = Math.PI/2;
	this.dead = 0;
	this.opacity = 1;
	if(level ==1){
		if(type == "b"){
			this.speed = 150;
			this.score = 5;
			this.bugColor = "black";
		}
		else if(type == "r"){
			this.speed = 75;
			this.score = 3;
			this.bugColor = "red";
		}
		else if(type == "o"){
			this.speed = 60;
			this.score = 1;
			this.bugColor = "orange";
		}
	}
	else if(level ==2){
				if(type == "b"){
			this.speed = 200;
			this.score = 5;
			this.bugColor = "black";
		}
		else if(type == "r"){
			this.speed = 100;
			this.score = 3;
			this.bugColor = "red";
		}
		else if(type == "o"){
			this.speed = 80;
			this.score = 1;
			this.bugColor = "orange";
		}
	}
	this.draw = function(){
		ctx.save();
		ctx.translate(this.x,this.y);
		ctx.beginPath();
		ctx.rotate(this.direction+Math.PI/2);
		ctx.arc(0,-15,5,0*Math.PI,2*Math.PI);
		ctx.stroke();
		ctx.fillStyle = this.bugColor;
		ctx.fill();
		ctx.moveTo(0,-10);
		ctx.quadraticCurveTo(-10,-10,0,20);
		ctx.stroke();
		ctx.moveTo(0,-10);
		ctx.quadraticCurveTo(10,-10,0,20);
		ctx.stroke();
		ctx.fillStyle = this.bugColor;
		ctx.fill();
		ctx.moveTo(-5,2);
		ctx.lineTo(-10,4);
		ctx.stroke();
		ctx.moveTo(5,2);
		ctx.lineTo(10,4);
		ctx.stroke();
		ctx.moveTo(-3,10);
		ctx.lineTo(-8,12);
		ctx.stroke();
		ctx.moveTo(3,10);
		ctx.lineTo(8,12);
		ctx.stroke();
		ctx.restore();
	}
	this.fade = function(){
		ctx.save();
		ctx.globalAlpha = this.opacity /2 ;
		this.opacity /=2;
		ctx.translate(this.x,this.y);
		ctx.beginPath();
		ctx.rotate(this.direction+Math.PI/2);
		ctx.arc(0,-15,5,0*Math.PI,2*Math.PI);
		ctx.stroke();
		ctx.fillStyle = "red";
		ctx.fill();
		ctx.moveTo(0,-10);
		ctx.quadraticCurveTo(-10,-10,0,20);
		ctx.stroke();
		ctx.moveTo(0,-10);
		ctx.quadraticCurveTo(10,-10,0,20);
		ctx.stroke();
		ctx.fillStyle = "red";
		ctx.fill();
		ctx.moveTo(-5,2);
		ctx.lineTo(-10,4);
		ctx.stroke();
		ctx.moveTo(5,2);
		ctx.lineTo(10,4);
		ctx.stroke();
		ctx.moveTo(-3,10);
		ctx.lineTo(-8,12);
		ctx.stroke();
		ctx.moveTo(3,10);
		ctx.lineTo(8,12);
		ctx.stroke();
		ctx.restore();
	}
	this.move = function(t){
		var desx = foodList[0].x;
		var desy = foodList[0].y;
		var mindistance = Math.sqrt((desx-this.x)*(desx-this.x) + (desy-this.y)*(desy-this.y));
		var distance = 0;
		var d;
		var stop=0;
		var change_x;
		var change_y;
		var willC;
		var isC;
		var rC;
		if(this.direction >=Math.PI){
			this.direction = -(2*Math.PI - this.direction);
		}
		if(this.direction<= -Math.PI){
			this.direction = this.direction+2*Math.PI;
		}
		for(var i = 0;i<foodList.length;i++){
			distance = Math.sqrt((foodList[i].x-this.x)*(foodList[i].x-this.x) + (foodList[i].y-this.y)*(foodList[i].y-this.y));
			if(distance < mindistance){
				desx = foodList[i].x;
				desy = foodList[i].y;
				mindistance = distance;
			}
			if(distance<2){
				foodList.splice(i,1);
			}
		}
		d = Math.atan2(desy-this.y,desx-this.x);
		this.direction = Math.sign(d-this.direction)*0.05 *Math.sign(Math.PI-Math.abs(d-this.direction)) + this.direction;
		if(Math.PI-Math.abs(d-this.direction) == 0){
			this.direction = 0.05 + this.direction;
		}
		while(this.direction>2* Math.PI){
			this.direction-= 2*Math.PI;
		}
		change_x = this.x + t/1000*this.speed* Math.cos(d);
		change_y = this.y + t/1000*this.speed* Math.sin(d);
		//Collision
		for(var j=0;j<bugList.length;j++){
			if(bugList.dead == 0){
				willC = Math.sqrt((change_x-bugList[j].x)*(change_x-bugList[j].x) + (change_y -bugList[j].y)*(change_y -bugList[j].y))<Math.sqrt(5*5+20*20)*2;
				isC =  Math.sqrt((this.x-bugList[j].x)*(this.x-bugList[j].x) + (this.y -bugList[j].y)*(this.y -bugList[j].y))<Math.sqrt(5*5+20*20)*2;
				if(this.speed<bugList[j].speed && (willC ||isC)){
					stop = 1;
				}
			}
			// else if(this.speed == bugList[j].speed && (willC ||isC) && this.y!=bugList[j].y){
			// 	if(this.x<bugList[j].x && !(this.direction>= -Math.PI/2 && this.direction<Math.PI/2)){
			// 		stop = 0;
			// 	}
			// 	else if(this.x>bugList[j].x && this.y < bugList[j].y &&((this.direction<=-Math.PI && this.direction>=-3*Math.PI/2)||(this.direction>=Math.PI/2&&this.direction<=Math.PI))){
			// 		stop = 1;
			// 	}
			// 	else if (this.x<bugList[j].x){
			// 		stop = 1;
			// 	}
			// }
		}
		if(!stop){
			this.x = this.x + t/1000*this.speed* Math.cos(d);
			this.y = this.y + t/1000*this.speed* Math.sin(d);
		}
	}
}
function Food(x,y){
	this.x = x;
	this.y = y;
	this.draw = function(){
		ctx.beginPath();
		ctx.rect(this.x-10,this.y-10,20,20);
		ctx.stroke();
	}
}
function Header(x,y,timer,pause,score){
	this.x = x;
	this.y = y;
	this.timer = timer;
	this.pause = pause;
	this.score = score;
	this.draw = function(){
		ctx.beginPath();
		ctx.rect(this.x+2,this.y+2,396,196);
		ctx.stroke();
		ctx.font = "30px Comic Sans MS";
		ctx.fillText(this.timer+"secs", this.x+2, this.y+32); 
		ctx.font = "30px Comic Sans MS";
		ctx.fillText(this.score, this.x+300, this.y+32); 

	}
	this.scoreplus = function(score){
		this.score+=score;
	}
	this.countdown=function(){
		this.timer= this.timer - 1;
	}
}
//Frame
function frame(curTime){
	if(isPause == 0){
	//Draw set up
	ctx.clearRect(0,0,400,600);
	//Time Section
	if(!startTime){
		startTime=curTime;
	}
	if(!lastTime){
		lastTime=curTime;
	}
	if(buggenTo == 0){
		buggenTo = Math.floor(Math.random()*3+1);
	}
	eTime = curTime-startTime;
	if(eTime>=1000){
		//header.countdown();
		timeLet-=1;
		header.timer.innerHTML = "Time:"+timeLet;
		startTime = curTime;
		buggen +=1;
		//Generate Bugs
		if(buggen ==buggenTo){
			var nx = Math.floor((Math.random() * 390) + 10);
			var rd = Math.floor(Math.random()*10);
			var col;
			if(rd >= 0 && rd<=3){
				col = "o";
			}
			else if(rd>=4 && rd<=6){
				col = "b";
			}
			else{
				col = "r";
			}
			bugList.push(new Bug(nx,-20,col,level));
			buggenTo = Math.floor(Math.random()*3+1);
			buggen = 0;
		}
	}
	//Draw Food
	for (var i = 0; i <foodList.length; i++) {
		foodList[i].draw();
	};
	//Draw Bugs
	for (var j = 0; j <bugList.length; j++) {
		if(bugList[j].dead ==0){
			bugList[j].draw();
			if(foodList.length>0){
				bugList[j].move(curTime-lastTime);
			}
		}
		else{
			if(bugList[j].opacity>0.05){
				bugList[j].fade();
			}
			else{
				bugList.splice(j,1);
			}
		}

	};
	lastTime = curTime;
	}
	else{
		lastTime = curTime;
	}
	frameID = window.requestAnimationFrame(frame);
	if(foodList.length==0){
		endgame();
	}
	if(timeLet == 0 && level ==1){
		golevel2();
	}
	else if (timeLet == 0 && level==2){
		endgame();
	}
}
function unpause(){
	isPause = 0;
	header.button.onclick = pause;
	header.button.value = "||"
}
function pause(){
	isPause = 1;
	header.button.onclick = unpause;
	header.button.value = "|>"
}
//Click
function click(event){
	if(isPause == 0){
		var click_x = event.x;
		var click_y = event.y;
		for(var i = 0;i<bugList.length;i++){
			if(Math.sqrt((bugList[i].x - click_x)*(bugList[i].x - click_x) + (bugList[i].y - click_y)*(bugList[i].y - click_y))<30){
				bugList[i].dead =1;
				scoreGet += bugList[i].score;
				header.score.innerHTML = "Score:"+scoreGet;
			}
		}
	}
	else{

	}
	//bugList.push(new Bug(event.x,event.y,'o',1));
}
//START
function startgame(){
	//Switch pages
	document.getElementById('page1').style.display = "none";
	document.getElementById('page2').style.display = "inline";
	//Set up canvas
	var canvas = document.getElementById('game');
	//Set up timer and score and pause button
	header = document.getElementById('header')
	header.timer= document.getElementById('headerTimer');
	header.score = document.getElementById('headerScore');
	header.button = document.getElementById('headerPause');
	header.button.onclick = pause;
	scoreGet = 0;
	timeLet =60;
	header.timer.innerHTML = "Time:"+ timeLet;
	header.score.innerHTML = "Score:"+ scoreGet;
	canvas.addEventListener("click",click,false);
	ctx = canvas.getContext("2d");
	ctx.clearRect(0,0,400,800);
	inGame = 1;
	buggen = 0;
	buggenTo = 0;
	//Determine level
	if(document.getElementsByName('level')[0].checked){
		level = 1
	}
	else{
		level = 2
	}
	//Create header
	//header = new Header(0,0,100,1,100);
	//Create food
	var fx = 0;
	var fy = 0;
	for (var i = 0; i < 5; i++) {
		fx = Math.floor((Math.random() * 380) + 0);
		fy = Math.floor((Math.random() * 460) + 120);
		for(var j =0;j<foodList.length;j++){
			while(Math.abs(fx-foodList[j].x) < Math.sqrt(200) || Math.abs(fy-foodList[j].y) < Math.sqrt(200) ){
				fx = Math.floor((Math.random() * 380) + 0);
				fy = Math.floor((Math.random() * 460) + 120);
			}
		}
		foodList.push(new Food(fx,fy));
	};
	//AnimationRequest
	window.requestAnimationFrame(frame);
}

function endgame(){
	window.cancelAnimationFrame(frameID);
	bugList.splice(0,bugList.length);
	foodList.splice(0,foodList.length);
	ctx.clearRect(0,0,400,600);
	ctx = null;
	inGame = 0;
	level = 0;
	startTime = null;
	eTime = null;
	lastTime = null;
	console.log(bugList.length);
	if(localStorage.getItem("score")<scoreGet){
		localStorage.setItem("score", scoreGet);
		document.getElementById('Score').innerHTML = scoreGet;
	}
	document.getElementById('page1').style.display = "inline";
	document.getElementById('page2').style.display = "none";
}
function golevel2(){
	endgame();
		//Switch pages
	document.getElementById('page1').style.display = "none";
	document.getElementById('page2').style.display = "inline";
	//Set up canvas
	var canvas = document.getElementById('game');
	//Set up timer and score and pause button
	header = document.getElementById('header')
	header.timer= document.getElementById('headerTimer');
	header.score = document.getElementById('headerScore');
	header.button = document.getElementById('headerPause');
	header.button.onclick = pause;
	scoreGet = 0;
	timeLet =60;
	header.timer.innerHTML = "Time:"+ timeLet;
	header.score.innerHTML = "Score:"+ scoreGet;
	canvas.addEventListener("click",click,false);
	ctx = canvas.getContext("2d");
	ctx.clearRect(0,0,400,800);
	inGame = 1;
	buggen = 0;
	buggenTo = 0;
	//Determine level
	level = 2;
	//Create header
	//header = new Header(0,0,100,1,100);
	//Create food
	var fx = 0;
	var fy = 0;
	for (var i = 0; i < 5; i++) {
		fx = Math.floor((Math.random() * 380) + 0);
		fy = Math.floor((Math.random() * 460) + 120);
		for(var j =0;j<foodList.length;j++){
			while(Math.abs(fx-foodList[j].x) < Math.sqrt(200) || Math.abs(fy-foodList[j].y) < Math.sqrt(200) ){
				fx = Math.floor((Math.random() * 380) + 0);
				fy = Math.floor((Math.random() * 460) + 120);
			}
		}
		foodList.push(new Food(fx,fy));
	};
	//AnimationRequest
	window.requestAnimationFrame(frame);
}
function pageload(){
	document.getElementById('startbutton').onclick = startgame;
	document.getElementById('endbutton').onclick = endgame;
	var s = localStorage.getItem("score")
	if(s){
		document.getElementById('Score').innerHTML = s;
	}
	else{
		document.getElementById('Score').innerHTML = 0;
	}
}
window.onload = pageload
