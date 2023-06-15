const {Console} = require('console-mpds');
const console = new Console();

const numerator = console.readNumber('Dame el numerador');
const denominator = console.readNumber('Dame el denomenador');
let subtrahend;
let gcd;

if(numerator > denominator) {
    gcd = numerator;
    subtrahend = denominator;
} else {
    gcd = denominator;
    subtrahend = numerator;
}

while(gcd != subtrahend && gcd >= 0 && subtrahend > 0) {
    gcd -= subtrahend;
}

console.write(`La fraccion ${numerator}/${denominator} `);
console.write(`${gcd >= 0?`= ${numerator/gcd}/${denominator/gcd} `: ``}`);
console.writeln(`invertida es la fracción ${gcd >= 0 ? `${denominator/gcd}/${numerator/gcd}` : `${denominator}/${numerator}`}`);

/*console.writeln(`La fraccion  ${numerator}/${denominator} \
${gcd >= 0?`= ${numerator/gcd} / ${denominator/gcd}`: ``} \
invertida es la fracción ${gcd >= 0 ? `${denominator/gcd} / ${numerator/gcd}` : `${denominator} / ${numerator}`}`);*/