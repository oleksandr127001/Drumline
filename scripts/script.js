var play = document.querySelector(".playPause");
var clear = document.querySelector(".clear");
var tempoUp = document.querySelector(".tempo__control--up");
var tempoDown = document.querySelector(".tempo__control--down");
var tempoView = document.querySelector(".tempo__screen span");
var addPattern = document.querySelector(".add");
var drumContainer = document.querySelector(".drum");
var mainContainer = document.querySelector(".mainPanel");

var timer;
var bpm = 120; 
tempoView.innerHTML = bpm;

var sum_instruments = []; // количество инструментов на странице
var links_sound = []; // ссылки на звук. дорожки
var sum_checkbox; // количество чекбоксов
var sum_checkbox_label;

soundHandler();

activeCheckbox();

function soundHandler(){
	
	document.querySelectorAll(".drum__sound__selector").forEach(function(item){
		
		item.removeEventListener("change", MusicHandler);
		item.addEventListener("change", MusicHandler);
		
		function MusicHandler() {
			render();
		}
	});
}

function activeCheckbox(){
	
	sum_checkbox = document.querySelectorAll(".drum__note--checkbox input");
	sum_checkbox_label = document.querySelectorAll(".drum__note--checkbox label");
	
	for ( var i = 0; i < sum_checkbox.length; i++ ){
		sum_checkbox[i].num = i;
		sum_checkbox[i].addEventListener("click", paintActiveCheckbox);
	}
	
	function paintActiveCheckbox(){
		
		var n = this.num;
		
		if ( this.checked ) {
			sum_checkbox_label[n].style.backgroundColor = "#3B5474";
		} else {
			sum_checkbox_label[n].style.backgroundColor = "#FFFFFF";
		}
	}
}

function render(){	

	var option = document.querySelectorAll("option");
	sum_instruments = [];
	links_sound = [];
	
	for ( var i = 0; i < option.length; i++ ){
		
		if (option[i].selected){
			
			links_sound.push( option[i].value ); 
			sum_instruments.push([]);
		}
	}
	
	sum_checkbox = document.querySelectorAll(".drum__note--checkbox input");
	
	console.log("sum_checkbox.length " + sum_checkbox.length);
	
	var step = sum_checkbox.length / sum_instruments.length; 
	
	for ( var i = 0; i < sum_instruments.length; i++ ){
		
		for( var j = i * step; j < i * step + step; j++ ){
			
			sum_instruments[i].push( sum_checkbox[j] ); // каждая итерация заполняет чекбоксами внутренние массивы массива sum_instruments 
		}
	}
}

addPattern.onclick = function(){
	
	var pattern = drumContainer.cloneNode(true);
	pattern.style.display = "block";
	mainContainer.appendChild(pattern);
	
	soundHandler();
	
	pattern.querySelector(".drum__note--del").addEventListener("click", deleteElement);
	
	activeCheckbox();
	render();
}

function deleteElement(){
	
	this.parentNode.remove();
	render();
	
	console.log("sum_instruments.length " + sum_instruments.length);
	
	if ( play.innerHTML == "stop" && sum_instruments.length == 1 ){
		
		play.innerHTML = "play";
		letsStop();
		render();
	}
}
		
play.onclick = function(){

	console.log("sum_instruments.length " + sum_instruments.length);
	
	if ( play.innerHTML == "play" && sum_instruments.length > 0 ){
		
		play.innerHTML = "stop";
		letsPlay();
		render();
		
	} else if ( play.innerHTML == "play" &&  sum_instruments.length == 0 ) {
		
		alert("At first - add track & create pattern");
		
	} else {
		
		play.innerHTML = "play";
		letsStop();
		render();
	}
}

function letsPlay(){
	
	var interval = (( 60 * 1000 ) / bpm ) / 4; // 16-е ноты

	var current = 0;
	timer = setInterval(function(){
	
		for( var i = 0; i < sum_instruments.length; i++ ){
			
			if ( sum_instruments[i][current].checked ){	
				var drum = new Audio();
				drum.src = links_sound[i];
				drum.play();
			}
		}
		current++;
		
		if ( current >= sum_instruments[0].length ){
			
			current = 0;
		}
	}, interval);
}

function letsStop(){
	
	clearTimeout(timer);
}

tempoUp.onclick = function(){
	
	if ( play.innerHTML == "stop" ){
		return;
	} else {
		bpm += 5;
		tempoView.innerHTML = bpm;
	}
}

tempoDown.onclick = function(){
	
	if ( play.innerHTML == "stop" ){
		return;
	} else {
		bpm -= 5;
		tempoView.innerHTML = bpm;
	}
}

clear.onclick = function(){
	
	for ( var i = 0; i < sum_checkbox.length; i++ ){
		
		sum_checkbox[i].checked = false;
	}
	play.innerHTML = "play";
	letsStop();
	
	for (var i = 0; i < sum_checkbox_label.length; i++){
		
		sum_checkbox_label[i].style.backgroundColor = "#FFFFFF";
	}
}