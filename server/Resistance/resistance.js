_ = require('lodash');

var Resistance = function(gameId, playersArray){
  this.gameId = gameId;
  var playersObj = {};
  this.playersArray = playersArray;
  this.players = playersObj;
  _initPlayers.call(this, playersArray);

  this.mission = 1;
  this.nomIndex = 0;

  this.missionHistory = [];
  this.currentMission = {};
  this.currentTeam = {};
  this.currentVotes = {};

  this.state = {
    mission: 1,
    stage: 'nominating',
    currentNom: this.playersArray[this.nomIndex],
    started: false,
    missionHistory: this.missionHistory,
  };

  this.missionGuide = {
    1:{
      5: 2,
      6: 2,
      7: 2,
      8: 3,
      9: 3,
      10: 3
    },
    2:{
      5: 3,
      6: 3,
      7: 3,
      8: 4,
      9: 4,
      10: 4
    },
    3:{
      5: 2,
      6: 4,
      7: 3,
      8: 4,
      9: 4,
      10: 4
    },
    4:{
      5: 3,
      6: 3,
      7: 4,
      8: 5,
      9: 5,
      10: 5
    },
    5:{
      5: 3,
      6: 4,
      7: 4,
      8: 5,
      9: 5,
      10: 5
    }
  };

}

// Initializes playersObject with roles
_initPlayers = function(playersArray){
  var that = this;
  var availableRoles = [];

  for(var i=0;i<Math.floor(playersArray.length*.4);i++){
    availableRoles.push('spy');
  }
  while(availableRoles.length < playersArray.length){
    availableRoles.push('resistance');
  }
  console.log(availableRoles)
  availableRoles = _.shuffle(availableRoles);

  _.each(playersArray, function(el){
    var role = availableRoles.pop();
    that.players[el] = {
      name: el,
      nominating: false,
      onTeam: false,
      role: role
    }
  })
}

Resistance.prototype.start = function(){
  this.state.started = true;
}

// action = {
//   verb: 'vote',
//   target: 'no'
// }

Resistance.prototype.doThis = function(playerName, action){
  if(action === 'vote' && this.state.stage === 'voting'){

  }else if(action === 'doMission' && this.state.stage === 'mission'){

  }else if(action === 'nominate' && this.state.stage === 'mission'){

  }
}

Resistance.prototype.next = function(){
}

Resistance.prototype.current = function(){
  return this.state;
}

var test = new Resistance(1, ['John', 'A', 'B', 'C', 'D', 'Yolo', 'Swag', 'Lol', 'Hella', 'GG'])

console.log(test, test.current(), test.start(), test.current());

var Mission = function(num, reqs, playersArray, nominator){
  this.num = num;
  this.required = reqs;
  this.players = playersArray;
  this.voting = false;
  this.nominating = true;
  this.nominator = nominator;
  this.team = [];
  this.votes = {};
  this.missionActions = {};
  this.result = undefined;
}

Mission.prototype.vote = function(voter, target){
  if(this.voting && (this.players.indexOf(target) > -1)){
    this.votes[voter] = target;
    return true;
  }else{
    return false;
  }
}

Mission.prototype.nominate = function(nominator, teamArray){
  if(this.nominating && this.players[this.nominator] === nominator){
    this.team = teamArray;
    return true;
  }else{
    return false;
  }
}

Mission.prototype.doMission = function(agent, action){
  if(this.team.indexOf(agent) >= 0){
    if(action === 'success' || action === 'fail'){
      this.missionActions[action] = this.missionActions ? 1 : this.missionActions + 1;
    }
  }

  
}

Mission.prototype.resolve = function(){

}



// Resistance responsible for keeping track of which mission and players
// Mission responsible for mission state and actions.