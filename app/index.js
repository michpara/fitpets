import clock from "clock";
import document from "document";
import { me as device } from "device";
import { today } from "user-activity";
import { me } from "appbit";
import fs from "fs";

//store device width
const deviceWidth = device.screen.width;

var currentSteps;

//pet animations
const defaultAnimation = document.getElementById("defaultAnimation");
const playAnimation = document.getElementById("playAnimation");
const sleepAnimation = document.getElementById("sleepAnimation");
const eatAnimation = document.getElementById("eatAnimation");
const sickAnimation = document.getElementById("sickAnimation");

//helper variables
const animations = [defaultAnimation, playAnimation, sleepAnimation, eatAnimation, sickAnimation];
const maxWidth = device.screen.width * 0.4;

//happy info
var happyMeter = document.getElementById('happyMeter');
var happy;

//hunger info
var hungerMeter = document.getElementById("hungerMeter");
var hunger;

//references feed and play buttons
const feed = document.getElementById("feed");
const play = document.getElementById("play");

//amount of food the user has
var food;

//steps for the day
let totalSteps = 2250; //placeholder

//increases the amount of food the user has
function increaseFood(){
  if(me.permissions.granted("access_activity")){
    food = food + Math.floor(currentSteps/250);
  }
  feed.text = "FEED: " + food;
}

//decrease the amount of food the user has
function decreaseFood(){
  if( food > 0){     
    food = food - 1;
    feed.text = "FEED: " + food;
  }
}

//initial set up
function initialSetUp(){

  let today = new Date();
  let hour = today.getHours();
  
  var json_object = loadData({"hunger": 0, "happy": 10, "food": 0, "steps": 0});
  
  hunger = json_object.hunger;
  happy = json_object.happy;
  food = json_object.food;
  currentSteps = totalSteps - json_object.steps
 
  calculateHungerMeter(hunger);
  calculateHappyMeter(happy);
  
  if(hour >= 23 && hour < 7){
    switchTo(sleepAnimation);
  }else if(hunger == 10 || happy == 0){
    switchTo(sickAnimation);
  }else{
    switchTo(defaultAnimation)
  }
  increaseFood();
}

//calculates the length of the hunger meter
function calculateHungerMeter(hunger){
  var percentage = hunger/10;
  hungerMeter.width = (maxWidth - (percentage*maxWidth));
}

//calculate the length of the happy meter
function calculateHappyMeter(happy){
  var percentage = (10-happy)/10;
  happyMeter.width = (maxWidth - (percentage*maxWidth));
}

//switches pet animations
function switchTo(animation){
  for(var i =0; i<animations.length; i++){
    if(animations[i].id != animation.id){
       animations[i].animate("disable");
       animations[i].style.display = "none";
    }else{
      animations[i].style.display = "inline";
      animations[i].animate("enable");
    }
  }
}

//decrements the happiness meter
function decrementHappy(){
  if(happy == 1){
    happy = happy - 1;
    calculateHappyMeter(happy);
    setTimeout(function() {
      switchTo(sickAnimation);
    }, 4000)
  }
  else if(happy > 0){
    happy = happy - 1;
    calculateHappyMeter(happy);
  }
  saveData(hunger, happy, food, steps);
}

//increments the happiness meter
function incrementHappy(){
  if(happy == 0){
    happy = happy + 1;
    calculateHappyMeter(happy);
    setTimeout(function() {
      switchTo(defaultAnimation);
    }, 4000)
  }
  else if(happy < 10){
    happy = happy + 1;
    calculateHappyMeter(happy);
  }
  saveData(hunger, happy, food, totalSteps);
}

//decrements a pets hunger
function decrementHunger(){
    if(hunger == 10){
      hunger = hunger - 1;
      calculateHungerMeter(hunger);
      setTimeout(function() {
        switchTo(defaultAnimation);
     }, 4000)
    }
    else if(hunger > 0){
      hunger = hunger -1;
      calculateHungerMeter(hunger);
    }
  saveData(hunger, happy, food, totalSteps);
}

//increments the pets hunger 
function incrementHunger(){
  if(hunger == 9){
    hunger = hunger + 1;
    calculateHungerMeter(hunger);
    setTimeout(function() {
      switchTo(sickAnimation);
    }, 4000)
  }
  else if(hunger < 10){
    hunger = hunger + 1;
    calculateHungerMeter(hunger);
  }
  saveData(hunger, happy, food, totalSteps);
}

//switches to play animation on play button click and increments happiness meter
play.addEventListener("click", (evt) => {
  switchTo(playAnimation);
  incrementHappy();
  setTimeout(switchToDefault, 4000);
});

//switches to feed animation on feed button click and increments hunger meter
feed.addEventListener("click", (evt) => {
  //if pet fed but happy sitll down, keep sick
    if(food > 0 && hunger > 0){
      decrementHunger();
      switchTo(eatAnimation);
      decreaseFood();
      setTimeout(function() {
        switchTo(defaultAnimation);
      }, 4000)
    }
    saveData(hunger, happy, food, totalSteps);
});


function saveData(hunger, happy, food, steps){
  let json_data = {
    "hunger": hunger,
    "happy": happy,
    "food": food,
    "steps": steps
  };

  fs.writeFileSync("json.txt", json_data, "json");
}

function loadData(defaults){
  try{
    let json_object  = fs.readFileSync("json.txt", "json");
  } catch(e){
    let json_object = defaults
    fs.writeFileSync("json.txt", json_object, "json");
  }
  return json_object
}

initialSetUp()
//need to check time ever 5 minutes?
setInterval(incrementHunger, 10000)

setInterval(decrementHappy, 20000)
