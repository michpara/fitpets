import clock from "clock";
import document from "document";
import { me as device } from "device";
import { today } from "user-activity";
import * as fs from "fs";

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

//initial set up
function initialSetUp(){
  let today = new Date()
  let hour = today.getHours()
  if(hour >= 23 && hour < 7){
    switchTo(sleepAnimation)
  }else{
    switchTo(defaultAnimation)
  }
  calculateHungerMeter(hunger)
  calculateHappyMeter(happy)
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
  else if (hunger > 0){
    hunger = hunger - 1
    calculateHungerMeter(hunger)
  }
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
}

//switches to play animation on play button click and increments happiness meter
play.addEventListener("click", (evt) => {
  switchTo(playAnimation)
  incrementHappy()
  setTimeout(function() {
    switchTo(defaultAnimation)
  }, 4000)
})

//switches to feed animation on feed button click and increments hunger meter
feed.addEventListener("click", (evt) => {
  switchTo(eatAnimation)
  decrementHunger()
  setTimeout(function() {
    switchTo(defaultAnimation)
  }, 4000)
})


//performs the following every hour
/*
clock.ontick = (evt) => {
  console.log(hours)
  let today = evt.date;
  let hours = today.getHours();
    //disabled feed and play buttons at 11pm and starts playing sleep animation
    if (hours >= 21 and hours < 7){ 
      feed.disable()
      play.disable()
      switchTo(sleepAnimation)
    }
    //between 7am and 11pm, decrement hunger and happiness every hour and enable buttons again
    if (hours >= 7 && hours < 21){
      feed.disable()
      play.disable()
      switchTo(sleepAnimation)
     feed.enable()
      play.enable()
      switchTo(defaultAnimation)
      //decrementHunger()
      //decrementHappy()
    }
  }*/

/*function saveData(hungerMeter){
  let json_data = {
    "hungerMeter": hungerMeter.width,
  };

  fs.writeFileSync("json.txt", json_data, "json");
}

function loadData(defaults){
  try{
    let json_object  = fs.readFileSync("json.txt", "json");
  } catch(e){
    let json_object = defaults
    saveData(json_object.hungerMeter)
  }
  console.log(json_object.hungerMeter)
  return json_object.hungerMeter
}*/

initialSetUp()
//need to check time ever 5 minutes?
setInterval(incrementHunger, 10000)

setInterval(decrementHappy, 20000)
