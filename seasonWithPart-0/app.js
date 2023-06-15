const {Console} = require('../console-mpds');
const console = new Console();

const MAX_DAYS_OF_MONTH = 30;

//for(let i = 0; i < 12; i++) {

let dayOfMoth;
do {
    dayOfMoth = console.readNumber('Escriba un día (1-30):');
} while(dayOfMoth < 1 || MAX_DAYS_OF_MONTH < dayOfMoth);

let monthOfYear;
do {
    monthOfYear = console.readNumber('Escriba un mes (1-12):');
}while(monthOfYear < 1 || 12 < monthOfYear);

let year;
do {
    year = console.readNumber('Escriba un año (1-...):');
}while(year < 1);

/*
    dayOfYear = 21;
    dayOfMoth = i+1
    year = 2023;
*/

let dayOfYear = (monthOfYear - 1) * MAX_DAYS_OF_MONTH + dayOfMoth;
const OFFSET_DAYS = 9;
const SPRING_BEGINNING_DAY = 3 * MAX_DAYS_OF_MONTH - OFFSET_DAYS;
const SUMMER_BEGINNING_DAY = 6 * MAX_DAYS_OF_MONTH - OFFSET_DAYS;
const AUTUMN_BEGINNING_DAY = 9 * MAX_DAYS_OF_MONTH - OFFSET_DAYS;
const WINTER_BEGINNING_DAY = 12 * MAX_DAYS_OF_MONTH - OFFSET_DAYS;

let seasonName = 'primavera';
let seassonInit = SPRING_BEGINNING_DAY;
if(dayOfYear >= WINTER_BEGINNING_DAY || dayOfYear < SPRING_BEGINNING_DAY) {
    seasonName = 'invierno';
    seassonInit = WINTER_BEGINNING_DAY;
} else if(dayOfYear >= AUTUMN_BEGINNING_DAY) {
    seasonName = 'otoño';
    seassonInit = AUTUMN_BEGINNING_DAY;
} else if(dayOfYear >= SUMMER_BEGINNING_DAY) {
    seasonName = 'verano';
    seassonInit = SUMMER_BEGINNING_DAY;
} 

let period = 'finales';

if(seasonName === 'invierno') {
    if(dayOfYear >= WINTER_BEGINNING_DAY) {
        period = 'primeros';
    } else if(dayOfYear <= 1*MAX_DAYS_OF_MONTH-9) {
        period = 'mediados';
    }
} else {
    period = 'primeros';
    let currenSeassonDay =  dayOfYear  - seassonInit;
    if(currenSeassonDay >= 60) {
        period = 'finales';
    } else if(currenSeassonDay >= 30) {
        period = 'mediados';
    }
}

const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  } 

console.writeln(array1);
console.writeln(`El día ${dayOfMoth} del mes ${monthOfYear} del año ${year} es ${period} de ${seasonName}`);
//}