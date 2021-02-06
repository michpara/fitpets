class Pet{
  constructor(){
    this.age = 0
  }
  
  function getAge(){
    return this.age
  }
  
  function incrementAge(){
    this.age = this.age + 1
  }
}

class Otter extends Pet{
  
  constructor() {
    this.name = "Otto";
    this.color = "blue"
    super(age)
  }

  function getName(){
    return this.name
  }
}

class Panda extends Pet{
  
  constructor() {
    this.name = "Bamboo";
    this.color = "green"
    super(age)
  }
  
  function getName(){
    return this.name
  }
}

class Beaver extends Pet{
  
  constructor() {
    this.name = "Maple";
    this.color = "burlywood"
    super(age)
  }

  function getName(){
    return this.name
  }
}

class Dragon extends Pet{
  
  constructor() {
    this.name = "Drago";
    this.color = "red";
    super(age)
  }
  
  function getName(){
    return this.name
  }
}

class Penguin extends Pet{
  
  constructor() {
    this.name = "Skipper";
    this.color = "light-blue"
    super(age)
  }

  function getName(){
    return this.name
  }
}

class Monkey extends Pet{
  
  constructor() {
    this.name = "Bonzo";
    this.color = "yellow"
    super(age)
  }

  function getName(){
    return this.name
  }
}

class Turtle extends Pet{
  
  constructor() {
    this.name = "Flippy";
    this.color = "beige"
    super(age)
  }

  function getName(){
    return this.name
  }
}

class Fox extends Pet{
  
  constructor() {
    this.name = "Fiona";
    this.color = "orange"
    super(age)
  }
  
  function getName(){
    return this.name
  }
}

class Seal extends Pet{
  
  constructor() {
    this.name = "Blubby";
    this.color = "dark-blue"
    super(age)
  }

  function getName(){
    return this.name
  }
}