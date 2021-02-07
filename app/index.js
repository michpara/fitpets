import clock from "clock";
import document from "document";
import { me as device } from "device";
import { today } from "user-activity";
import { me } from "appbit";
import fs from "fs";

//store device width and height
const deviceWidth = device.screen.width;
const deviceHeight = device.screen.height;

//global variables (these will be saved)
var pet;
var currentSteps;
var happy;
var hunger;
var food;
var lastLogin;
var lastHour;

//pet animations
const defaultAnimation = document.getElementById("defaultAnimation");
const playAnimation = document.getElementById("playAnimation");
const sleepAnimation = document.getElementById("sleepAnimation");
const eatAnimation = document.getElementById("eatAnimation");
const sickAnimation = document.getElementById("sickAnimation");

//helper variables
const animations = [defaultAnimation, playAnimation, sleepAnimation, eatAnimation, sickAnimation];
const maxWidth = device.screen.width * 0.4;

//references happy meter
var happyMeter = document.getElementById('happyMeter');

//references hunger meter
var hungerMeter = document.getElementById("hungerMeter");

//stores the total steps the user took for the day
let totalSteps = 2000;
//let totalSteps = today.adjusted.steps;

//holds the current date and time
var today = new Date();
var date = today.getDate();
var hour = today.getHours();

//references feed and play buttons
const feed = document.getElementById("feed");
const play = document.getElementById("play");

//pet objects
var penguin = {name: "Skipp", animation: "penguin_0.png", background: "background/ice.png", button: "#35566b", feed_button: "#d32f2f", play_button: "#e57373", default: 1, play: 1, sick: 1, eat: 1, sleep: 3};

var otter = {name: "Oscar", animation: "otter_0.png", background: "background/water.png", button: "#bbdefb", feed_button: "#1a237e", play_button: "#3f51b5", default: 3, play: 3, sick: 3, eat: 3, sleep: 3};

var panda = {name: "Mochi", animation: "panda_0.png", background: "background/bamboo.png", button: "#32521c", feed_button: "#e53835", play_button: "#ef5250", default: 3, play: 1, sick: 1, eat: 1, sleep: 3};

var beaver = {name: "Maple", animation: "beaver_0.png", background: "background/snow.png", button: "#4a332c", feed_button: "#691111", play_button: " #b71c1c", default: 1, play: 1, sick: 1, eat: 1, sleep: 3};

var dragon = {name: "Drago",  animation: "dragon_0.png", background: "background/cave_purple.png", button: "#1e1a26", feed_button: "#d400f9", play_button: "#e980fc", default: 1, play: 1, sick: 1, eat: 1, sleep: 3};

var monkey = {name: "Bonzo", animation: "monkey_0.png", background: "background/jungle.png", button: "#0e2e10", feed_button: "#f4501e", play_button: "#ff8965", default: 3, play: 3, sick: 3, eat: 3, sleep: 3};

var turtle = {name: "Chad", animation: "turtle_0.png", background: "background/beach.png",button: "#084252", feed_button: "#2e7d32", play_button: "#66bb6a",default:1, play:1, sick:1, eat:3, sleep:3};

var fox = {name: "Fiona", animation: "fox_0.png", background: "background/snow.png", button: "#4a332c", feed_button: "#691111", play_button: "#b71c1c", default: 3, play: 6, sick: 1, eat: 3, sleep: 3};

var seal = {name: "Blubb", animation: "seal_0.png",  background: "background/ice.png", button: "#35566b", feed_button: "#d32f2f", play_button: "#e57373", default: 1, play: 3, sick: 1, eat: 1, sleep: 3};

var bat = {name: "Shade", animation: "bat_0.png", background: "background/cave.png",  button: "#161a1f", feed_button: "#388e3d", play_button: "#81c784", default: 1, play: 5, sick: 1, eat: 1, sleep: 3};

//array of pet objects, used for random selection
var possiblePets = [panda, beaver, fox, bat, dragon, turtle, seal, penguin, otter, monkey];

//function is called everytime the app is loaded
function initialSetUp(){
  
  fs.unlinkSync("json.txt");
  
  //receives save data if it exists, otherwise uses defaults
  var json_object = loadData({"hunger": 0, "happy": 10, "food": 0, "steps": 0, "lastLogin": date, "pet": createPet(), "lastHour": hour});
  
  //assign save data to variables
  hunger = json_object.hunger;
  happy = json_object.happy;
  food = json_object.food;
  currentSteps = totalSteps - json_object.steps;
  lastLogin = json_object.lastLogin;
  pet = json_object.pet;
  lastHour = json_object.lastHour;
  
  //display the pet
  displayPet(pet);

  //if it's a new day (12am+)
  if(lastLogin < date){
    //reset all data and run initial function again
    fs.unlinkSync("json.txt");
    initialSetUp();
    return;
  }

  //calculate and display the hunger and happy meters
  calculateHungerMeter(hunger);
  calculateHappyMeter(happy);
  
  //if the user opens the app between 11pm and 7am, play sleep animation
      console.log(hour)

  if(hour >= 0 && hour < 8){
    switchTo(sleepAnimation); 
  }else if(hunger == 10 || happy == 0){ //if the user opens the app and the hunger/happy meters are empty, play sick animation
    switchTo(sickAnimation);
    var timeDur = hour - lastHour;
    for(var i = 0; i<timeDur; i++){
      incrementHunger();
      decrementHappy();
    }
  }else{
    switchTo(defaultAnimation); //otherwise, play default animation
    var timeDur = hour - lastHour;
      for(var i = 0; i<timeDur; i++){
      incrementHunger();
      decrementHappy();
    }
  }
  increaseFood(); //calculate how much food the user has
  
  saveData(hunger, happy, food, totalSteps, date, pet, hour);

}

//creates a new random pet
function createPet(){
  var rand = Math.random();
  var ln = possiblePets.length;
  var fl = Math.floor(rand*ln);
  //remove?
  console.log(rand);
  console.log(fl);
  console.log(ln);
  
  return possiblePets[Math.floor(Math.random() * possiblePets.length)];
}

//displays the pet on the fitbit screen
function displayPet(pet){
  
  //references elements
  var defaultImage = document.getElementById('defaultImage');
  var playImage = document.getElementById('playImage');
  var eatImage = document.getElementById('eatImage');
  var sickImage = document.getElementById('sickImage');
  var sleepImage = document.getElementById('sleepImage');
  var background = document.getElementById("background")
  
  var name = document.getElementById('petName');
  var defaultTime = document.getElementById('anim1');
  var playTime = document.getElementById('anim2');
  var sickTime = document.getElementById('anim3');
  var eatTime = document.getElementById('anim4');
  var sleepTime = document.getElementById('anim5');
 
  //displays the animations for the selected pet 
  defaultImage.href = "default/" + pet.animation;
  playImage.href = "play/play_" + pet.animation;
  sickImage.href = "sick/sick_" + pet.animation;
  eatImage.href = "eat/eat_" + pet.animation;
  sleepImage.href = "sleep/sleep_" + pet.animation;
  background.href = pet.background;
  
  //displays the pets name
  name.text = pet.name;
  
  //display the pets corresponding colours to buttons and meters
  feed.style.fill = pet.button;
  play.style.fill = pet.button;
  hungerMeter.style.fill = pet.feed_button;
  happyMeter.style.fill = pet.play_button;
  
  //sets the animation start/end lengths for the selected pet
  defaultTime.to = pet.default;
  playTime.to = pet.play;
  sickTime.to = pet.sick;
  eatTime.to = pet.eat;
  sleepTime.to = pet.sleep;
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
  //if happy meter is empty, play sick animation
  if(happy == 1){
    setTimeout(function() {
      switchTo(sickAnimation);
    }, 4000);
  }
  if(happy > 0){
    happy = happy - 1;
    calculateHappyMeter(happy);
  }
  saveData(hunger, happy, food, totalSteps, date, pet, hour);
}

//increments the happiness meter
function incrementHappy(){
  //if happy meter is empty and hunger meter isn't empty, play default animation
  if(happy == 0 && hunger != 10){
    setTimeout(function() {
      switchTo(defaultAnimation);
    }, 4000)
  }
  if(happy < 10){
    happy = happy + 1;
    calculateHappyMeter(happy);
  }
  saveData(hunger, happy, food, totalSteps, date, pet, hour);
}
//decrements the hunger meter
function decrementHunger(){
  //if hunger is full and happy is not empty, switch to default
  if(hunger == 10 && happy != 0){
    setTimeout(function() {
      switchTo(defaultAnimation);
    }, 4000)
  }
  if(hunger > 0){
    hunger = hunger - 1;
    calculateHungerMeter(hunger);
  }
  saveData(hunger, happy, food, totalSteps, date, pet, hour);
}

//increments the hunger meter
function incrementHunger(){
  //if hunger is full, switch to sick animation
  if(hunger == 9){
    setTimeout(function() {
      switchTo(sickAnimation);
    }, 4000)
  }
  if(hunger < 10){
    hunger = hunger + 1;
    calculateHungerMeter(hunger);
  }
  saveData(hunger, happy, food, totalSteps, date, pet, hour);
}

//switches to play animation on play button click and increments happiness meter
play.addEventListener("click", (evt) => {
  //make sure play button is disabled if pet is sleeping
  if(hour < 0 && hour >=8){
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
  saveData(hunger, happy, food, totalSteps, date, pet, hour);
});

//switches to feed animation on feed button click and increments hunger meter
feed.addEventListener("click", (evt) => {
   //make sure feed button is disabled if the pet is sleeping
   if(hour < 0 && hour >=8){
     //make sure feed button is disabled if food is empty or hunger is empty
     if(food > 0 && hunger > 0){
        decrementHunger();
        switchTo(eatAnimation);
        decreaseFood();
        setTimeout(function(){
        switchTo(defaultAnimation)
      }, 4000);
     }
     if(happy == 0){
        setTimeout(function(){
          switchTo(sickAnimation)
        }, 4000);
     }
     else{
       setTimeout(function(){
       switchTo(defaultAnimation)
      }, 4000);
    }
   
  saveData(hunger, happy, food, totalSteps, date, pet, hour);
}});

//save data
function saveData(hunger, happy, food, steps, date, pet, lastHour){
    let json_data = {
    "hunger": hunger,
    "happy": happy,
    "food": food,
    "steps": steps,
    "lastLogin": date,
    "pet": pet,
    "lastHour": lastHour
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

initialSetUp()

//for testing purposes
//setInterval(incrementHunger, 10000)

//setInterval(decrementHappy, 20000)
