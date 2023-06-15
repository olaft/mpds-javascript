let { input } = require('./console-input.js');

class Console {

  constructor() {
  }

  write(value) {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        let i = 0;
        while (i < value.length) {
          let element = value[i];
          if (Array.isArray(element)) {
            process.stdout.write(`[`);
            this.write(element);
            process.stdout.write(`]`);
          } else {
            process.stdout.write(`${element}`);
            if (i < value.length - 1) {
              process.stdout.write(`, `);
            }
          }
          i++;
        };
      } else {
        process.stdout.write(`${value}`);
      } 
    }
  }

  writeln(value) {
    this.write(value);
    this.write(`\n`);
  }

  readString(title) {
    this.write(title);
    return input(" ");
  }

  readNumber(title) {
    let input;
    do {
      input = parseInt(this.readString(title));
      if (isNaN(input)) {
        console.log('FORMAT ERROR!!! Enter a number formatted value.');
      }
    } while (isNaN(input));
    return input;
  }

}

module.exports.Console = Console;