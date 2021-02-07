import clock from "clock";
import document from "document";
import { me as device } from "device";
import { today } from "user-activity";
import * as util from "../../../common/utils.js";
import { me } from "appbit";
import fs from "fs";


//clock tick events only happen every hour
clock.granularity = "hours";

//store device width and height
const deviceWidth = device.screen.width;
const deviceHeight = device.screen.height;



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


let today = new Date();
let hour = today.getHours();
  
//hunger info
var hungerMeter = document.getElementById("hungerMeter");
var hunger;

//references feed and play buttons
const feed = document.getElementById("feed");
const play = document.getElementById("play");

var penguin = {name: "Skipp", age:0, animation: "penguin_0.png", background: "background/ice.png",default:1, play:1, sick:1, eat:1, sleep:3}
var otter = {name: "Oscar", age:0, animation: "otter_0.png", default:3, play:3, sick:3, eat:3, sleep:3}
var panda = {name: "Mochi", age:0, animation: "panda_0.png", background: "background/bamboo.png", default:3, play:1, sick:1, eat:1, sleep:3}
var beaver = {name: "Maple", age:0, animation: "beaver_0.png", background: "background/snow.png", default:1, play:1, sick:1, eat:1, sleep:3}
var dragon = {name: "Drago", age:0, animation: "dragon_0.png", background: "background/cave_purple.png", default:1, play:1, sick:1, eat:1, sleep:3}
var monkey = {name: "Bonzo", age:0, animation: "monkey_0.png", background: "background/jungle.png", default:3, play:3, sick:3, eat:3, sleep:3}
var turtle = {name: "Chad", age:0, animation: "turtle_0.png", default:1, play:1, sick:1, eat:3, sleep:3}
var fox = {name: "Fiona", age:0, animation: "fox_0.png", background: "background/snow.png", default:3, play:6, sick:1, eat:3, sleep:3}
var seal = {name: "Blubb", age:0, animation: "seal_0.png",  background: "background/ice.png", default:1, play:3, sick:1, eat:1, sleep:3}
var bat = {name: "Shade", age:0, animation: "bat_0.png", background: "background/cave.png",  default:1, play:5, sick:1,  eat:1, sleep:3}

var possiblePets = [panda,beaver,fox,bat,dragon,turtle,seal,penguin,otter,monkey];

//create new pet function
function createPet(){
  
  //for some reason these need to be here for the random to work
  var rand = Math.random()
  var ln = possiblePets.length
  var fl = Math.floor(rand*ln)
  //TODO: remove this later?
  console.log(rand)
  console.log(fl)
  console.log(ln)
  
  var pet = possiblePets[Math.floor(Math.random() * possiblePets.length)];
  let defaultImage = document.getElementById('defaultImage');
  let playImage = document.getElementById('playImage');
  let eatImage = document.getElementById('eatImage');
  let sickImage = document.getElementById('sickImage');
  let sleepImage = document.getElementById('sleepImage');
  let background = document.getElementById("background")
  
  let name = document.getElementById('petName');
  let defaultTime = document.getElementById('anim1');
  let playTime = document.getElementById('anim2');
  let sickTime = document.getElementById('anim3');
  let eatTime = document.getElementById('anim4');
  let sleepTime = document.getElementById('anim5');
  
  //change duration of bat play animation
  if(pet == bat){
    playTime.dur = 0.8
  }
 
  
  defaultImage.href = "default/" + pet.animation
  playImage.href = "play/play_" + pet.animation
  sickImage.href = "sick/sick_" + pet.animation
  eatImage.href = "eat/eat_" + pet.animation
  sleepImage.href = "sleep/sleep_" + pet.animation
  background.href = pet.background
  
  name.text = pet.name
  
  defaultTime.to = pet.default
  playTime.to = pet.play
  sickTime.to = pet.sick
  eatTime.to = pet.eat
  sleepTime.to = pet.sleep
}


//the amount of food the user has
var food;

var lastLogin;

//total steps the user took today
let totalSteps = 4000; //placeholder for testing 

// let totalSteps = today.adjusted.steps

//initial set up
function initialSetUp(){
 

  createPet() //only call this is no json.txt file
  //get the current hour

  //load data if there's a save, use defaults if not
  var json_object = loadData({"hunger": 0, "happy": 10, "food": 0, "steps": 0, "lastLogin": hour});

  //assign save data to variables
  hunger = json_object.hunger;
  happy = json_object.happy;
  food = json_object.food;
  currentSteps = totalSteps - json_object.steps;
  lastLogin = json_object.hour
  
  var timeFrame = hour - lastLogin
  //calculate and display the hunger and happy meters
  calculateHungerMeter(hunger);
  calculateHappyMeter(happy);
  
  createPet() //only call this is no json.txt file
  //get the current hour

  //load data if there's a save, use defaults if not
  var json_object = loadData({"hunger": 0, "happy": 10, "food": 0, "steps": 0, "lastLogin": hour});
  
  //assign save data to variables
  hunger = json_object.hunger;
  happy = json_object.happy;
  food = json_object.food;
  //console.log(food)
  console.log(totalSteps)
  console.log(json_object.steps)
  currentSteps = totalSteps - json_object.steps;
  console.log(currentSteps)
  lastLogin = json_object.hour
  
  var timeFrame = hour - lastLogin
  //calculate and display the hunger and happy meters
  calculateHungerMeter(hunger);
  calculateHappyMeter(happy);
  

  for(var i = 0; i<timeFrame; i++){
    decrementHappy()
    incrementHunger()
  }

  
  //if the user opens the app between 11pm and 7am, play sleep animation
  if(hour >= 23 && hour < 7){
    //TODO: IF BETWEEN 11PM AND 7PM WHEN USER ON APP, PLAY SLEEP ANIMATION
    switchTo(sleepAnimation); //DISABLE FEED AND PLAY
    
  }else if(hunger == 10 || happy == 0){ //if the user opens the app and the hunger/happy meters are empty, play sick animation
    switchTo(sickAnimation);
  }else{
    switchTo(defaultAnimation) //otherwise, play default animation
  }
  increaseFood(); //calculate how much food the user has

}

//increases the amount of food the user has
function increaseFood(){
  if(me.permissions.granted("access_activity")){
    //add food for every 100 steps the user took since they last opened the app
    food = food + Math.floor(currentSteps/100); 
    console.log( Math.floor(currentSteps/100))
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

  saveData(hunger, happy, food, totalSteps, hour);
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
  saveData(hunger, happy, food, totalSteps, hour);
}

//decrements the hunger meter
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
  saveData(hunger, happy, food, totalSteps, hour);
}

//increments the hunger meter
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
  saveData(hunger, happy, food, totalSteps, hour);
}

//switches to play animation on play button click and increments happiness meter
play.addEventListener("click", (evt) => {

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
});

//switches to feed animation on feed button click and increments hunger meter
feed.addEventListener("click", (evt) => {
   if(food > 0 && hunger > 0){
      decrementHunger();
      switchTo(eatAnimation);
      decreaseFood();
      setTimeout(function(){
      switchTo(defaultAnimation)
    }, 4000);

  if(happy == 0){
      setTimeout(function(){
        switchTo(sickAnimation)
      }, 4000);
  }
  }else{
    setTimeout(function(){
      switchTo(defaultAnimation)
    }, 4000);
  }
  saveData(hunger, happy, food, totalSteps, hour);
});

//save data
function saveData(hunger, happy, food, steps, hour){
  let json_data = {
    "hunger": hunger,
    "happy": happy,
    "food": food,
    "steps": steps,
    "lastLogin": hour
  };
  console.log("hunger" + hunger)
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

initialSetUp()

//for testing purposes
setInterval(incrementHunger, 10000)

setInterval(decrementHappy, 20000)
