import clock from "clock";
import document from "document";
import { me as device } from "device";
import { today } from "user-activity";
import { me } from "appbit";


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
  defaultAnimation.animate("enable");
  playAnimation.style.display = "none";
  
  hungerMeter.width = hungerWidth;
  happyMeter.width = happyWidth;
  upFoodValue();
  
  
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
  if(food>0){
    incrementHunger()
    downFoodValue()
  }
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
      while(hours>= 7 && hours <21)
        {
          displaySteps()
        }
    }
  }
initialSetUp()
decrementHunger()
decrementHunger()
decrementHunger()