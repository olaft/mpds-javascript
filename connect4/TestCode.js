const { Console } = require(`../console-mpds`);
const console = new Console();
/*class Clazz2 {
  #arr =[1, 2, 3];
  highOrderFunction(zunction) {
    for (let value of this.#arr) {
      zunction(value);
    }
  }
}

class Clazz {

  #attribute;

  constructor(value) {
    this.#attribute = value;
  }

  method(value) {
    console.writeln(this.#attribute);
    console.writeln(value);
  }

  goodMethod(cazz) {
    cazz.highOrderFunction(this.method.bind(this));
  }

}*/

let game = new Clazz2();
let view = new Clazz(`lo que sea`);
view.goodMethod(game);

function Clazz2() { 
  return {
    arr : [1, 2, 3],
    highOrderFunction(zunction) {
      for (let value of this.arr) {
        zunction(value);
      }
    }
  }
}

function Clazz(value) {
  let attribute = value;
  return {
  method(value) {
      console.writeln(attribute);
      console.writeln(value);
    },
  goodMethod(cazz) {
      cazz.highOrderFunction(this.method.bind(this));
    }
  }
}