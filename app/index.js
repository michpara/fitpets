import clock from "clock";
import document from "document";
import { me as device } from "device";
import { today } from "user-activity";
import * as util from "../../../common/utils.js";



//clock tick events only happen every hour
clock.granularity = "hours";

//store device width and height
const deviceWidth = device.screen.width;
const deviceHeight = device.screen.height;

//pet animations
const defaultAnimation = document.getElementById("defaultAnimation");
const playAnimation = document.getElementById("playAnimation");
const sleepAnimation = document.getElementById("sleepAnimation");
const eatAnimation = document.getElementById("eatAnimation");
const sickAnimation = document.getElementById("sickAnimation");

//helper variables
const animations = [defaultAnimation, playAnimation, sleepAnimation, eatAnimation, sickAnimation]


//happy meter info
const happyMeter = document.getElementById('happyMeter')
var happyWidth = device.screen.width * 0.4;

//hunger meter info
const hungerMeter = document.getElementById("hungerMeter");
var hungerWidth = device.screen.width * 0.4;

//references feed and play buttons
const feed = document.getElementById("feed");
const play = document.getElementById("play");

var penguin = {name: "Skipp", age:0, animation: "penguin_0.png", time:1, time2:1, time3:1, time4:1, time5:3}
var otter = {name: "Oscar", age:0, animation: "otter_0.png", time:3, time2:3, time3:3, time4:3, time5:3}
var panda = {name: "Mochi", age:0, animation: "panda_0.png", time:3, time2:1, time3:1, time4:1, time5:3}
var beaver = {name: "Maple", age:0, animation: "beaver_0.png", time:1, time2:1, time3:1, time4:1, time5:3}
var dragon = {name: "Drago", age:0, animation: "dragon_0.png", time:1, time2:1, time3:1, time4:1, time5:3}
var monkey = {name: "Bonzo", age:0, animation: "monkey_0.png", time:3, time2:3, time3:3, time4:3, time5:3}
var turtle = {name: "Chad", age:0, animation: "turtle_0.png", time:1, time2:1, time3:1, time4:3, time5:3}
var fox = {name: "Fiona", age:0, animation: "fox_0.png", time:3, time2:6, time3:1, time4:3, time5:3}
var seal = {name: "Blubb", age:0, animation: "seal_0.png", time:1, time2:3, time3:1, time4:1, time5:3}
var bat = {name: "Shade", age:0, animation: "bat_0.png", time:1, time2:5, time3:1,  time4:1, time5:3}


var possiblePets = [panda,beaver,fox,bat,dragon,turtle,seal,penguin,otter,monkey];

//create new pet function
function createPet(){
  
  //for some reason these need to be here for the random to work
  var rand = Math.random()
  var ln = possiblePets.length
  var fl = Math.floor(rand*ln)
 console.log(rand)
 console.log(fl)
 console.log(ln)
  
  var pet = possiblePets[Math.floor(Math.random() * possiblePets.length)];
  let defaultImage = document.getElementById('defaultImage');
  let playImage = document.getElementById('playImage');
  let eatImage = document.getElementById('eatImage');
  let sickImage = document.getElementById('sickImage');
  let sleepImage = document.getElementById('sleepImage');
  
  let name = document.getElementById('petName');
  let defaultTime = document.getElementById('anim1');
  let playTime = document.getElementById('anim2');
  let sickTime = document.getElementById('anim3');
  let eatTime = document.getElementById('anim4');
  let sleepTime = document.getElementById('anim5');
  
  defaultImage.href = "default/" + pet.animation
  playImage.href = "play/play_" + pet.animation
  sickImage.href = "sick/sick_" + pet.animation
  eatImage.href = "eat/eat_" + pet.animation
  sleepImage.href = "sleep/sleep_" + pet.animation
  
  name.text = pet.name
  
  defaultTime.to = pet.time
  playTime.to = pet.time2
  sickTime.to = pet.time3
  eatTime.to = pet.time4
  sleepTime.to = pet.time5
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
  //if the happiness meter has reached zero, play sick animation and stop decrementing
  if(happyWidth/device.screen.width == 0){
    return; //play sad animation
  }else{ //otherwise, decrement the hunger meter by 3%
     happyWidth = ((happyWidth/ device.screen.width) - 0.03) * device.screen.width;
     happyMeter.width = happyWidth
  }
}

//increments the happiness meter
function incrementHappy(){
  //if the happiness meter is at zero, stop playing the sick animation
  if(happyWidth/device.screen.width == 0){
    return; 
  }
  //if the happiness meter has reached its limit, do not increment it and disable feed button
  else if(happyWidth/device.screen.width == 0.4){
    return;
  }
  //increment the happiness meter by 3%
  happyWidth = ((happyWidth / device.screen.width) + 0.03) * device.screen.width;
  happyMeter.width = happyWidth
}

//decrements the hunger meter
function decrementHunger(){
  //if the hunger meter has reached zero, play sick animations
  if(hungerWidth/device.screen.width == 0){
    return; 
  }else{ //otherwise, decrement the hunger meter by 3%
     hungerWidth = ((hungerWidth/ device.screen.width) - 0.03) * device.screen.width;
     hungerMeter.width = hungerWidth
  }
}

//increments the hunger meter
function incrementHunger(){
  //if the hunger meter is at zero, stop playing the sick animation and stop decrementing
  if(hungerWidth/device.screen.width == 0){
    return; //stop playing sad animation
  }
  //if the hunger meter has reached its limit, do not increment it
  else if(hungerWidth/device.screen.width == 0.4){
    return;
  }
  //increment the hunger meter by 3%
  hungerWidth = ((hungerWidth / device.screen.width) + 0.03) * device.screen.width;
  hungerMeter.width = hungerWidth
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
  incrementHunger()
  
  setTimeout(function() {
    switchTo(defaultAnimation)
  }, 4000)
 
})

//performs the following every hour
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
    //increments the pets age everyday at midnight
    if (hours == 24){
      return;
    }
    //disabled feed and play buttons at 11pm and starts playing sleep animation
    if (hours == 21){ 
      feed.disable()
      play.disable()
      //play sleep
    }
    //enable feed and play buttons at 7am and stop playing the sleep animation
    if(hours == 7){
      feed.enable()
      play.enable()
      //play default
    }
    //between 7am and 11pm, decrement hunger and happiness every hour
    if (hours >= 7 && hours < 21){ 
      decrementHunger()
      decrementHappy()
    }
  }

createPet()
initialSetUp()
decrementHunger()
decrementHunger()
decrementHunger()