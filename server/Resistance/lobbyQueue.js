var Resistance = require('./resistance.js').resistance;
var pprint = require('pprint').pp;
var testPlayers = ['Yo', 'Lo', 'Swa', 'G', 'Lol', 'K', 'Test'];
var game = new Resistance(1, testPlayers);
var states = [];
states.push(JSON.stringify(game))
game.start();
states.push(JSON.stringify(game))
console.log(game.current())
game.doThis('nominate', 'Yo', ['Lo', 'Swa'])
states.push(JSON.stringify(game))
console.log(game.current())
testPlayers.forEach(function(el){
  game.doThis('vote', el, 'pass')
})
states.push(JSON.stringify(game))
console.log(game.current())
// states.forEach(function(el){pprint(JSON.parse(el))})