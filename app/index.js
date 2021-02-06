import clock from "clock";
import document from "document";
import { me as device } from "device";
import { today } from "user-activity";
import { me } from "appbit";
import fs from "fs";

//store device width
const deviceWidth = device.screen.width;

//sets clock tick event to every hour
clock.granularity = "hours";

//store how many steps the user took since they last opened the app
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

//the amount of food the user has
var food;

//total steps the user took today
let totalSteps = 90000; //placeholder for testing 
// let totalSteps = today.adjusted.steps

let today = new Date();
let hour = today.getHours()

//initial set up
function initialSetUp(){
  
  //get the current hour
 ;
  
  //load data if there's a save, use defaults if not
  var json_object = loadData({"hunger": 0, "happy": 10, "food": 0, "steps": 0});
  
  //assign save data to variables
  hunger = json_object.hunger;
  happy = json_object.happy;
  food = json_object.food;
  currentSteps = totalSteps - json_object.steps;

  
  //calculate and display the hunger and happy meters
  calculateHungerMeter(hunger);
  calculateHappyMeter(happy);
  
  //if the user opens the app between 11pm and 7am, play sleep animation
  if(hour >= 23 && hour < 7){
    //TODO: IF BETWEEN 11PM AND 7PM WHEN USER ON APP, PLAY SLEEP ANIMATION
    switchTo(sleepAnimation); //DISABLE FEED AND PLAY : DONE IN THE addEventListener METHOD FOR BOTH FEED AND PLAY
    
   
  }else
    {
    if (hunger == 10 || happy == 0){ //if the user opens the app and the hunger/happy meters are empty, play sick animation
    switchTo(sickAnimation);
    feed.disable = false;
    play.disable = false;
  }else{
    switchTo(defaultAnimation) //otherwise, play default animation
    feed.disable = false;
    play.disable = false;
  }
   //calculate how much food the user has
    }
  increaseFood();
}

//increases the amount of food the user has
function increaseFood(){
  if(me.permissions.granted("access_activity")){
    //add food for every 100 steps the user took since they last opened the app
    food = food + Math.floor(currentSteps/100); 
  }
  feed.text = "FEED: " + food; //update the display
}

//decrease the amount of food the user has
function decreaseFood(){
  //decrement food by 1
  if(food > 0){     
    food = food - 1;
    feed.text = "FEED: " + food; //update the display
  }
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
  for(var i=0; i<animations.length; i++){
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
    setTimeout(function() {
      switchTo(sickAnimation);
    }, 4000)
  }
  if(happy > 0){
    happy = happy - 1;
    calculateHappyMeter(happy);
  }
  saveData(hunger, happy, food, totalSteps);
}

//increments the happiness meter
function incrementHappy(){
  if(happy == 0 && hunger != 10){
    setTimeout(function() {
      switchTo(defaultAnimation);
    }, 4000)
  }
  if(happy < 10){
    happy = happy + 1;
    calculateHappyMeter(happy);
  }
  saveData(hunger, happy, food, totalSteps);
}

//decrements a pets hunger
function decrementHunger(){
    if(hunger == 10 && happy != 0){
      setTimeout(function() {
        switchTo(defaultAnimation);
      }, 4000)
    }
    if(hunger > 0){
      hunger = hunger - 1;
      calculateHungerMeter(hunger);
    }
  saveData(hunger, happy, food, totalSteps);
}

//increments the pets hunger 
function incrementHunger(){
  if(hunger == 9){
    setTimeout(function() {
      switchTo(sickAnimation);
    }, 4000)
  }
  if(hunger < 10){
    hunger = hunger + 1;
    calculateHungerMeter(hunger);
  }
  saveData(hunger, happy, food, totalSteps);
}

//switches to play animation on play button click and increments happiness meter
play.addEventListener("click", (evt) => {
  if(hour > 23 && hour <= 7){
     return;
  }
  else
  {
  switchTo(playAnimation);
  incrementHappy();
  if(hunger == 10){
    setTimeout(function(){
      switchTo(sickAnimation);
    }, 4000);
  }else{
    setTimeout(function(){
      switchTo(defaultAnimation);
    }, 4000);
  }
  }
});

//switches to feed animation on feed button click and increments hunger meter
feed.addEventListener("click", (evt) => {
  
  if(hour > 23 && hour <= 7){
    return;
  } else if(food > 0 && hunger > 0){
      decrementHunger();
      switchTo(eatAnimation);
      decreaseFood();
  }
  if(happy == 0){
      setTimeout(function(){
        switchTo(sickAnimation)
      }, 4000);
  }else{
    setTimeout(function(){
      switchTo(defaultAnimation)
    }, 4000);
  }
  saveData(hunger, happy, food, totalSteps);
});

//save data
function saveData(hunger, happy, food, steps){
  let json_data = {
    "hunger": hunger,
    "happy": happy,
    "food": food,
    "steps": steps
  };

  fs.writeFileSync("json.txt", json_data, "json");
}

//load data
function loadData(defaults){
  try{
    let json_object  = fs.readFileSync("json.txt", "json");
  } catch(e){
    let json_object = defaults
    fs.writeFileSync("json.txt", json_object, "json");
  }
  return json_object
}

//TO DO: EVERY HOUR DECREMENT HUNGER AND HAPPY

//call when app opens
initialSetUp()

//for testing purposes
setInterval(incrementHunger, 10000)

setInterval(decrementHappy, 20000)
