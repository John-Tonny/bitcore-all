
var Mnemonic = require('./packages/bitcore-mnemonic');

var words = "rotate scrap radio awesome eight fee degree fee young tone board another";

var m = new Mnemonic(words, null, false);

var seed = m.toSeed();

console.log(m);
console.log(seed);
