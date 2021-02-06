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

//happy meter info
const happyMeter = document.getElementById('happyMeter')
var happyWidth = device.screen.width * 0.4;

//hunger meter info
const hungerMeter = document.getElementById("hungerMeter");
var hungerWidth = device.screen.width * 0.4;

//references feed and play buttons
const feed = document.getElementById("feed");
const play = document.getElementById("play");

var penguin = {name: "Skipper", age:0, animation: "penguin_0.png", time:1}
var otter = {name: "Oscar", age:0, animation: "otter_0.png", time:3}
var panda = {name: "Bamboo", age:0, animation: "panda_0.png", time:3, time2:1}
var beaver = {name: "Maple", age:0, animation: "beaver_0.png", time:1, time2:1}
var dragon = {name: "Drago", age:0, animation: "dragon_0.png", time:1}
var monkey = {name: "Bonzo", age:0, animation: "monkey_0.png", time:3}
var turtle = {name: "Shelldon", age:0, animation: "turtle_0.png", time:1}
var fox = {name: "Fiona", age:0, animation: "fox_0.png", time:3}
var seal = {name: "Blubby", age:0, animation: "seal_0.png", time:1}
var bat = {name: "Shade", age:0, animation: "bat_0.png", time:1}


var possiblePets = [panda,beaver,fox,bat,dragon,turtle,seal,penguin,otter,monkey];


function createPet(){
  var rand = Math.random()
  var ln = possiblePets.length
  var fl = Math.floor(rand*ln)
 console.log(rand)
 console.log(fl)
 console.log(ln)
  var pet = possiblePets[Math.floor(Math.random() * possiblePets.length)];
  let defaultImage = document.getElementById('defaultImage');
  let playImage = document.getElementById('playImage');
  let name = document.getElementById('petName');
  let defaultTime = document.getElementById('anim1');
  let playTime = document.getElementById('anim2');
  defaultImage.href = "default/" + pet.animation
  playImage.href = "play/play_" + pet.animation
  name.text = pet.name
  defaultTime.to = pet.time
  playTime.to = pet.time2
}

//initial set up
function initialSetUp(){
  
  defaultAnimation.animate("enable");
  playAnimation.style.display = "none";
  
  hungerMeter.width = hungerWidth;
  happyMeter.width = happyWidth;
}

//switches the animation to the default one
function switchToDefault(){
  playAnimation.animate("disable");
  
  playAnimation.style.display = "none";
  
  defaultAnimation.style.display ="inline";
  
  defaultAnimation.animate("enable")
}

//switches the animation to the play one
function switchToPlay(){
  defaultAnimation.animate("disable")
  
  defaultAnimation.style.display ="none";
  
  playAnimation.style.display = "inline";
  
  playAnimation.animate("enable");
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
  switchToPlay()
  incrementHappy()
  setTimeout(switchToDefault, 4000)
})

//switches to feed animation on feed button click and increments hunger meter
feed.addEventListener("click", (evt) => {
  //switchToFeed()
  incrementHunger()
  //setTimeaout(switchToDefault, 4000)
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