import clock from "clock";
import document from "document";
import { me as device } from "device";
import { today } from "user-activity";
import { me } from "appbit";


//clock tick events happen every hour
clock.granularity = "minutes";

//store device width
const deviceWidth = device.screen.width;

//pet animations
const defaultAnimation = document.getElementById("defaultAnimation");
const playAnimation = document.getElementById("playAnimation");
const sleepAnimation = document.getElementById("sleepAnimation");
const eatAnimation = document.getElementById("eatAnimation");
const sickAnimation = document.getElementById("sickAnimation");

//helper variables
const animations = [defaultAnimation, playAnimation, sleepAnimation, eatAnimation, sickAnimation]
const maxWidth = device.screen.width * 0.4;

//happy info
var happyMeter = document.getElementById('happyMeter')
var happy = 10;

//hunger info
var hungerMeter = document.getElementById("hungerMeter");
var hunger = 0;

//references feed and play buttons
const feed = document.getElementById("feed");
const play = document.getElementById("play");

//food amount
var food = 0;

//step count
let steps = today.adjusted.steps;
console.log(steps);

//increase foodvalue based off of number of steps
function upFoodValue(){
  if(me.permissions.granted("access_activity")){
    food = food + Math.floor(steps/250)
    console.log(food)
  }
  feed.text = "FEED: " + food;
}

//decrease foodamount by pressing FEED button
function downFoodValue(){
  if(food > 0){     
    food = food - 1;
    feed.text = "FEED: " +food;
  }
}

//initial set up
function initialSetUp(){

  let today = new Date()
  let hour = today.getHours()
  if(hour >= 23 && hour < 7){
    switchTo(sleepAnimation)
  }else{
    switchTo(defaultAnimation)
  }
  var json_object = loadData({"hunger": 0, "happy": 10})
  hunger = json_object.hunger
  happy = json_object.happy
  console.log(hunger)
  calculateHungerMeter(hunger)
  calculateHappyMeter(happy)
  upFoodValue();
}

//calculates the length of the hunger meter
function calculateHungerMeter(hunger){
  var percentage = hunger/10
  hungerMeter.width = (maxWidth - (percentage*maxWidth))
}

//calculate the length of the happy meter
function calculateHappyMeter(happy){
  var percentage = (10-happy)/10
  happyMeter.width = (maxWidth - (percentage*maxWidth))
}

//switches pet animations
function switchTo(animation){
  for(var i =0; i<animations.length; i++){
    if(animations[i].id != animation.id){
       animations[i].animate("disable")
       animations[i].style.display = "none"
    }else{
      console.log(animations[i].id)
      animations[i].style.display = "inline"
      animations[i].animate("enable")
    }
  }
}

//decrements the happiness meter
function decrementHappy(){
  if(happy == 1){
    happy = happy - 1
    calculateHappyMeter(happy)
    setTimeout(function() {
      switchTo(sickAnimation)
    }, 4000)
  }else if(happy > 0){
    happy = happy - 1
    calculateHappyMeter(happy)
  }
  saveData(hunger, happy)
}

//increments the happiness meter
function incrementHappy(){
  if(happy == 0){
    happy = happy + 1
    calculateHappyMeter(happy)
    setTimeout(function() {
      switchTo(defaultAnimation)
    }, 4000)
  }
  else if(happy < 10){
    happy = happy + 1
    calculateHappyMeter(happy)
  }
  saveData(hunger, happy)
}

//decrements a pets hunger
function decrementHunger(){
  if(hunger == 10){
    hunger = hunger - 1
    calculateHungerMeter(hunger)
    setTimeout(function() {
      switchTo(defaultAnimation)
    }, 4000)
  }
  saveData(hunger, happy)
}

//increments the pets hunger 
function incrementHunger(){
  if(hunger == 9){
    hunger = hunger + 1
    calculateHungerMeter(hunger)
    setTimeout(function() {
      switchTo(sickAnimation)
    }, 4000)
  }
  else if(hunger < 10){
    hunger = hunger + 1
    calculateHungerMeter(hunger)
  }
  saveData(hunger, happy)
}

//switches to play animation on play button click and increments happiness meter
play.addEventListener("click", (evt) => {
  switchTo(playAnimation)
  incrementHappy()
  setTimeout(switchToDefault, 4000)
})

//switches to feed animation on feed button click and increments hunger meter
feed.addEventListener("click", (evt) => {
  //switchToFeed()
  if(food>0){
    decrementHunger()
    switchTo(eatAnimation)
    downFoodValue()
    setTimeout(function() {
    switchTo(defaultAnimation)
  }, 4000)
  }
})


function saveData(hunger, happy){
  let json_data = {
    "hunger": hunger,
    "happy": happy
  };

  fs.writeFileSync("json.txt", json_data, "json");
}

function loadData(defaults){
  try{
    let json_object  = fs.readFileSync("json.txt", "json");
  } catch(e){
    console.log('creating')
    let json_object = defaults
    fs.writeFileSync("json.txt", json_object, "json");
  }
  return json_object
}

initialSetUp()
//need to check time ever 5 minutes?
setInterval(incrementHunger, 10000)

setInterval(decrementHappy, 20000)
