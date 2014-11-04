_ = require('lodash');

var Resistance = function(gameId, playersArray){
  this.gameId = gameId;
  var playersObj = {};
  this.playersArray = playersArray;
  this.players = playersObj;
  _initPlayers.call(this, playersArray);

  this.started = false;
  this.mission = 1;
  this.nomIndex = 0;

  this.missionHistory = [];
  this.currentMission = new Mission(this.mission, this.missionGuide[this.mission][this.playersArray.length], this.nomIndex);
  this.currentTeam = {};
  this.currentVotes = {};

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
      role: role
    }
  })
}

Resistance.prototype.start = function(){
  this.started = true;
}

Resistance.prototype.doThis = function(action, playerName, target){
  if(this.started){
    if(action === 'vote' && this.state.stage === 'voting'){
      this.currentMission.vote(playerName, target);
    }else if(action === 'doMission' && this.state.stage === 'mission'){
      this.currentMission.doMission(playerName, target);
    }else if(action === 'nominate' && this.state.stage === 'mission'){
      this.currentMission.nominate(playerName, target);
    }
  }
}

Resistance.prototype.current = function(){
  return this.currentMission;
}


var Mission = function(num, reqs, playersArray, nominator){
  this.num = num;
  this.required = reqs;
  this.players = playersArray;

  this.nominating = true;
  this.voting = false;
  this.onMission = false;

  this.nominator = nominator;
  this.team = [];
  this.votes = {};
  this.missionActions = {};
  this.result = undefined;
}

Mission.prototype.vote = function(voter, vote){
  if(this.voting && this.players.indexOf(voter) >= 0 && typeof this.votes[voter] === 'undefined'){
    this.votes[voter] = vote;
    if(Object.keys(this.votes).length === this.players.length){
      var passes = 0;
      var rejects = 0;
      _.each(this.votes, function(el){
        if(el === 'pass'){
          passes += 1;
        }else if(el === 'reject'){
          rejects += 1;
        }
      })

      if(passes >= rejects){
        this.voting = false;
        this.onMission = true;
        return true;
      }else{
        this.nominator += 1;
        this.nominating = true;
        this.voting = false;
        this.votes = {};
        this.team = {};
        return false;
      }
    }
  }
  return true;

}

Mission.prototype.nominate = function(nominator, teamArray){
  console.log(this.required, teamArray, nominator)
  if(this.nominating && teamArray.length === this.required && nominator === this.players[this.nominator]){
    this.team = teamArray;
    this.nominating = false;
    this.voting = true;
    console.log()
    return true;
  }else{
    return false;
  }
}

Mission.prototype.doMission = function(agent, action){
  if(this.team.indexOf(agent) >= 0){
    if(action === 'success' || action === 'fail'){
      this.missionActions[agent] = action;
    }
  }else{
    return false;
  }

  if(Object.keys(this.missionActions).length === this.team.length){
    this.onMission = false;
    return this.resolve();
  }
  return true;
}

Mission.prototype.resolve = function(){
  var successes = 0;
  var failures = 0;
  _.each(this.missionActions, function(el){
    if(el === 'success'){
      successes += 1;
    }else if(el === 'fail'){
      failures += 1;
    }
  })
  if(this.num === 4 && failures >= 2){
    this.result = 'fail';
  }else if(this.num !== 4 && failures >= 1){
    this.result = 'fail';
  }else{
    this.result = 'success';
  }

  return this.result;
}

exports.resistance = Resistance;

// Resistance responsible for keeping track of which mission and players
// Mission responsible for mission state and actions.