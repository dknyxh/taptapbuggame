//PRE-GAME - page1
var inGame = 0
var level = 0
//IN-GAME - page2
var ctx;
var bugList = [];
var foodList = [];
var header;
//Time
var startTime;
var startTime1;
var eTime;
var eTime1;
var lastTime;
//FrameID;
var frameID;
//CLASS DECALRE
function Bug(x,y,type,level){
	this.x = x;
	this.y = y;
	this.direction = 0;
	if(level = 1){
		if(type == "b"){
			this.speed = 150;
		}
		else if(type == "r"){
			this.speed = 75;
		}
		else if(type == "o"){
			this.speed = 60;
		}
	}
	this.draw = function(){
			ctx.save();
			ctx.beginPath();
			ctx.translate(this.x,this.y);
			ctx.rotate(this.direction+Math.PI/2);
			ctx.rect(-5,-20,10,40);
			ctx.stroke();
			ctx.restore();
	}
	this.move = function(t){
		var desx = foodList[0].x;
		var desy = foodList[0].y;
		var mindistance = Math.sqrt((desx-this.x)*(desx-this.x) + (desy-this.y)*(desy-this.y));
		var distance = 0;
		var d;
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
		this.direction = d;
		this.x = this.x + t/1000*this.speed* Math.cos(d);
		this.y = this.y + t/1000*this.speed* Math.sin(d);
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
		console.log(this.timer);

	}
	this.change=function(timer,pause){
		this.timer = timer;
		this.pause = pause;
		this.score = score;
	}
	this.countdown=function(){
		this.timer= this.timer - 1;
	}
}
//Frame
function frame(curTime){
	//Draw set up
	ctx.clearRect(0,0,400,800);
	//Time Section
	if(!startTime){
		startTime=curTime;
	}
	if(!lastTime){
		lastTime=curTime;
	}
	if(!startTime1){
		startTime1=curTime
	}
	eTime = curTime-startTime;
	eTime1 = curTime-startTime1;
	if(eTime1>=1000){
		header.countdown();
		startTime1 = curTime;
		//console.log(header.timer);
	}
	if(eTime>=3000){
		var nx = Math.floor((Math.random() * 390) + 0);
		bugList.push(new Bug(nx,200,"o",1));
		startTime = curTime;
	}
	//Draw Header
	header.draw();
	//Draw Food
	for (var i = 0; i <foodList.length; i++) {
		foodList[i].draw();
	};
	//Draw Bugs
	for (var j = 0; j <bugList.length; j++) {
		bugList[j].draw();
		if(foodList.length>0){
			bugList[j].move(curTime-lastTime);
		}
	};
	lastTime = curTime;
	frameID = window.requestAnimationFrame(frame);
}
//START
function startgame(){
	//Switch pages
	document.getElementById('page1').style.display = "none";
	document.getElementById('page2').style.display = "inline";
	//Set up canvas
	ctx = document.getElementById('game').getContext("2d");
	ctx.clearRect(0,0,400,800);
	inGame = 1;
	//Determine level
	if(document.getElementsByName('level')[0].checked){
		level = 1
	}
	else{
		level = 2
	}
	//Create header
	header = new Header(0,0,100,1,100);
	//Create food
	var fx = 0;
	var fy = 0;
	for (var i = 0; i < 5; i++) {
		fx = Math.floor((Math.random() * 380) + 0);
		fy = Math.floor((Math.random() * 460) + 320);
		for(var j =0;j<foodList.length;j++){
			while(Math.abs(fx-foodList[j].x) < Math.sqrt(200) || Math.abs(fy-foodList[j].y) < Math.sqrt(200) ){
				fx = Math.floor((Math.random() * 380) + 0);
				fy = Math.floor((Math.random() * 460) + 320);
			}
		}
		foodList.push(new Food(fx,fy));
	};
	//AnimationRequest
	window.requestAnimationFrame(frame);
	//console.log(level);
	//console.log(inGame);
	//now = new Date();
	//console.log(now.getSeconds())
}

function endgame(){
	window.cancelAnimationFrame(frameID);
	bugList.splice(0,bugList.length);
	foodList.splice(0,foodList.length);
	ctx.clearRect(0,0,400,800);
	ctx = null;
	inGame = 0;
	level = 0;
	startTime = null;
	eTime = null;
	lastTime = null;
	console.log(bugList.length);
	document.getElementById('page1').style.display = "inline";
	document.getElementById('page2').style.display = "none";
}

function pageload(){
	document.getElementById('startbutton').onclick = startgame;
	document.getElementById('endbutton').onclick = endgame;
}
window.onload = pageload
